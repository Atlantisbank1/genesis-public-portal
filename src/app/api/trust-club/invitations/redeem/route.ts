import {
  z,
} from 'zod';

import {
  redeemTrustClubInvitationToken,
} from '@/trust-club/invitation/trust-club-invitation-token-redemption.service';

const requestSchema =
  z.object({
    rawToken:
      z.string()
        .trim()
        .min(
          1,
        )
        .max(
          1024,
        ),
  })
    .strict();

function errorResponse(
  status:
    number,
  code:
    string,
): Response {
  return Response.json(
    {
      status:
        'INVITATION_REDEMPTION_FAILED',

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
  let requestBody:
    unknown;

  try {
    requestBody =
      await request.json();
  }
  catch {
    return errorResponse(
      400,
      'TRUST_CLUB_INVITATION_REDEMPTION_INVALID_REQUEST',
    );
  }

  const parsedBody =
    requestSchema.safeParse(
      requestBody,
    );

  if (
    !parsedBody.success
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_INVITATION_REDEMPTION_INVALID_REQUEST',
    );
  }

  try {
    const redeemed =
      await redeemTrustClubInvitationToken({
        rawToken:
          parsedBody.data.rawToken,
      });

    return Response.json(
      {
        status:
          'INVITATION_REDEEMED',

        invitation: {
          id:
            redeemed.invitation.id,

          status:
            redeemed.invitation.status,

          expiresAt:
            redeemed.invitation.expiresAt,

          approvedAt:
            redeemed.invitation.approvedAt,

          consumedAt:
            redeemed.invitation.consumedAt,
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
  }
  catch (
    error
  ) {
    const code =
      error instanceof Error
        ? error.message
        : 'TRUST_CLUB_INVITATION_REDEMPTION_FAILED';

    if (
      code ===
        'TRUST_CLUB_INVITATION_RAW_TOKEN_REQUIRED' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_INVALID_TOKEN' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_REQUIRES_APPROVED_STATUS' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_MISMATCH' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_ALREADY_CONSUMED' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRATION_REQUIRED' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRATION_INVALID' ||
      code ===
        'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRED'
    ) {
      return errorResponse(
        400,
        'TRUST_CLUB_INVITATION_REDEMPTION_INVALID_TOKEN',
      );
    }

    console.error(
      'Trust Club invitation token redemption failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_INVITATION_REDEMPTION_FAILED',
    );
  }
}

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_PUBLIC_RULE =
  'INVITATION_REDEMPTION_ROUTE_USES_INVITATION_TOKEN_AS_TRANSIENT_BEARER_SECRET' as const;

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_SECRET_RULE =
  'RAW_INVITATION_TOKEN_IS_NEVER_RETURNED_FROM_HTTP_REDEMPTION_ROUTE' as const;

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_MEMBERSHIP_RULE =
  'HTTP_REDEMPTION_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_REGISTRATION_RULE =
  'HTTP_REDEMPTION_DOES_NOT_CREATE_USER_OR_SESSION' as const;

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_CACHE_RULE =
  'INVITATION_REDEMPTION_RESPONSE_IS_NEVER_CACHEABLE' as const;

export const TRUST_CLUB_INVITATION_REDEMPTION_ROUTE_ERROR_DISCLOSURE_RULE =
  'INVALID_EXPIRED_OR_ALREADY_USED_INVITATION_TOKEN_STATES_SHARE_ONE_PUBLIC_ERROR' as const;