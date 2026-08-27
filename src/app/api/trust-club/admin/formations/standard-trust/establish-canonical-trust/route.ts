import {
  establishCanonicalStandardTrust,
} from '@/trust-club/formation/trust-club-standard-trust-establishment.operation';

import {
  authorizeTrustClubAdminReview,
} from '@/trust-club/server/trust-club-admin-review-authorization.service';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

interface EstablishCanonicalTrustRequestBody {
  actionId?:
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

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R25
 * Controlled Canonical Standard Trust Establishment HTTP Boundary
 *
 * Caller supplies:
 * - actionId only.
 *
 * Administrative authority:
 * - derived from authenticated Better Auth session;
 * - verified through the certified Trust Club Admin Review
 *   authorization boundary.
 *
 * This route does NOT:
 * - accept a caller-supplied trustId;
 * - accept memberId;
 * - accept establishedAt;
 * - allocate a Trust ID;
 * - transition Action lifecycle;
 * - replay COMPLETE;
 * - create an Action Outcome;
 * - access Prisma directly;
 * - access PostgreSQL directly;
 * - execute an external service;
 * - access Atlantis.
 */
export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    EstablishCanonicalTrustRequestBody;

  try {
    body =
      await request.json() as
        EstablishCanonicalTrustRequestBody;
  }
  catch {
    return errorResponse(
      400,
      'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUEST_BODY_INVALID',
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
      'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_ID_REQUIRED',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const adminAuthorization =
    await authorizeTrustClubAdminReview({
      adapter:
        authenticationAdapter,

      request: {
        sourceReference:
          'canonical-standard-trust-establishment-route',
      },
    });

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    return errorResponse(
      403,
      'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ADMIN_AUTHORITY_REQUIRED',
    );
  }

  try {
    const established =
      await establishCanonicalStandardTrust({
        actionId:
          body.actionId.trim(),
      });

    return Response.json(
      {
        ok:
          true,

        status:
          'CANONICAL_STANDARD_TRUST_ESTABLISHED',

        actionId:
          established.actionId,

        trustId:
          established.trustId,

        memberId:
          established.memberId,

        trustType:
          established.trustType,

        actionStatus:
          established.actionStatus,

        establishedAt:
          established.establishedAt,

        persisted:
          established.persisted,
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
  }
  catch (
    error
  ) {
    const code =
      error instanceof Error
        ? error.message
        : 'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_FAILED';

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
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_TYPE_INVALID' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUIRES_COMPLETE' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_ID_REQUIRED' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_MEMBER_ID_REQUIRED' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_COMPLETED_OUTCOME_INVALID' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_REQUIRED' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_INVALID' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_EXISTING_TRUST_ID_CONFLICT' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_FORMATION_ACTION_CONFLICT'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_NOT_PERSISTED' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_ID_MISMATCH' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_ID_MISMATCH' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_MEMBER_ID_MISMATCH' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_TYPE_MISMATCH' ||
      code ===
        'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_MISMATCH'
    ) {
      return errorResponse(
        500,
        code,
      );
    }

    console.error(
      'Canonical Standard Trust establishment failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_FAILED',
    );
  }
}

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_METHOD_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_IS_POST_ONLY' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_INPUT_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_ACCEPTS_ACTION_ID_ONLY' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_AUTHORITY_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_REQUIRES_AUTHENTICATED_TRUST_CLUB_ADMIN_AUTHORITY' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_TRUST_ID_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_DOES_NOT_ACCEPT_CALLER_SUPPLIED_TRUST_ID' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_LIFECYCLE_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_DOES_NOT_REPLAY_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_OUTCOME_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_DOES_NOT_CREATE_ACTION_OUTCOME' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ROUTE_CACHE_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_RESPONSE_IS_NOT_CACHEABLE' as const;