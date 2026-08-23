import type {
  TrustClubAuthenticatedIdentity,
  TrustClubAuthenticationMethod,
} from './trust-club-authentication-context.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.17
 *
 * Authentication Source Adapter Contracts
 *
 * Purpose:
 *
 * Defines a provider-neutral server-side boundary through which
 * a future authentication source may supply an already-verified
 * Trust Club identity to the certified Phase 5.16 authentication
 * context boundary.
 *
 * Phase 5.17 defines contracts only.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify credentials;
 * - validate passwords;
 * - validate passkeys;
 * - process magic links;
 * - execute OAuth;
 * - call an identity provider;
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
 * - execute external services.
 */

export type TrustClubAuthenticationSourceStatus =
  | 'AUTHENTICATED'
  | 'UNAUTHENTICATED';

export interface TrustClubAuthenticationSourceRequest {
  sourceReference?:
    string;
}

export interface TrustClubAuthenticationSourceResult {
  status:
    TrustClubAuthenticationSourceStatus;

  identity:
    TrustClubAuthenticatedIdentity | null;
}

export interface TrustClubAuthenticationSourceAdapter {
  resolveAuthenticatedIdentity(
    request:
      TrustClubAuthenticationSourceRequest,
  ): Promise<TrustClubAuthenticationSourceResult>;
}

/**
 * Source-neutrality rule.
 *
 * The Trust Club application boundary must not depend directly
 * on a specific authentication provider implementation.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_NEUTRALITY_RULE =
  'AUTHENTICATION_SOURCE_BOUNDARY_IS_PROVIDER_NEUTRAL' as const;

/**
 * Verified-identity rule.
 *
 * An authentication source adapter may return an authenticated
 * identity only after its underlying authentication source has
 * independently established that identity.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_IDENTITY_RULE =
  'AUTHENTICATION_SOURCE_RETURNS_ONLY_EXTERNALLY_ESTABLISHED_IDENTITY' as const;

/**
 * Unauthenticated-state rule.
 *
 * An unresolved or unauthenticated source must return null
 * identity rather than inventing identity state.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_UNAUTHENTICATED_RULE =
  'UNAUTHENTICATED_SOURCE_RETURNS_NULL_IDENTITY' as const;

/**
 * Phase 5.16 integration rule.
 *
 * Authentication source output is intended to feed the
 * certified Phase 5.16 Authentication Context Boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_CONTEXT_RULE =
  'AUTHENTICATION_SOURCE_OUTPUT_FEEDS_AUTHENTICATION_CONTEXT_BOUNDARY' as const;

/**
 * Authorization separation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_AUTHORIZATION_RULE =
  'AUTHENTICATION_SOURCE_IS_NOT_ACTION_AUTHORIZATION' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_PERSISTENCE_RULE =
  'AUTHENTICATION_SOURCE_CONTRACT_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_SOURCE_EXPOSURE_RULE =
  'AUTHENTICATION_SOURCE_CONTRACT_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;

/**
 * Method vocabulary compatibility.
 *
 * Keeps the source boundary aligned with the authentication
 * method vocabulary certified in Phase 5.16.
 */
export type TrustClubAuthenticationSourceMethod =
  TrustClubAuthenticationMethod;