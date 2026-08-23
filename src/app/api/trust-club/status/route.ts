import {
  prisma,
} from '@/lib/prisma';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  getTrustClubEligibilityForUser,
  trustClubEligibilityAllowsServiceAccess,
  trustClubEligibilityIsRestricted,
  trustClubEligibilityRequiresReview,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  getTrustClubMemberForUser,
  trustClubMembershipAllowsServiceAccess,
} from '@/trust-club/server/trust-club-production-membership.service';

export async function GET(
  request:
    Request,
): Promise<Response> {
  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const authentication =
    await authenticationAdapter
      .resolveAuthenticatedIdentity({
        sourceReference:
          'trust-club-status-route',
      });

  if (
    authentication.status !==
      'AUTHENTICATED' ||
    authentication.identity ===
      null
  ) {
    return Response.json(
      {
        status:
          'AUTHENTICATION_REQUIRED',
      },
      {
        status:
          401,
      },
    );
  }

  const authenticatedUserId =
    authentication.identity
      .authenticatedUserId;

  const [
    user,
    eligibility,
    membership,
  ] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id:
            authenticatedUserId,
        },

        select: {
          id:
            true,

          name:
            true,

          email:
            true,
        },
      }),

      getTrustClubEligibilityForUser(
        authenticatedUserId,
      ),

      getTrustClubMemberForUser(
        authenticatedUserId,
      ),
    ]);

  if (
    user ===
      null
  ) {
    return Response.json(
      {
        status:
          'AUTHENTICATED_USER_NOT_FOUND',
      },
      {
        status:
          401,
      },
    );
  }

  const eligibilityStatus =
    eligibility?.status ??
    'REVIEW_REQUIRED';

  const eligibilityAllowsAccess =
    trustClubEligibilityAllowsServiceAccess(
      eligibility,
    );

  const membershipAllowsAccess =
    membership !==
      null &&
    trustClubMembershipAllowsServiceAccess(
      membership,
    );

  const canStartTrust =
    eligibilityAllowsAccess &&
    membershipAllowsAccess;

  let accessState:
    | 'REVIEW_REQUIRED'
    | 'RESTRICTED'
    | 'MEMBERSHIP_REQUIRED'
    | 'MEMBERSHIP_PENDING'
    | 'ACTIVE';

  if (
    trustClubEligibilityIsRestricted(
      eligibility,
    )
  ) {
    accessState =
      'RESTRICTED';
  }
  else if (
    trustClubEligibilityRequiresReview(
      eligibility,
    )
  ) {
    accessState =
      'REVIEW_REQUIRED';
  }
  else if (
    membership ===
      null
  ) {
    accessState =
      'MEMBERSHIP_REQUIRED';
  }
  else if (
    !membershipAllowsAccess
  ) {
    accessState =
      'MEMBERSHIP_PENDING';
  }
  else {
    accessState =
      'ACTIVE';
  }

  return Response.json({
    status:
      'READY',

    user: {
      id:
        user.id,

      name:
        user.name,

      email:
        user.email,
    },

    eligibility: {
      status:
        eligibilityStatus,

      persisted:
        eligibility !==
          null,
    },

    membership:
      membership ===
        null
        ? null
        : {
            memberId:
              membership.memberId,

            status:
              membership.status,

            subscriptionStatus:
              membership.subscriptionStatus,

            planCode:
              membership.planCode,
          },

    access: {
      state:
        accessState,

      canStartTrust,
    },
  });
}