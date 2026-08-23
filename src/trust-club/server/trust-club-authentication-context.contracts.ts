/**
 * TRUST-CLUB-V1
 * PHASE 5.16
 *
 * Authentication Context Boundary Contracts
 *
 * Purpose:
 *
 * Defines the controlled server-side representation of an
 * authenticated Trust Club application identity.
 *
 * This contract represents identity state only after an
 * external authentication mechanism has successfully
 * established the identity.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify credentials;
 * - validate passwords;
 * - issue sessions;
 * - validate sessions;
 * - issue tokens;
 * - validate tokens;
 * - create Membership;
 * - create a Trust;
 * - establish Trust ownership;
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

export type TrustClubAuthenticationMethod =
  | 'PASSWORD'
  | 'PASSKEY'
  | 'MAGIC_LINK'
  | 'OAUTH'
  | 'EXTERNAL_IDENTITY_PROVIDER'
  | 'ADMIN_VERIFIED'
  | 'OTHER';

export interface TrustClubAuthenticatedIdentity {
  authenticatedUserId:
    string;

  authenticationMethod:
    TrustClubAuthenticationMethod;

  authenticatedAt:
    string;

  sessionReference?:
    string;

  identityProviderReference?:
    string;
}

export interface TrustClubAuthenticationContextInput {
  identity:
    TrustClubAuthenticatedIdentity | null;
}

export interface TrustClubAuthenticationContextResult {
  authenticated:
    boolean;

  authenticatedUserId:
    string | null;

  authenticationMethod:
    TrustClubAuthenticationMethod | null;

  authenticatedAt:
    string | null;
}

/**
 * Authentication-source rule.
 *
 * Phase 5.16 consumes identity state that has already been
 * established by an external authentication mechanism.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_SOURCE_RULE =
  'AUTHENTICATION_CONTEXT_CONSUMES_EXTERNALLY_ESTABLISHED_IDENTITY' as const;

/**
 * Authentication boundary.
 *
 * The Trust Club authentication context contract does not
 * itself perform authentication.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_EXECUTION_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_PERFORM_AUTHENTICATION' as const;

/**
 * Authorization separation rule.
 *
 * Authentication proves identity only.
 * Authorization remains the responsibility of the existing
 * certified Trust Club authorization domain.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_AUTHORIZATION_RULE =
  'AUTHENTICATION_CONTEXT_IS_NOT_ACTION_AUTHORIZATION' as const;

/**
 * Membership separation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_MEMBERSHIP_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_ESTABLISH_MEMBERSHIP' as const;

/**
 * Trust relationship separation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_TRUST_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_ESTABLISH_TRUST_RELATIONSHIP' as const;

/**
 * Entitlement separation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_ENTITLEMENT_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_RESOLVE_ENTITLEMENTS' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_PERSISTENCE_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_EXPOSURE_RULE =
  'AUTHENTICATION_CONTEXT_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;