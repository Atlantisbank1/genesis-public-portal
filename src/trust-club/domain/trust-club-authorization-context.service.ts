import type {
  TrustClubAuthorizationContext,
} from './trust-club-domain.contracts';

import type {
  TrustClubAuthorizationContextAssemblyInput,
} from './trust-club-authorization-context.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.8
 * Authorization Context Assembly
 *
 * Purpose:
 * Assembles a TrustClubAuthorizationContext from already
 * established identity, Membership, Trust relationship,
 * system-role and entitlement-resolution state.
 *
 * This service is deterministic domain logic only.
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

function assertSubscriptionStatusConsistency(
  input:
    TrustClubAuthorizationContextAssemblyInput,
): void {
  if (
    input.membership.subscriptionStatus !==
    input.entitlementResolution.subscriptionStatus
  ) {
    throw new Error(
      'TRUST_CLUB_AUTHORIZATION_CONTEXT_SUBSCRIPTION_STATUS_MISMATCH',
    );
  }
}

export function assembleTrustClubAuthorizationContext(
  input:
    TrustClubAuthorizationContextAssemblyInput,
): TrustClubAuthorizationContext {
  assertSubscriptionStatusConsistency(
    input,
  );

  return {
    authenticatedUserId:
      input.identity.authenticatedUserId,

    memberId:
      input.membership.memberId,

    trustId:
      input.trustRelationship.trustId,

    trustRoles:
      input.trustRelationship.trustRoles,

    systemRoles:
      input.systemRoleContext.systemRoles,

    entitlements:
      input.entitlementResolution.effectiveEntitlements,

    subscriptionStatus:
      input.membership.subscriptionStatus,
  };
}