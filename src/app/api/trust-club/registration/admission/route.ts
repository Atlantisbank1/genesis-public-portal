import {
  z,
} from 'zod';

import {
  authorizeTrustClubRegistrationAdmission,
} from '@/trust-club/invitation/trust-club-registration-admission.service';

const requestSchema =
  z.object({
    email:
      z.string()
        .trim()
        .email()
        .max(
          320,
        ),

    rawInvitationToken:
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
        'REGISTRATION_ADMISSION_FAILED',

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
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID_REQUEST',
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
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID_REQUEST',
    );
  }

  try {
    const admission =
      await authorizeTrustClubRegistrationAdmission({
        normalizedEmail:
          parsedBody.data.email,

        rawInvitationToken:
          parsedBody.data.rawInvitationToken,
      });

    return Response.json(
      {
        status:
          'REGISTRATION_ADMITTED',

        admission: {
          invitationId:
            admission.invitationId,

          normalizedEmail:
            admission.normalizedEmail,

          admissionExpiresAt:
            admission.admissionExpiresAt,
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
        : 'TRUST_CLUB_REGISTRATION_ADMISSION_FAILED';

    if (
      code ===
        'TRUST_CLUB_REGISTRATION_ADMISSION_EMAIL_REQUIRED' ||
      code ===
        'TRUST_CLUB_REGISTRATION_ADMISSION_TOKEN_REQUIRED' ||
      code ===
        'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID'
    ) {
      return errorResponse(
        400,
        'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
      );
    }

    console.error(
      'Trust Club registration admission failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_REGISTRATION_ADMISSION_FAILED',
    );
  }
}

export const TRUST_CLUB_REGISTRATION_ADMISSION_ROUTE_ORDER_RULE =
  'REGISTRATION_ADMISSION_MUST_SUCCEED_BEFORE_BETTER_AUTH_SIGN_UP' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_ROUTE_SECRET_RULE =
  'RAW_INVITATION_TOKEN_IS_TRANSIENT_AND_IS_NEVER_RETURNED_FROM_REGISTRATION_ADMISSION_ROUTE' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_ROUTE_AUTHORITY_RULE =
  'REGISTRATION_ADMISSION_ROUTE_DOES_NOT_CREATE_USER_ACCOUNT_SESSION_OR_MEMBERSHIP' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_ROUTE_DISCLOSURE_RULE =
  'INVALID_REGISTRATION_ADMISSION_STATES_SHARE_ONE_PUBLIC_ERROR' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_ROUTE_CACHE_RULE =
  'REGISTRATION_ADMISSION_RESPONSE_IS_NEVER_CACHEABLE' as const;