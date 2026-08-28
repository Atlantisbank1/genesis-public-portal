import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  receiveTrustClubSettlementReflectionAsAdmin,
} from '@/trust-club/payment/trust-club-settlement-reflection-admin.service';

interface SettlementRequestBody {
  paymentReference?:
    unknown;

  settlementReference?:
    unknown;

  originatingInstitution?:
    unknown;

  externalTransactionRef?:
    unknown;

  amountMinor?:
    unknown;

  currency?:
    unknown;

  verificationReference?:
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

function optionalText(
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
      'TRUST_CLUB_SETTLEMENT_OPTIONAL_TEXT_INVALID',
    );
  }

  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    SettlementRequestBody;

  try {
    body =
      await request.json() as
        SettlementRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.paymentReference !==
      'string' ||
    body.paymentReference.trim().length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_REFERENCE_REQUIRED',
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

  if (
    typeof body.amountMinor !==
      'string' ||
    !/^[1-9][0-9]*$/.test(
      body.amountMinor,
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_AMOUNT_MINOR_INVALID',
    );
  }

  let amountMinor:
    bigint;

  try {
    amountMinor =
      BigInt(
        body.amountMinor,
      );
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_AMOUNT_MINOR_INVALID',
    );
  }

  if (
    typeof body.currency !==
      'string' ||
    !/^[A-Za-z]{3,12}$/.test(
      body.currency.trim(),
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_CURRENCY_INVALID',
    );
  }

  let originatingInstitution:
    string | null | undefined;

  let externalTransactionRef:
    string | null | undefined;

  let verificationReference:
    string | null | undefined;

  try {
    originatingInstitution =
      optionalText(
        body.originatingInstitution,
      );

    externalTransactionRef =
      optionalText(
        body.externalTransactionRef,
      );

    verificationReference =
      optionalText(
        body.verificationReference,
      );
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_SETTLEMENT_OPTIONAL_TEXT_INVALID',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const settlement =
      await receiveTrustClubSettlementReflectionAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-settlement-receipt-route',
          },
        },

        settlement: {
          paymentReference:
            body.paymentReference,

          settlementReference:
            body.settlementReference,

          originatingInstitution,

          externalTransactionRef,

          amountMinor,

          currency:
            body.currency,

          verificationReference,
        },
      });

    return Response.json(
      {
        ok:
          true,

        settlement: {
          settlementId:
            settlement.settlementId,

          paymentIntentId:
            settlement.paymentIntentId,

          settlementReference:
            settlement.settlementReference,

          originatingInstitution:
            settlement.originatingInstitution,

          externalTransactionRef:
            settlement.externalTransactionRef,

          amountMinor:
            settlement.amountMinor
              .toString(),

          currency:
            settlement.currency,

          status:
            settlement.status,

          receivedAt:
            settlement.receivedAt,

          confirmedAt:
            settlement.confirmedAt,

          verificationReference:
            settlement.verificationReference,

          createdAt:
            settlement.createdAt,
        },
      },
      {
        status:
          201,

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
        : 'TRUST_CLUB_SETTLEMENT_RECEIPT_FAILED';

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_NOT_AWAITING_SETTLEMENT' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_EXPIRED' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_REFERENCE_CONFLICT'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_REFERENCE_REQUIRED' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_AMOUNT_MUST_BE_POSITIVE' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CURRENCY_INVALID' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_AMOUNT_MISMATCH' ||
      code ===
        'TRUST_CLUB_SETTLEMENT_CURRENCY_MISMATCH'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    console.error(
      'Trust Club settlement receipt failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_SETTLEMENT_RECEIPT_FAILED',
    );
  }
}

export const TRUST_CLUB_SETTLEMENT_ROUTE_AUTHENTICATION_RULE =
  'SETTLEMENT_RECEIPT_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_SETTLEMENT_ROUTE_ADMIN_RULE =
  'SETTLEMENT_RECEIPT_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_SETTLEMENT_ROUTE_CALLER_AUTHORITY_RULE =
  'SETTLEMENT_RECEIPT_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_SETTLEMENT_ROUTE_CONFIRMATION_RULE =
  'SETTLEMENT_RECEIPT_ROUTE_DOES_NOT_CONFIRM_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_ROUTE_CACHE_RULE =
  'SETTLEMENT_RECEIPT_RESPONSE_IS_NOT_CACHEABLE' as const;