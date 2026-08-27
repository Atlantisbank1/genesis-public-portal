import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  recoverStandardTrustCanonicalTrustId,
} from '@/trust-club/formation/trust-club-standard-trust-id-recovery.operation';

interface StandardTrustIdRecoveryRequestBody {
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
 * PHASE 9.0
 *
 * Controlled Canonical Trust ID Recovery HTTP Boundary
 *
 * This route exists only for the narrowly defined recovery of
 * an already COMPLETE Standard Trust Action whose canonical
 * trustId was not persisted by a stale historical runtime.
 *
 * Administrative authority is not caller supplied.
 *
 * The route delegates authentication and persisted
 * TRUST_CLUB_ADMIN authority verification to the certified
 * recovery operation.
 *
 * Caller input:
 *
 * - actionId only.
 *
 * Caller does NOT supply:
 *
 * - trustId;
 * - User ID;
 * - Admin role;
 * - System Role;
 * - Membership;
 * - lifecycle status;
 * - Outcome;
 * - external reference;
 * - recovery authority.
 *
 * This route does NOT:
 *
 * - transition lifecycle state;
 * - replay COMPLETE;
 * - create an Action Outcome;
 * - accept a caller-defined Trust ID;
 * - execute an external service;
 * - access Prisma directly;
 * - access PostgreSQL directly;
 * - change Membership;
 * - grant or revoke System Roles;
 * - access Atlantis.
 */
export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    StandardTrustIdRecoveryRequestBody;

  try {
    body =
      await request.json() as
        StandardTrustIdRecoveryRequestBody;
  }
  catch {
    return errorResponse(
      400,
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REQUEST_BODY_INVALID',
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
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_ID_REQUIRED',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const recoveredAt =
    new Date()
      .toISOString();

  try {
    const recovered =
      await recoverStandardTrustCanonicalTrustId({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'standard-trust-canonical-trust-id-recovery-route',
          },
        },

        actionId:
          body.actionId.trim(),

        recoveredAt,
      });

    return Response.json(
      {
        ok:
          true,

        status:
          'CANONICAL_TRUST_ID_RECOVERED',

        actionId:
          recovered.actionId,

        trustId:
          recovered.trustId,

        actionStatus:
          recovered.actionStatus,

        externalReference:
          recovered.externalReference,

        recoveredByUserId:
          recovered.recoveredByUserId,

        persisted:
          recovered.persisted,
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
        : 'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_FAILED';

    if (
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ADMIN_SYSTEM_ROLE_REQUIRED'
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
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_TYPE_INVALID'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REQUIRES_COMPLETE' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_TRUST_ID_ALREADY_ASSIGNED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_INTERNAL_COMPLETION_EVIDENCE_INVALID' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_PENDING_EVIDENCE_INVALID' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_COMPLETED_EVIDENCE_INVALID' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_OUTCOME_CHAIN_INVALID' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_REFERENCE_REQUIRED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_NOT_PERSISTED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_ID_MISMATCH' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_TYPE_CHANGED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_STATUS_CHANGED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_TRUST_ID_NOT_PERSISTED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REQUESTER_CHANGED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_MEMBER_CHANGED' ||
      code ===
        'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_CREATED_AT_CHANGED'
    ) {
      return errorResponse(
        500,
        code,
      );
    }

    console.error(
      'Trust Club canonical Trust ID recovery failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_FAILED',
    );
  }
}

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_METHOD_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_IS_POST_ONLY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_INPUT_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_ACCEPTS_ACTION_ID_ONLY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_AUTHORITY_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_DELEGATES_AUTHORITY_TO_PERSISTED_TRUST_CLUB_ADMIN_BOUNDARY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_TRUST_ID_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_DOES_NOT_ACCEPT_CALLER_SUPPLIED_TRUST_ID' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_LIFECYCLE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_DOES_NOT_REPLAY_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_OUTCOME_RULE =
  'STANDARD_TRUST_ID_RECOVERY_ROUTE_DOES_NOT_CREATE_ACTION_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ROUTE_CACHE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_RESPONSE_IS_NOT_CACHEABLE' as const;