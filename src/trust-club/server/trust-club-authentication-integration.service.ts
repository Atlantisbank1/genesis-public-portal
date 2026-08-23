import type {
  TrustClubAuthenticationSourceAdapter,
  TrustClubAuthenticationSourceRequest,
} from './trust-club-authentication-source.contracts';

import {
  resolveTrustClubAuthenticationSource,
} from './trust-club-authentication-source.service';

import type {
  TrustClubAuthenticationContextResult,
} from './trust-club-authentication-context.contracts';

import {
  assembleTrustClubAuthenticationContext,
} from './trust-club-authentication-context.service';

/**
 * TRUST-CLUB-V1
 * PHASE 5.18
 *
 * Authentication Source -> Context Integration Service
 *
 * Purpose:
 *
 * Connects the certified Phase 5.17 provider-neutral
 * Authentication Source Boundary to the certified Phase 5.16
 * Authentication Context Boundary.
 *
 * The integration:
 *
 * 1. delegates source resolution to Phase 5.17;
 * 2. obtains authenticated identity or null;
 * 3. delegates context assembly to Phase 5.16;
 * 4. returns the resulting authentication context.
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
 * - modify the Phase 5.15 Application Gateway;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - establish external completion.
 */

export interface ResolveTrustClubAuthenticationContextInput {
  adapter:
    TrustClubAuthenticationSourceAdapter;

  request:
    TrustClubAuthenticationSourceRequest;
}

export async function resolveTrustClubAuthenticationContext(
  input:
    ResolveTrustClubAuthenticationContextInput,
): Promise<TrustClubAuthenticationContextResult> {
  const sourceResult =
    await resolveTrustClubAuthenticationSource(
      input.adapter,
      input.request,
    );

  return assembleTrustClubAuthenticationContext({
    identity:
      sourceResult.identity,
  });
}

/**
 * Source delegation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_SOURCE_RULE =
  'AUTHENTICATION_INTEGRATION_DELEGATES_SOURCE_RESOLUTION_TO_PHASE_5_17' as const;

/**
 * Context delegation rule.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_CONTEXT_RULE =
  'AUTHENTICATION_INTEGRATION_DELEGATES_CONTEXT_ASSEMBLY_TO_PHASE_5_16' as const;

/**
 * Authority boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_AUTHORITY_RULE =
  'AUTHENTICATION_INTEGRATION_DOES_NOT_CREATE_NEW_AUTHENTICATION_AUTHORITY' as const;

/**
 * Authorization boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_AUTHORIZATION_RULE =
  'AUTHENTICATION_INTEGRATION_DOES_NOT_AUTHORIZE_TRUST_ACTIONS' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_PERSISTENCE_RULE =
  'AUTHENTICATION_INTEGRATION_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Gateway boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_GATEWAY_RULE =
  'AUTHENTICATION_INTEGRATION_DOES_NOT_MODIFY_APPLICATION_GATEWAY' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHENTICATION_INTEGRATION_EXPOSURE_RULE =
  'AUTHENTICATION_INTEGRATION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;