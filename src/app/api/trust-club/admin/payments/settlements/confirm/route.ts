import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  confirmTrustClubSettlementAsAdmin,
} from '@/trust-club/payment/trust-club-settlement-confirmation-admin.service';

interface ConfirmationRequestBody {
  settlementReference?:
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

export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    ConfirmationRequestBody;

  try {
    body =
      await request.json() as
        ConfirmationRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_CONFIRMATION_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.settlementReference !==
      'string' ||
    body.settlementReference.trim().length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const confirmation =
      await confirmTrustClubSettlementAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-settlement-confirmation-route',
          },
        },

        settlementReference:
          body.settlementReference,
      });

    return Response.json(
      {
        ok:
          true,

        confirmation: {
          settlementId:
            confirmation.settlementId,

          settlementReference:
            confirmation.settlementReference,

          paymentIntentId:
            confirmation.paymentIntentId,

          paymentReference:
            confirmation.paymentReference,

          amountMinor:
            confirmation.amountMinor
              .toString(),

          currency:
            confirmation.currency,

          settlementStatus:
            confirmation.settlementStatus,

          paymentIntentStatus:
            confirmation.paymentIntentStatus,

          settlementConfirmedAt:
            confirmation.settlementConfirmedAt,

          paymentIntentConfirmedAt:
            confirmation.paymentIntentConfirmedAt,
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
        : 'TRUST_CLUB_SETTLEMENT_CONFIRMATION_FAILED';

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_NOT_FOUND' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_PAYMENT_INTENT_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_STATE_DIVERGENCE' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_ACTOR_MISSING' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_REQUIRES_RECEIVED_SETTLEMENT' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_REQUIRES_AWAITING_PAYMENT_INTENT' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_AMOUNT_MISMATCH' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_CURRENCY_MISMATCH' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_SETTLEMENT_UPDATE_FAILED' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_PAYMENT_INTENT_UPDATE_FAILED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    console.error(
      'Trust Club settlement confirmation failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_SETTLEMENT_CONFIRMATION_FAILED',
    );
  }
}

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_AUTHENTICATION_RULE =
  'SETTLEMENT_CONFIRMATION_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_ADMIN_RULE =
  'SETTLEMENT_CONFIRMATION_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_CALLER_AUTHORITY_RULE =
  'SETTLEMENT_CONFIRMATION_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_INPUT_RULE =
  'SETTLEMENT_CONFIRMATION_ROUTE_ACCEPTS_ONLY_SETTLEMENT_REFERENCE_AS_BUSINESS_INPUT' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_TOKEN_RULE =
  'SETTLEMENT_CONFIRMATION_ROUTE_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ROUTE_CACHE_RULE =
  'SETTLEMENT_CONFIRMATION_RESPONSE_IS_NOT_CACHEABLE' as const;