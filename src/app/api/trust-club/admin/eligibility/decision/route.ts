import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  decideTrustClubEligibilityAsAdmin,
} from '@/trust-club/server/trust-club-eligibility-decision.service';

import type {
  TrustClubEligibilityDecisionStatus,
} from '@/trust-club/server/trust-club-eligibility-decision.contracts';

interface EligibilityDecisionRequestBody {
  targetUserId?:
    unknown;

  decision?:
    unknown;

  reasonCode?:
    unknown;

  internalCaseReference?:
    unknown;

  internalNotes?:
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
    },
  );
}

function isDecisionStatus(
  value:
    unknown,
): value is TrustClubEligibilityDecisionStatus {
  return (
    value ===
      'ELIGIBLE' ||
    value ===
      'RESTRICTED'
  );
}

function optionalString(
  value:
    unknown,
): string | null | undefined {
  if (
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    value ===
      null
  ) {
    return null;
  }

  if (
    typeof value !==
      'string'
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_OPTIONAL_TEXT_INVALID',
    );
  }

  return value;
}

export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    EligibilityDecisionRequestBody;

  try {
    body =
      await request.json() as
        EligibilityDecisionRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_ELIGIBILITY_DECISION_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.targetUserId !==
      'string' ||
    body.targetUserId.trim().length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_ELIGIBILITY_DECISION_TARGET_USER_ID_REQUIRED',
    );
  }

  if (
    !isDecisionStatus(
      body.decision,
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_ELIGIBILITY_DECISION_TARGET_STATUS_INVALID',
    );
  }

  if (
    body.reasonCode !==
      undefined &&
    body.reasonCode !==
      null &&
    typeof body.reasonCode !==
      'string'
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_ELIGIBILITY_DECISION_REASON_CODE_INVALID',
    );
  }

  let internalCaseReference:
    string | null | undefined;

  let internalNotes:
    string | null | undefined;

  try {
    internalCaseReference =
      optionalString(
        body.internalCaseReference,
      );

    internalNotes =
      optionalString(
        body.internalNotes,
      );
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_ELIGIBILITY_DECISION_OPTIONAL_TEXT_INVALID',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const decided =
      await decideTrustClubEligibilityAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-eligibility-decision-route',
          },
        },

        targetUserId:
          body.targetUserId,

        decision:
          body.decision,

        reasonCode:
          body.reasonCode as
            never,

        internalCaseReference,

        internalNotes,
      });

    return Response.json(
      {
        ok:
          true,

        eligibility: {
          eligibilityId:
            decided.eligibilityId,

          userId:
            decided.userId,

          status:
            decided.status,

          reasonCode:
            decided.reasonCode,

          effectiveAt:
            decided.effectiveAt,

          reviewedBy:
            decided.reviewedBy,

          reviewedAt:
            decided.reviewedAt,

          liftedAt:
            decided.liftedAt,
        },
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
        : 'TRUST_CLUB_ELIGIBILITY_DECISION_FAILED';

    if (
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_RECORD_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_REQUIRES_REVIEW_REQUIRED_STATUS' ||
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_TRANSITION_PRECONDITION_FAILED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_ELIGIBLE_REASON_CODE_NOT_ALLOWED' ||
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_RESTRICTED_REASON_CODE_REQUIRED' ||
      code ===
        'TRUST_CLUB_ELIGIBILITY_DECISION_TARGET_USER_ID_REQUIRED'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    console.error(
      'Trust Club eligibility decision failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_ELIGIBILITY_DECISION_FAILED',
    );
  }
}

export const TRUST_CLUB_ELIGIBILITY_DECISION_ROUTE_AUTHENTICATION_RULE =
  'ELIGIBILITY_DECISION_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_ROUTE_ADMIN_RULE =
  'ELIGIBILITY_DECISION_ROUTE_DELEGATES_ADMIN_AUTHORITY_TO_CERTIFIED_ADMIN_REVIEW_BOUNDARY' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_ROUTE_CALLER_AUTHORITY_RULE =
  'ELIGIBILITY_DECISION_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_ROUTE_CACHE_RULE =
  'ELIGIBILITY_DECISION_RESPONSE_IS_NOT_CACHEABLE' as const;