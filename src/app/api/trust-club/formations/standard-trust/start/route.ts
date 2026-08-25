import {
  z,
} from 'zod';

import {
  startStandardTrustFormation,
} from '@/trust-club/formation/trust-club-standard-trust-formation-start.operation';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  getTrustClubEligibilityForUser,
  trustClubEligibilityIsRestricted,
  trustClubEligibilityRequiresReview,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  getTrustClubMemberForUser,
  trustClubMembershipAllowsServiceAccess,
} from '@/trust-club/server/trust-club-production-membership.service';

import {
  readTrustClubAction,
} from '@/trust-club/server/trust-club-action-read.operation';

const requestSchema =
  z.object({
    actionId:
      z.string()
        .trim()
        .min(
          1,
        )
        .max(
          160,
        ),
  })
    .strict();

export async function POST(
  request:
    Request,
): Promise<Response> {
  let requestBody:
    unknown;

  try {
    requestBody =
      await request.json();
  }
  catch {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'INVALID_JSON',
      },
      {
        status:
          400,
      },
    );
  }

  const parsedBody =
    requestSchema.safeParse(
      requestBody,
    );

  if (
    !parsedBody.success
  ) {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'ACTION_ID_REQUIRED',
      },
      {
        status:
          400,
      },
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const authenticationRequest = {
    sourceReference:
      'standard-trust-formation-start-route',
  };

  const authentication =
    await authenticationAdapter
      .resolveAuthenticatedIdentity(
        authenticationRequest,
      );

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

  const eligibility =
    await getTrustClubEligibilityForUser(
      authenticatedUserId,
    );

  if (
    trustClubEligibilityIsRestricted(
      eligibility,
    )
  ) {
    return Response.json(
      {
        status:
          'ACCESS_RESTRICTED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    trustClubEligibilityRequiresReview(
      eligibility,
    )
  ) {
    return Response.json(
      {
        status:
          'ELIGIBILITY_REVIEW_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  const membership =
    await getTrustClubMemberForUser(
      authenticatedUserId,
    );

  if (
    membership ===
      null
  ) {
    return Response.json(
      {
        status:
          'MEMBERSHIP_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    !trustClubMembershipAllowsServiceAccess(
      membership,
    )
  ) {
    return Response.json(
      {
        status:
          'MEMBERSHIP_NOT_ACTIVE',
      },
      {
        status:
          403,
      },
    );
  }

  const actionId =
    parsedBody.data.actionId;

  const action =
    await readTrustClubAction({
      actionId,
    });

  if (
    action ===
      null
  ) {
    return Response.json(
      {
        status:
          'ACTION_NOT_FOUND',
      },
      {
        status:
          404,
      },
    );
  }

  if (
    action.actionType !==
      'CREATE_STANDARD_TRUST'
  ) {
    return Response.json(
      {
        status:
          'ACTION_TYPE_NOT_ALLOWED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    action.requestedByUserId !==
      authenticatedUserId
  ) {
    return Response.json(
      {
        status:
          'ACTION_OWNERSHIP_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    action.memberId !==
      membership.memberId
  ) {
    return Response.json(
      {
        status:
          'MEMBER_OWNERSHIP_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    action.status !==
      'AUTHORIZED'
  ) {
    return Response.json(
      {
        status:
          'ACTION_NOT_AUTHORIZED_FOR_START',

        actionStatus:
          action.status,
      },
      {
        status:
          409,
      },
    );
  }

  try {
    const result =
      await startStandardTrustFormation({
        applicationEntry: {
          authenticationSource: {
            adapter:
              authenticationAdapter,

            request:
              authenticationRequest,
          },

          authorizationDomainState: {
            membership: {
              memberId:
                membership.memberId,

              subscriptionStatus:
                membership.subscriptionStatus,
            },

            trustRelationship: {
              trustRoles:
                [],
            },

            systemRoleContext: {
              systemRoles:
                [],
            },

            entitlementResolution: {
              planCode:
                'STANDARD_MEMBERSHIP',

              subscriptionStatus:
                membership.subscriptionStatus,

              basePlanEntitlements: [
                'TRUST_CREATE_STANDARD',
              ],

              activePurchasedEntitlements:
                [],

              effectiveEntitlements: [
                'TRUST_CREATE_STANDARD',
              ],

              membershipAccessActive:
                true,
            },
          },
        },

        actionId,

        updatedAt:
          new Date()
            .toISOString(),
      });

    return Response.json(
      {
        status:
          'FORMATION_STARTED',

        actionId:
          result.actionId,

        previousActionStatus:
          result.previousActionStatus,

        actionStatus:
          result.actionStatus,

        persisted:
          result.persisted,
      },
      {
        status:
          200,
      },
    );
  }
  catch (
    error
  ) {
    if (
      error instanceof Error
    ) {
      if (
        error.message ===
          'TRUST_CLUB_ACTION_NOT_FOUND'
      ) {
        return Response.json(
          {
            status:
              'ACTION_NOT_FOUND',
          },
          {
            status:
              404,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_ACTION_NOT_STANDARD_TRUST_FORMATION'
      ) {
        return Response.json(
          {
            status:
              'ACTION_TYPE_NOT_ALLOWED',
          },
          {
            status:
              403,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_AUTHORIZED_FOR_START'
      ) {
        return Response.json(
          {
            status:
              'ACTION_NOT_AUTHORIZED_FOR_START',
          },
          {
            status:
              409,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_NOT_EXECUTED' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_GATEWAY_TRANSITION_NOT_EXECUTED'
      ) {
        return Response.json(
          {
            status:
              'FORMATION_START_NOT_EXECUTED',
          },
          {
            status:
              409,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_PREVIOUS_STATUS_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_STATUS_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_ACTION_ID_MISMATCH'
      ) {
        return Response.json(
          {
            status:
              'FORMATION_START_TRANSITION_INVARIANT_FAILED',
          },
          {
            status:
              500,
          },
        );
      }
    }

    return Response.json(
      {
        status:
          'FORMATION_START_FAILED',
      },
      {
        status:
          500,
      },
    );
  }
}