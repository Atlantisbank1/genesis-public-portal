import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  createTrustClubPaymentIntentAsAdmin,
} from '@/trust-club/payment/trust-club-payment-intent-admin.service';

import type {
  TrustClubPaymentMethod,
} from '@/trust-club/payment/trust-club-payment-intent.contracts';

interface RouteContext {
  params:
    Promise<{
      invitationId:
        string;
    }>;
}

interface PaymentIntentRequestBody {
  paymentMethod?:
    unknown;

  expiresAt?:
    unknown;
}

const supportedPaymentMethods:
  readonly TrustClubPaymentMethod[] = [
    'INSTITUTIONAL_RAIL',
    'BANK_TRANSFER',
    'STANDING_ORDER',
    'CRYPTO',
    'CASH',
    'MANUAL',
  ];

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

function isTrustClubPaymentMethod(
  value:
    string,
): value is TrustClubPaymentMethod {
  return supportedPaymentMethods
    .includes(
      value as
        TrustClubPaymentMethod,
    );
}

export async function POST(
  request:
    Request,
  context:
    RouteContext,
): Promise<Response> {
  const {
    invitationId,
  } =
    await context.params;

  const normalizedInvitationId =
    invitationId.trim();

  if (
    normalizedInvitationId.length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_INVITATION_ID_REQUIRED',
    );
  }

  let body:
    PaymentIntentRequestBody;

  try {
    body =
      await request.json() as
        PaymentIntentRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_INTENT_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.paymentMethod !==
      'string' ||
    !isTrustClubPaymentMethod(
      body.paymentMethod,
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_METHOD_INVALID',
    );
  }

  let expiresAt:
    Date | null =
      null;

  if (
    body.expiresAt !==
      undefined &&
    body.expiresAt !==
      null
  ) {
    if (
      typeof body.expiresAt !==
        'string'
    ) {
      return errorResponse(
        400,
        'TRUST_CLUB_PAYMENT_EXPIRATION_INVALID',
      );
    }

    expiresAt =
      new Date(
        body.expiresAt,
      );

    if (
      !Number.isFinite(
        expiresAt.getTime(),
      )
    ) {
      return errorResponse(
        400,
        'TRUST_CLUB_PAYMENT_EXPIRATION_INVALID',
      );
    }
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const paymentIntent =
      await createTrustClubPaymentIntentAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-payment-intent-route',
          },
        },

        paymentIntent: {
          invitationId:
            normalizedInvitationId,


          paymentMethod:
            body.paymentMethod,

          expiresAt,
        },
      });

    return Response.json(
      {
        ok:
          true,

        paymentIntent: {
          paymentIntentId:
            paymentIntent.paymentIntentId,

          paymentReference:
            paymentIntent.paymentReference,

          invitationId:
            paymentIntent.invitationId,

          normalizedEmail:
            paymentIntent.normalizedEmail,

          planCode:
            paymentIntent.planCode,

          amountMinor:
            paymentIntent.amountMinor
              .toString(),

          currency:
            paymentIntent.currency,

          paymentMethod:
            paymentIntent.paymentMethod,

          status:
            paymentIntent.status,

          expiresAt:
            paymentIntent.expiresAt,

          createdAt:
            paymentIntent.createdAt,
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
        : 'TRUST_CLUB_PAYMENT_INTENT_CREATION_FAILED';

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INTENT_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INTENT_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INVITATION_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INVITATION_NOT_REQUESTED' ||
      code ===
        'TRUST_CLUB_PAYMENT_INVITATION_ALREADY_AUTHORIZED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INVITATION_ID_REQUIRED' ||
      code ===
        'TRUST_CLUB_PAYMENT_AMOUNT_MUST_BE_POSITIVE' ||
      code ===
        'TRUST_CLUB_PAYMENT_CURRENCY_INVALID' ||
      code ===
        'TRUST_CLUB_PAYMENT_EXPIRATION_INVALID' ||
      code ===
        'TRUST_CLUB_PAYMENT_EXPIRATION_NOT_FUTURE'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    console.error(
      'Trust Club payment intent creation failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_PAYMENT_INTENT_CREATION_FAILED',
    );
  }
}

export const TRUST_CLUB_PAYMENT_INTENT_ROUTE_AUTHENTICATION_RULE =
  'PAYMENT_INTENT_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ROUTE_ADMIN_RULE =
  'PAYMENT_INTENT_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ROUTE_CALLER_AUTHORITY_RULE =
  'PAYMENT_INTENT_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ROUTE_SETTLEMENT_RULE =
  'PAYMENT_INTENT_ROUTE_DOES_NOT_ACCEPT_PAYMENT_CONFIRMATION_FROM_CALLER' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ROUTE_CACHE_RULE =
  'PAYMENT_INTENT_RESPONSE_IS_NOT_CACHEABLE' as const;