import {
  z,
} from 'zod';

import {
  requestTrustClubInvitation,
} from '@/trust-club/invitation/trust-club-invitation-request.service';

const requestSchema =
  z.object({
    email:
      z.string()
        .trim()
        .email()
        .max(
          320,
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
        'INVITATION_REQUEST_FAILED',

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
      'TRUST_CLUB_INVITATION_REQUEST_INVALID_REQUEST',
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
      'TRUST_CLUB_INVITATION_REQUEST_INVALID_REQUEST',
    );
  }

  try {
    const invitation =
      await requestTrustClubInvitation({
        email:
          parsedBody.data.email,
      });

    return Response.json(
      {
        status:
          'INVITATION_REQUESTED',

        invitation: {
          id:
            invitation.id,

          normalizedEmail:
            invitation.normalizedEmail,

          status:
            invitation.status,

          createdAt:
            invitation.createdAt,
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
  }
  catch (
    error
  ) {
    const code =
      error instanceof Error
        ? error.message
        : 'TRUST_CLUB_INVITATION_REQUEST_FAILED';

    if (
      code ===
        'TRUST_CLUB_INVITATION_REQUEST_EMAIL_REQUIRED'
    ) {
      return errorResponse(
        400,
        'TRUST_CLUB_INVITATION_REQUEST_INVALID_REQUEST',
      );
    }

    console.error(
      'Trust Club invitation request failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_INVITATION_REQUEST_FAILED',
    );
  }
}

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_STATUS_RULE =
  'HTTP_INVITATION_REQUEST_CREATES_REQUESTED_INVITATION_ONLY' as const;

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_TOKEN_RULE =
  'HTTP_INVITATION_REQUEST_DOES_NOT_CREATE_RETURN_OR_ACCEPT_INVITATION_TOKEN' as const;

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_APPROVAL_RULE =
  'HTTP_INVITATION_REQUEST_DOES_NOT_APPROVE_INVITATION' as const;

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_AUTHENTICATION_RULE =
  'HTTP_INVITATION_REQUEST_OCCURS_BEFORE_AUTHENTICATION_IDENTITY_CREATION' as const;

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_MEMBERSHIP_RULE =
  'HTTP_INVITATION_REQUEST_DOES_NOT_ESTABLISH_MEMBERSHIP' as const;

export const TRUST_CLUB_INVITATION_REQUEST_ROUTE_CACHE_RULE =
  'INVITATION_REQUEST_RESPONSE_IS_NEVER_CACHEABLE' as const;