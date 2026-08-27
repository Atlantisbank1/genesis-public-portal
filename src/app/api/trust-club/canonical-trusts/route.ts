import {
  NextResponse,
} from 'next/server';

import {
  readAuthenticatedMemberCanonicalTrusts,
} from '@/trust-club/server/trust-club-member-canonical-trust-read.operation';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R30
 * Authenticated Member Canonical Trust Read Route
 *
 * Purpose:
 *
 * Exposes the certified authenticated-member Canonical Trust
 * read operation through a controlled GET Route Handler.
 *
 * Identity authority:
 * - request headers are forwarded to the certified R29 operation;
 * - Better Auth remains authentication authority;
 * - userId is not accepted from caller input;
 * - memberId is not accepted from caller input.
 *
 * This route does NOT:
 * - create Membership;
 * - activate Membership;
 * - create a Trust;
 * - establish a Trust;
 * - allocate a Canonical Trust ID;
 * - transition Action lifecycle;
 * - create Action Outcomes;
 * - access Prisma directly;
 * - perform database writes;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export async function GET(
  request:
    Request,
) {
  try {
    const result =
      await readAuthenticatedMemberCanonicalTrusts({
        requestHeaders:
          request.headers,
      });

    return NextResponse.json(
      result,
      {
        status:
          200,
      },
    );
  }
  catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'TRUST_CLUB_CANONICAL_TRUST_READ_FAILED';

    if (
      message ===
        'TRUST_CLUB_CANONICAL_TRUST_READ_AUTHENTICATION_REQUIRED'
    ) {
      return NextResponse.json(
        {
          error:
            message,
        },
        {
          status:
            401,
        },
      );
    }

    if (
      message ===
        'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBERSHIP_NOT_FOUND'
    ) {
      return NextResponse.json(
        {
          error:
            message,
        },
        {
          status:
            404,
        },
      );
    }

    if (
      message ===
        'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBERSHIP_ACCESS_NOT_ALLOWED'
    ) {
      return NextResponse.json(
        {
          error:
            message,
        },
        {
          status:
            403,
        },
      );
    }

    console.error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_ROUTE_FAILED',
      error,
    );

    return NextResponse.json(
      {
        error:
          'TRUST_CLUB_CANONICAL_TRUST_READ_FAILED',
      },
      {
        status:
          500,
      },
    );
  }
}

export const TRUST_CLUB_CANONICAL_TRUST_READ_ROUTE_METHOD_RULE =
  'CANONICAL_TRUST_READ_ROUTE_IS_GET_ONLY' as const;

export const TRUST_CLUB_CANONICAL_TRUST_READ_ROUTE_IDENTITY_RULE =
  'CANONICAL_TRUST_READ_ROUTE_ACCEPTS_NO_CALLER_SUPPLIED_USER_OR_MEMBER_ID' as const;

export const TRUST_CLUB_CANONICAL_TRUST_READ_ROUTE_DELEGATION_RULE =
  'CANONICAL_TRUST_READ_ROUTE_DELEGATES_TO_AUTHENTICATED_MEMBER_READ_OPERATION' as const;

export const TRUST_CLUB_CANONICAL_TRUST_READ_ROUTE_WRITE_RULE =
  'CANONICAL_TRUST_READ_ROUTE_PERFORMS_NO_DATABASE_WRITE' as const;