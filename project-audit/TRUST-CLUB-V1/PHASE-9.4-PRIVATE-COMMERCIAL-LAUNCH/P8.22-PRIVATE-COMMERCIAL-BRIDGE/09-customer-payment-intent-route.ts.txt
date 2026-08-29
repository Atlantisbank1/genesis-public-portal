import {
  TrustClubPaymentMethod,
} from '@/generated/prisma/client';

import {
  trustClubInvitationPersistence,
} from '@/trust-club/invitation/trust-club-invitation.persistence';

import {
  hashTrustClubPaymentAccessToken,
} from '@/trust-club/invitation/trust-club-payment-access-token.service';

import {
  createTrustClubPaymentIntent,
} from '@/trust-club/payment/trust-club-payment-intent.service';

interface CreatePaymentIntentRequestBody {
  paymentAccessToken?:
    unknown;

  paymentMethod?:
    unknown;
}

const SUPPORTED_PAYMENT_METHODS:
  readonly TrustClubPaymentMethod[] = [
    TrustClubPaymentMethod.INSTITUTIONAL_RAIL,
    TrustClubPaymentMethod.BANK_TRANSFER,
    TrustClubPaymentMethod.STANDING_ORDER,
    TrustClubPaymentMethod.CRYPTO,
    TrustClubPaymentMethod.CASH,
    TrustClubPaymentMethod.MANUAL,
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

function isSupportedPaymentMethod(
  value:
    unknown,
): value is TrustClubPaymentMethod {
  return (
    typeof value ===
      'string' &&
    SUPPORTED_PAYMENT_METHODS.includes(
      value as
        TrustClubPaymentMethod,
    )
  );
}

export async function POST(
  request:
    Request,
): Promise<Response> {
  let body:
    CreatePaymentIntentRequestBody;

  try {
    body =
      await request.json() as
        CreatePaymentIntentRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_INTENT_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.paymentAccessToken !==
      'string' ||
    body.paymentAccessToken.trim().length ===
      0
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_ACCESS_TOKEN_REQUIRED',
    );
  }

  if (
    !isSupportedPaymentMethod(
      body.paymentMethod,
    )
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_METHOD_INVALID',
    );
  }

  try {
    const paymentAccessTokenHash =
      hashTrustClubPaymentAccessToken(
        body.paymentAccessToken,
      );

    const invitation =
      await trustClubInvitationPersistence
        .findByPaymentAccessTokenHash(
          paymentAccessTokenHash,
        );

    if (
      invitation ===
        null
    ) {
      return errorResponse(
        404,
        'TRUST_CLUB_PAYMENT_ACCESS_TOKEN_NOT_FOUND',
      );
    }

    if (
      invitation.status !==
        'REQUESTED'
    ) {
      return errorResponse(
        409,
        'TRUST_CLUB_PAYMENT_ACCESS_REQUIRES_REQUESTED_INVITATION',
      );
    }

    if (
      invitation.paymentAccessExpiresAt ===
        null
    ) {
      return errorResponse(
        409,
        'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_MISSING',
      );
    }

    const now =
      new Date();

    if (
      invitation.paymentAccessExpiresAt.getTime() <=
        now.getTime()
    ) {
      return errorResponse(
        410,
        'TRUST_CLUB_PAYMENT_ACCESS_TOKEN_EXPIRED',
      );
    }

    if (
      invitation.tokenHash !==
        null ||
      invitation.expiresAt !==
        null ||
      invitation.approvedByUserId !==
        null ||
      invitation.approvedAt !==
        null ||
      invitation.consumedAt !==
        null
    ) {
      return errorResponse(
        409,
        'TRUST_CLUB_PAYMENT_ACCESS_REGISTRATION_BOUNDARY_NOT_CLEAN',
      );
    }

    const paymentIntent =
      await createTrustClubPaymentIntent({
        invitationId:
          invitation.id,

        paymentMethod:
          body.paymentMethod,
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

          normalizedEmail:
            paymentIntent.normalizedEmail,

          planCode:
            paymentIntent.planCode,

          amountMinor:
            paymentIntent.amountMinor.toString(),

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
        'TRUST_CLUB_PAYMENT_ACCESS_RAW_TOKEN_REQUIRED'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INTENT_INVITATION_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_INTENT_REQUIRES_REQUESTED_INVITATION' ||
      code ===
        'TRUST_CLUB_PAYMENT_INTENT_INVITATION_ALREADY_AUTHORIZED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    console.error(
      'Trust Club private payment intent creation failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_PAYMENT_INTENT_CREATION_FAILED',
    );
  }
}

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_AUTHORITY_RULE =
  'CUSTOMER_PAYMENT_INTENT_AUTHORITY_IS_PRIVATE_PAYMENT_ACCESS_TOKEN_NOT_INVITATION_ID' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_HASH_RULE =
  'CUSTOMER_PAYMENT_ACCESS_TOKEN_IS_SHA256_HASHED_SERVER_SIDE_BEFORE_LOOKUP' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_EXPIRATION_RULE =
  'CUSTOMER_PAYMENT_ACCESS_TOKEN_MUST_BE_UNEXPIRED' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_INVITATION_RULE =
  'CUSTOMER_PAYMENT_ACCESS_REQUIRES_REQUESTED_INVITATION' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_PRICING_RULE =
  'CUSTOMER_CANNOT_SUPPLY_AUTHORITATIVE_AMOUNT_OR_CURRENCY' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_REGISTRATION_RULE =
  'CUSTOMER_PAYMENT_ACCESS_DOES_NOT_AUTHORIZE_REGISTRATION' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_ROUTE_SETTLEMENT_RULE =
  'CUSTOMER_PAYMENT_METHOD_SELECTION_DOES_NOT_CONFIRM_SETTLEMENT' as const;