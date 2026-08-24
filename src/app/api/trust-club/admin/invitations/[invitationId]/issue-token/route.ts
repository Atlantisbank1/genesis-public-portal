import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  issueTrustClubInvitationTokenAsAdmin,
} from '@/trust-club/invitation/trust-club-invitation-token-issuance.service';

interface RouteContext {
  params:
    Promise<{
      invitationId:
        string;
    }>;
}

interface IssueTokenRequestBody {
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
      'TRUST_CLUB_INVITATION_ID_REQUIRED',
    );
  }

  let body:
    IssueTokenRequestBody;

  try {
    body =
      await request.json() as
        IssueTokenRequestBody;
  } catch {
    return errorResponse(
      400,
      'TRUST_CLUB_INVITATION_ISSUANCE_REQUEST_BODY_INVALID',
    );
  }

  if (
    typeof body.expiresAt !==
      'string'
  ) {
    return errorResponse(
      400,
      'TRUST_CLUB_INVITATION_EXPIRATION_REQUIRED',
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
      'TRUST_CLUB_INVITATION_EXPIRATION_INVALID',
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const issued =
      await issueTrustClubInvitationTokenAsAdmin({
        authenticationSource: {
          adapter:
            authenticationAdapter,

          request: {
            sourceReference:
              'trust-club-admin-invitation-token-issuance-route',
          },
        },

        issuance: {
          invitationId:
            normalizedInvitationId,

          expiresAt,
        },
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

          expiresAt:
            issued.invitation.expiresAt,

          approvedAt:
            issued.invitation.approvedAt,

          approvedByUserId:
            issued.invitation.approvedByUserId,
        },

        rawToken:
          issued.rawToken,
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
        : 'TRUST_CLUB_INVITATION_ISSUANCE_FAILED';

    if (
      code ===
        'TRUST_CLUB_INVITATION_ISSUANCE_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_INVITATION_ISSUANCE_ADMIN_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_INVITATION_NOT_FOUND'
    ) {
      return errorResponse(
        404,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_INVITATION_ISSUANCE_REQUIRES_REQUESTED_STATUS' ||
      code ===
        'TRUST_CLUB_INVITATION_ISSUANCE_REQUESTED_STATE_NOT_CLEAN' ||
      code ===
        'TRUST_CLUB_INVITATION_APPROVAL_PRECONDITION_FAILED'
    ) {
      return errorResponse(
        409,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_INVITATION_EXPIRATION_INVALID' ||
      code ===
        'TRUST_CLUB_INVITATION_EXPIRATION_NOT_AFTER_APPROVAL'
    ) {
      return errorResponse(
        400,
        code,
      );
    }

    console.error(
      'Trust Club invitation token issuance failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_INVITATION_ISSUANCE_FAILED',
    );
  }
}

export const TRUST_CLUB_INVITATION_ISSUANCE_ROUTE_AUTHENTICATION_RULE =
  'INVITATION_ISSUANCE_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_INVITATION_ISSUANCE_ROUTE_ADMIN_RULE =
  'INVITATION_ISSUANCE_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_INVITATION_ISSUANCE_ROUTE_CACHE_RULE =
  'RAW_INVITATION_TOKEN_RESPONSE_IS_NEVER_CACHEABLE' as const;