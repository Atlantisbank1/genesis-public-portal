import {
  prisma,
} from "../../src/lib/prisma";

import {
  authorizeTrustClubAdminReview,
} from "../../src/trust-club/server/trust-club-admin-review-authorization.service";

import type {
  TrustClubAuthenticationSourceAdapter,
} from "../../src/trust-club/server/trust-club-authentication-source.contracts";

async function main() {
  const users =
    await prisma.user.findMany({
      select: {
        id:
          true,
      },

      orderBy: {
        createdAt:
          "asc",
      },
    });

  const adminAssignments =
    await prisma.trustClubSystemRoleAssignment.findMany({
      where: {
        role:
          "TRUST_CLUB_ADMIN",
      },

      select: {
        userId:
          true,
      },

      orderBy: {
        createdAt:
          "asc",
      },
    });

  if (adminAssignments.length < 1) {
    throw new Error(
      "VERIFICATION_ADMIN_CASE_NOT_AVAILABLE",
    );
  }

  const adminUserIds =
    new Set(
      adminAssignments.map(
        (
          assignment,
        ) =>
          assignment.userId,
      ),
    );

  const adminUserId =
    adminAssignments[0].userId;

  const nonAdminUser =
    users.find(
      (
        user,
      ) =>
        !adminUserIds.has(
          user.id,
        ),
    );

  if (!nonAdminUser) {
    throw new Error(
      "VERIFICATION_NON_ADMIN_CASE_NOT_AVAILABLE",
    );
  }

  function createAuthenticatedAdapter(
    authenticatedUserId:
      string,
  ): TrustClubAuthenticationSourceAdapter {
    return {
      async resolveAuthenticatedIdentity() {
        return {
          status:
            "AUTHENTICATED",

          identity: {
            authenticatedUserId,

            authenticationMethod:
              "ADMIN_VERIFIED",

            authenticatedAt:
              "2026-08-23T00:00:00.000Z",
          },
        };
      },
    };
  }

  const nonAdminResult =
    await authorizeTrustClubAdminReview({
      adapter:
        createAuthenticatedAdapter(
          nonAdminUser.id,
        ),

      request: {
        sourceReference:
          "PHASE_6_8_6D_4E_NON_ADMIN",
      },
    });

  const adminResult =
    await authorizeTrustClubAdminReview({
      adapter:
        createAuthenticatedAdapter(
          adminUserId,
        ),

      request: {
        sourceReference:
          "PHASE_6_8_6D_4E_ADMIN",
      },
    });

  console.log(
    JSON.stringify(
      {
        nonAdminResult,
        adminResult,
      },
      null,
      2,
    ),
  );

  if (
    nonAdminResult.status !==
      "ADMIN_SYSTEM_ROLE_REQUIRED"
  ) {
    throw new Error(
      "VERIFICATION_NON_ADMIN_NOT_DENIED",
    );
  }

  if (
    nonAdminResult.authenticatedUserId !==
      nonAdminUser.id
  ) {
    throw new Error(
      "VERIFICATION_NON_ADMIN_ID_MISMATCH",
    );
  }

  if (
    adminResult.status !==
      "AUTHORIZED"
  ) {
    throw new Error(
      "VERIFICATION_ADMIN_NOT_AUTHORIZED",
    );
  }

  if (
    adminResult.authenticatedUserId !==
      adminUserId
  ) {
    throw new Error(
      "VERIFICATION_ADMIN_ID_MISMATCH",
    );
  }

  console.log("");
  console.log(
    "CORRECTED PERSISTED AUTHORIZATION VERIFICATION: PASS",
  );
}

main()
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  )
  .catch(
    (
      error,
    ) => {
      console.error(error);

      process.exitCode =
        1;
    },
  );
