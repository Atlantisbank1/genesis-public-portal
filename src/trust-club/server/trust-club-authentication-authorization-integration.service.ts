import {
  assembleTrustClubAuthorizationContext,
} from '../domain/trust-club-authorization-context.service';

import type {
  TrustClubAuthenticationAuthorizationIntegrationInput,
  TrustClubAuthenticationAuthorizationIntegrationResult,
} from './trust-club-authentication-authorization-integration.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.19
 *
 * Authentication -> Authorization Context Integration Service
 *
 * Purpose:
 *
 * Connects an already established Trust Club Authentication
 * Context to the existing certified Authorization Context
 * assembler.
 *
 * This service is intentionally narrow.
 *
 * It does NOT:
 * - authenticate users;
 * - verify credentials;
 * - resolve an authentication source;
 * - create sessions;
 * - validate sessions;
 * - create Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - grant system roles;
 * - resolve entitlements;
 * - activate entitlements;
 * - authorize Trust actions;
 * - access persistence;
 * - access Prisma;
 * - access repositories;
 * - create public application exposure;
 * - modify the Application Gateway;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - establish external completion.
 */

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_AUTHENTICATION_RULE =
  'INTEGRATION_SERVICE_CONSUMES_ESTABLISHED_AUTHENTICATION_CONTEXT' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_UNAUTHENTICATED_RULE =
  'INTEGRATION_SERVICE_FAILS_CLOSED_FOR_UNAUTHENTICATED_CONTEXT' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_DELEGATION_RULE =
  'INTEGRATION_SERVICE_DELEGATES_AUTHORIZATION_CONTEXT_ASSEMBLY' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_DOMAIN_STATE_RULE =
  'INTEGRATION_SERVICE_CONSUMES_ESTABLISHED_AUTHORIZATION_DOMAIN_STATE' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_AUTHORIZATION_RULE =
  'INTEGRATION_SERVICE_DOES_NOT_AUTHORIZE_TRUST_ACTIONS' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_PERSISTENCE_RULE =
  'INTEGRATION_SERVICE_DOES_NOT_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_GATEWAY_RULE =
  'INTEGRATION_SERVICE_DOES_NOT_MODIFY_APPLICATION_GATEWAY' as const;

export const TRUST_CLUB_AUTHENTICATION_AUTHORIZATION_INTEGRATION_SERVICE_EXPOSURE_RULE =
  'INTEGRATION_SERVICE_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;

/**
 * Integrates established Authentication state with established
 * Authorization-domain state.
 *
 * Fail-closed behavior:
 *
 * If Authentication is not established, or if an authenticated
 * user identifier is absent, no Authorization Context is produced.
 *
 * For an authenticated identity, Authorization Context assembly
 * remains delegated to the existing certified domain assembler.
 */
export function integrateTrustClubAuthenticationWithAuthorization(
  input:
    TrustClubAuthenticationAuthorizationIntegrationInput,
): TrustClubAuthenticationAuthorizationIntegrationResult {
  const {
    authenticationContext,
    membership,
    trustRelationship,
    systemRoleContext,
    entitlementResolution,
  } = input;

  if (
    !authenticationContext.authenticated ||
    authenticationContext.authenticatedUserId === null
  ) {
    return null;
  }

  return assembleTrustClubAuthorizationContext({
    identity: {
      authenticatedUserId:
        authenticationContext.authenticatedUserId,
    },

    membership,

    trustRelationship,

    systemRoleContext,

    entitlementResolution,
  });
}