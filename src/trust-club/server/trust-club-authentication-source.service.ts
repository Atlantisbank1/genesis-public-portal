import type {
  TrustClubAuthenticationSourceAdapter,
  TrustClubAuthenticationSourceRequest,
  TrustClubAuthenticationSourceResult,
} from './trust-club-authentication-source.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.17
 *
 * Authentication Source Adapter Service
 *
 * Purpose:
 *
 * Provides a provider-neutral application boundary for resolving
 * authenticated identity state through an externally supplied
 * authentication source adapter.
 *
 * The service delegates authentication-source execution to the
 * supplied adapter and validates only the consistency of the
 * returned source result.
 *
 * It does NOT:
 * - authenticate a user itself;
 * - verify credentials;
 * - validate passwords;
 * - validate passkeys;
 * - process magic links;
 * - execute OAuth directly;
 * - call a specific identity provider directly;
 * - issue sessions;
 * - validate sessions;
 * - issue tokens;
 * - validate tokens;
 * - access cookies;
 * - access request headers;
 * - create Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - resolve entitlements;
 * - authorize Trust actions;
 * - access a database;
 * - access Prisma;
 * - access persistence;
 * - access repositories;
 * - create a Next.js Route Handler;
 * - create a Server Action;
 * - create a public API;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - establish external completion.
 */

function assertAuthenticationSourceResultConsistency(
  result:
    TrustClubAuthenticationSourceResult,
): void {
  if (
    result.status ===
      'AUTHENTICATED' &&
    result.identity ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_AUTHENTICATION_SOURCE_INVALID_AUTHENTICATED_RESULT',
    );
  }

  if (
    result.status ===
      'UNAUTHENTICATED' &&
    result.identity !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_AUTHENTICATION_SOURCE_INVALID_UNAUTHENTICATED_RESULT',
    );
  }
}

export async function resolveTrustClubAuthenticationSource(
  adapter:
    TrustClubAuthenticationSourceAdapter,
  request:
    TrustClubAuthenticationSourceRequest,
): Promise<TrustClubAuthenticationSourceResult> {
  const result =
    await adapter.resolveAuthenticatedIdentity(
      request,
    );

  assertAuthenticationSourceResultConsistency(
    result,
  );

  return result;
}

/**
 * Delegation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_DELEGATION_RULE =
  'AUTHENTICATION_SOURCE_SERVICE_DELEGATES_TO_SUPPLIED_SOURCE_ADAPTER' as const;

/**
 * Provider-neutrality rule.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_NEUTRALITY_RULE =
  'AUTHENTICATION_SOURCE_SERVICE_DOES_NOT_DEPEND_ON_SPECIFIC_PROVIDER' as const;

/**
 * Authenticated-result consistency rule.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_AUTHENTICATED_RULE =
  'AUTHENTICATED_SOURCE_RESULT_REQUIRES_IDENTITY' as const;

/**
 * Unauthenticated-result consistency rule.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_UNAUTHENTICATED_RULE =
  'UNAUTHENTICATED_SOURCE_RESULT_REQUIRES_NULL_IDENTITY' as const;

/**
 * Authorization boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_AUTHORIZATION_RULE =
  'AUTHENTICATION_SOURCE_SERVICE_DOES_NOT_AUTHORIZE_TRUST_ACTIONS' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_PERSISTENCE_RULE =
  'AUTHENTICATION_SOURCE_SERVICE_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_SERVICE_EXPOSURE_RULE =
  'AUTHENTICATION_SOURCE_SERVICE_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;