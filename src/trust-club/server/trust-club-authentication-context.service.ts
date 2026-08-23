import type {
  TrustClubAuthenticationContextInput,
  TrustClubAuthenticationContextResult,
} from './trust-club-authentication-context.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.16
 *
 * Authentication Context Assembly Service
 *
 * Purpose:
 *
 * Converts externally established authentication identity state
 * into the controlled Trust Club authentication context result.
 *
 * This service is deterministic application-boundary logic only.
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
 * - establish Trust relationships;
 * - grant Trust roles;
 * - resolve entitlements;
 * - authorize Trust actions;
 * - access a database;
 * - access Prisma;
 * - access persistence;
 * - access repositories;
 * - create a Route Handler;
 * - create a Server Action;
 * - create a public API;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services.
 */

export function assembleTrustClubAuthenticationContext(
  input:
    TrustClubAuthenticationContextInput,
): TrustClubAuthenticationContextResult {
  const identity =
    input.identity;

  if (!identity) {
    return {
      authenticated:
        false,

      authenticatedUserId:
        null,

      authenticationMethod:
        null,

      authenticatedAt:
        null,
    };
  }

  return {
    authenticated:
      true,

    authenticatedUserId:
      identity.authenticatedUserId,

    authenticationMethod:
      identity.authenticationMethod,

    authenticatedAt:
      identity.authenticatedAt,
  };
}

/**
 * Identity propagation rule.
 *
 * The assembler preserves identity data supplied by an
 * already-established authentication source.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_IDENTITY_RULE =
  'AUTHENTICATION_CONTEXT_PRESERVES_EXTERNALLY_ESTABLISHED_IDENTITY' as const;

/**
 * Unauthenticated-state rule.
 *
 * Missing identity state produces an explicit unauthenticated
 * result rather than inventing or inferring identity.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_UNAUTHENTICATED_RULE =
  'MISSING_IDENTITY_PRODUCES_UNAUTHENTICATED_CONTEXT' as const;

/**
 * Execution boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_SERVICE_EXECUTION_RULE =
  'AUTHENTICATION_CONTEXT_SERVICE_DOES_NOT_PERFORM_AUTHENTICATION' as const;

/**
 * Authorization boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_SERVICE_AUTHORIZATION_RULE =
  'AUTHENTICATION_CONTEXT_SERVICE_DOES_NOT_AUTHORIZE_TRUST_ACTIONS' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_SERVICE_PERSISTENCE_RULE =
  'AUTHENTICATION_CONTEXT_SERVICE_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_CONTEXT_SERVICE_EXPOSURE_RULE =
  'AUTHENTICATION_CONTEXT_SERVICE_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;