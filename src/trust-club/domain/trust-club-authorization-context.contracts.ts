import type {
  TrustClubRole,
  TrustClubSubscriptionStatus,
  TrustClubSystemRole,
} from './trust-club-domain.contracts';

import type {
  TrustClubEntitlementResolutionResult,
} from './trust-club-entitlement-resolution.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.8
 * Authorization Context Assembly Contracts
 *
 * Purpose:
 * Defines the controlled input used to assemble a
 * TrustClubAuthorizationContext from verified domain state.
 *
 * This file contains domain contracts only.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify identity;
 * - create Membership;
 * - create a Trust;
 * - determine Trust ownership;
 * - grant Trust roles;
 * - resolve entitlements;
 * - authorize Trust actions;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute banking activity;
 * - execute external services.
 */

export interface TrustClubIdentityContextInput {
  authenticatedUserId:
    string;
}

export interface TrustClubMembershipContextInput {
  memberId:
    string;

  subscriptionStatus:
    TrustClubSubscriptionStatus;
}

export interface TrustClubTrustRelationshipContextInput {
  trustId?:
    string;

  trustRoles:
    readonly TrustClubRole[];
}

export interface TrustClubSystemRoleContextInput {
  systemRoles:
    readonly TrustClubSystemRole[];
}

export interface TrustClubAuthorizationContextAssemblyInput {
  identity:
    TrustClubIdentityContextInput;

  membership:
    TrustClubMembershipContextInput;

  trustRelationship:
    TrustClubTrustRelationshipContextInput;

  systemRoleContext:
    TrustClubSystemRoleContextInput;

  entitlementResolution:
    TrustClubEntitlementResolutionResult;
}

/**
 * Context-source rule.
 *
 * Authorization context assembly consumes already established
 * domain state.
 *
 * It does not establish identity, Membership, Trust relationship,
 * Trust role authority or entitlement ownership by itself.
 */
export const TRUST_CLUB_AUTHORIZATION_CONTEXT_SOURCE_RULE =
  'AUTHORIZATION_CONTEXT_ASSEMBLY_CONSUMES_ESTABLISHED_DOMAIN_STATE' as const;

/**
 * Entitlement consistency rule.
 *
 * The subscription status used in Membership context must remain
 * consistent with the subscription status represented by the
 * entitlement-resolution result supplied to the assembler.
 */
export const TRUST_CLUB_AUTHORIZATION_CONTEXT_SUBSCRIPTION_RULE =
  'MEMBERSHIP_AND_ENTITLEMENT_RESOLUTION_SUBSCRIPTION_STATUS_MUST_MATCH' as const;

/**
 * Assembly boundary.
 *
 * Building an authorization context does not itself authorize
 * any Trust action.
 */
export const TRUST_CLUB_AUTHORIZATION_CONTEXT_ASSEMBLY_RULE =
  'AUTHORIZATION_CONTEXT_ASSEMBLY_IS_NOT_ACTION_AUTHORIZATION' as const;