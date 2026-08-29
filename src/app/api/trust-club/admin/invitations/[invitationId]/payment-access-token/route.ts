import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  issueTrustClubPaymentAccessTokenAsAdmin,
} from '@/trust-club/invitation/trust-club-payment-access-token.service';

interface RouteContext {
  params:
    Promise<{
      invitationId:
        string;
    }>;
}

interface IssuePaymentAccessTokenRequestBody {
  expiresAt?:
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
      'TRUST_CLUB_PAYMENT_ACCESS_INVITATION_ID_REQUIRED',
    );
  }

  let body:
    IssuePaymentAccessTokenRequestBody;

  try {
    body =
      await request.json() as
        IssuePaymentAccessTokenRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_ACCESS_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.expiresAt !==
      'string'
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_REQUIRED',
    );
  }

  const expiresAt =
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
      'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_INVALID',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const issued =
      await issueTrustClubPaymentAccessTokenAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-payment-access-token-issuance-route',
          },
        },

        invitationId:
          normalizedInvitationId,

        expiresAt,
      });

    return Response.json(
      {
        ok:
          true,

        invitation: {
          id:
            issued.invitation.id,

          normalizedEmail:
            issued.invitation.normalizedEmail,

          status:
            issued.invitation.status,

          paymentAccessExpiresAt:
            issued.invitation.paymentAccessExpiresAt,
        },

        rawPaymentAccessToken:
          issued.rawPaymentAccessToken,
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
        : 'TRUST_CLUB_PAYMENT_ACCESS_ISSUANCE_FAILED';

    if (
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_INVITATION_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_INVITATION_ID_REQUIRED' ||
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_INVALID' ||
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_NOT_AFTER_ISSUANCE'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_REQUIRES_REQUESTED_INVITATION' ||
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_REGISTRATION_BOUNDARY_NOT_CLEAN' ||
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_ALREADY_ISSUED' ||
      code ===
        'TRUST_CLUB_PAYMENT_ACCESS_PERSISTENCE_PRECONDITION_FAILED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    console.error(
      'Trust Club private payment access token issuance failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_PAYMENT_ACCESS_ISSUANCE_FAILED',
    );
  }
}

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_AUTHENTICATION_RULE =
  'PRIVATE_PAYMENT_ACCESS_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_ADMIN_RULE =
  'PRIVATE_PAYMENT_ACCESS_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_RAW_TOKEN_RULE =
  'PRIVATE_PAYMENT_ACCESS_ROUTE_RETURNS_RAW_TOKEN_ONLY_AT_ADMIN_ISSUANCE_BOUNDARY' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_HASH_EXPOSURE_RULE =
  'PRIVATE_PAYMENT_ACCESS_ROUTE_DOES_NOT_EXPOSE_PERSISTED_TOKEN_HASH' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_CACHE_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_RESPONSE_IS_NEVER_CACHEABLE' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_ROUTE_PAYMENT_RULE =
  'PRIVATE_PAYMENT_ACCESS_ROUTE_DOES_NOT_CREATE_PAYMENT_INTENT_OR_CONFIRM_SETTLEMENT' as const;