import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  readTrustClubAdminLaunchQueue,
} from '@/trust-club/server/trust-club-admin-launch-queue.service';

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

export async function GET(
  request:
    Request,
): Promise<Response> {
  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  try {
    const queue =
      await readTrustClubAdminLaunchQueue({
        adapter:
          authenticationAdapter,

        request: {
          sourceReference:
            'trust-club-admin-launch-queue-route',
        },
      });

    return Response.json(
      {
        ok:
          true,

        queue,
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
        : 'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_READ_FAILED';

    if (
      code ===
        'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_AUTHENTICATION_REQUIRED'
    ) {
      return errorResponse(
        401,
        code,
      );
    }

    if (
      code ===
        'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_SYSTEM_ROLE_REQUIRED'
    ) {
      return errorResponse(
        403,
        code,
      );
    }

    console.error(
      'Trust Club admin launch queue read failed.',
      error,
    );

    return errorResponse(
      500,
      'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_READ_FAILED',
    );
  }
}

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_ROUTE_AUTHENTICATION_RULE =
  'ADMIN_LAUNCH_QUEUE_ROUTE_USES_BETTER_AUTH_REQUEST_HEADERS' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_ROUTE_ADMIN_RULE =
  'ADMIN_LAUNCH_QUEUE_ROUTE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_ROUTE_READ_ONLY_RULE =
  'ADMIN_LAUNCH_QUEUE_ROUTE_PERFORMS_NO_DOMAIN_MUTATION' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_ROUTE_CACHE_RULE =
  'ADMIN_LAUNCH_QUEUE_RESPONSE_IS_NOT_CACHEABLE' as const;