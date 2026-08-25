import {
  z,
} from 'zod';

import {
  completeStandardTrustFormation,
} from '@/trust-club/formation/trust-club-standard-trust-formation-complete.operation';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

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

    externalReference:
      z.string()
        .trim()
        .min(
          1,
        )
        .max(
          500,
        ),

    completedAt:
      z.string()
        .trim()
        .min(
          1,
        )
        .max(
          100,
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
          'FINAL_COMPLETION_INPUT_INVALID',
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
      'standard-trust-formation-admin-complete-route',
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
    action.status !==
      'EXTERNAL_PENDING'
  ) {
    return Response.json(
      {
        status:
          'ACTION_NOT_EXTERNAL_PENDING_FOR_COMPLETION',

        actionStatus:
          action.status,
      },
      {
        status:
          409,
      },
    );
  }

  const now =
    new Date()
      .toISOString();

  try {
    const result =
      await completeStandardTrustFormation({
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
                action.memberId,

              subscriptionStatus:
                'ACTIVE',
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
                'ACTIVE',

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

        externalReference:
          parsedBody.data.externalReference,

        completedAt:
          parsedBody.data.completedAt,

        verifiedAt:
          now,

        updatedAt:
          now,

        recordedAt:
          now,
      });

    return Response.json(
      {
        status:
          'FORMATION_COMPLETE',

        actionId:
          result.actionId,

        previousActionStatus:
          result.previousActionStatus,

        actionStatus:
          result.actionStatus,

        outcomeType:
          result.outcomeType,

        externalReference:
          result.externalReference,

        verifiedByUserId:
          result.verifiedByUserId,

        transitionPersisted:
          result.transitionPersisted,

        outcomePersisted:
          result.outcomePersisted,
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
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_EXTERNAL_PENDING_FOR_COMPLETION'
      ) {
        return Response.json(
          {
            status:
              'ACTION_NOT_EXTERNAL_PENDING_FOR_COMPLETION',
          },
          {
            status:
              409,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_COMPLETION_NOT_VERIFIED'
      ) {
        return Response.json(
          {
            status:
              'EXTERNAL_COMPLETION_VERIFICATION_REQUIRED',
          },
          {
            status:
              403,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_VERIFICATION_ACTION_ID_MISMATCH'
      ) {
        return Response.json(
          {
            status:
              'EXTERNAL_COMPLETION_VERIFICATION_INVARIANT_FAILED',
          },
          {
            status:
              500,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRANSITION_NOT_EXECUTED' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_GATEWAY_TRANSITION_NOT_EXECUTED'
      ) {
        return Response.json(
          {
            status:
              'FINAL_COMPLETION_TRANSITION_NOT_EXECUTED',
          },
          {
            status:
              409,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_PREVIOUS_STATUS_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_STATUS_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_ACTION_ID_MISMATCH'
      ) {
        return Response.json(
          {
            status:
              'FINAL_COMPLETION_TRANSITION_INVARIANT_FAILED',
          },
          {
            status:
              500,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_NOT_EXECUTED' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_GATEWAY_OUTCOME_NOT_EXECUTED' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_NOT_CREATED'
      ) {
        return Response.json(
          {
            status:
              'COMPLETED_OUTCOME_NOT_RECORDED',
          },
          {
            status:
              409,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_ACTION_ID_MISMATCH' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_STATUS_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_TYPE_INVALID' ||
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_EXTERNAL_REFERENCE_MISMATCH'
      ) {
        return Response.json(
          {
            status:
              'COMPLETED_OUTCOME_INVARIANT_FAILED',
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
          'FORMATION_FINAL_COMPLETION_FAILED',
      },
      {
        status:
          500,
      },
    );
  }
}