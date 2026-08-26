import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  reviewStandardTrustFormationAsAdmin,
} from '@/trust-club/formation/trust-club-standard-trust-formation-admin-review.operation';

import type {
  StandardTrustFormationAdminReviewDecision,
} from '@/trust-club/formation/trust-club-standard-trust-formation-admin-review.operation';

interface StandardTrustFormationAdminReviewRequestBody {
  actionId?:
    unknown;

  decision?:
    unknown;
}

function errorResponse(
  status:
    number,
  code:
    string,
): Response {
  return Response.json(
    {
      ok:
        false,

      error:
        code,
    },
    {
      status,

      headers: {
        'Cache-Control':
          'no-store',

        Pragma:
          'no-cache',
      },
    },
  );
}

function isReviewDecision(
  value:
    unknown,
): value is StandardTrustFormationAdminReviewDecision {
  return (
    value ===
      'AUTHORIZE' ||
    value ===
      'REJECT'
  );
}

export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    StandardTrustFormationAdminReviewRequestBody;

  try {
    body =
      await request.json() as
        StandardTrustFormationAdminReviewRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_ADMIN_REVIEW_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.actionId !==
      'string' ||
    body.actionId.trim().length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_ADMIN_REVIEW_ACTION_ID_REQUIRED',
    );
  }

  if (
    !isReviewDecision(
      body.decision,
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_ADMIN_REVIEW_DECISION_INVALID',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const now =
    new Date()
      .toISOString();

  try {
    const reviewed =
      await reviewStandardTrustFormationAsAdmin({
        applicationEntry: {
          authenticationSource: {
            adapter:
              authenticationAdapter,

            request: {
              sourceReference:
                'standard-trust-formation-admin-review-route',
            },
          },

          authorizationDomainState: {
            membership: {
              memberId:
                'ADMIN_REVIEW_ROUTE_AUTHORIZATION_CONTEXT',

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

              basePlanEntitlements:
                [],

              activePurchasedEntitlements:
                [],

              effectiveEntitlements:
                [],

              membershipAccessActive:
                true,
            },
          },
        },

        actionId:
          body.actionId.trim(),

        decision:
          body.decision,

        updatedAt:
          now,
      });

    return Response.json(
      {
        ok:
          true,

        status:
          'REVIEW_DECISION_APPLIED',

        actionId:
          reviewed.actionId,

        reviewedByUserId:
          reviewed.reviewedByUserId,

        decision:
          reviewed.decision,

        previousActionStatus:
          reviewed.previousActionStatus,

        actionStatus:
          reviewed.actionStatus,

        persisted:
          reviewed.persisted,
      },
      {
        status:
          200,

        headers: {
          'Cache-Control':
            'no-store',

          Pragma:
            'no-cache',
        },
      },
    );
  } catch (
    error
  ) {
    const code =
      error instanceof Error
        ? error.message
        : 'TRUST_CLUB_ADMIN_REVIEW_FAILED';

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ACTION_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_ACTION_NOT_STANDARD_TRUST_FORMATION'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_ACTION_NOT_PENDING_REVIEW'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_TRANSITION_NOT_EXECUTED' ||
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_GATEWAY_TRANSITION_NOT_EXECUTED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_ACTION_ID_MISMATCH' ||
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_PREVIOUS_STATUS_INVALID' ||
      code ===
        'TRUST_CLUB_ADMIN_REVIEW_TARGET_STATUS_INVALID'
    ) {
      return errorResponse(
        500,
        code,
      );
    }

    console.error(
      'Trust Club standard trust admin review failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_ADMIN_REVIEW_FAILED',
    );
  }
}

export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_ROUTE_AUTHENTICATION_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_ROUTE_ADMIN_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_ROUTE_DELEGATES_ADMIN_AUTHORITY_TO_CERTIFIED_ADMIN_REVIEW_BOUNDARY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_ROUTE_CALLER_AUTHORITY_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY_OR_SYSTEM_ROLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_ROUTE_DECISION_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_ROUTE_ACCEPTS_AUTHORIZE_OR_REJECT_ONLY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_ROUTE_CACHE_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_RESPONSE_IS_NOT_CACHEABLE' as const;
