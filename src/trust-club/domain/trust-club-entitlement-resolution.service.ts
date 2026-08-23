import type {
  TrustClubEntitlement,
} from './trust-club-domain.contracts';

import {
  getTrustClubMembershipPlan,
} from './trust-club-commercial-catalog';

import type {
  TrustClubEntitlementResolutionInput,
  TrustClubEntitlementResolutionResult,
} from './trust-club-entitlement-resolution.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.7
 * Membership Access / Entitlement Resolution
 *
 * Purpose:
 * Calculates effective Trust Club entitlements from:
 *
 * - Membership Plan;
 * - subscription status;
 * - active purchased entitlements.
 *
 * This service is deterministic domain logic only.
 *
 * It does NOT:
 * - process payments;
 * - verify payments;
 * - activate subscriptions;
 * - authorize Trust actions;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute banking activity;
 * - execute external services.
 */

function membershipAccessIsActive(
  subscriptionStatus:
    TrustClubEntitlementResolutionInput['subscriptionStatus'],
): boolean {
  return (
    subscriptionStatus === 'ACTIVE' ||
    subscriptionStatus === 'GRACE'
  );
}

function uniqueEntitlements(
  entitlements:
    readonly TrustClubEntitlement[],
): readonly TrustClubEntitlement[] {
  return Array.from(
    new Set(
      entitlements,
    ),
  );
}

export function resolveTrustClubEntitlements(
  input:
    TrustClubEntitlementResolutionInput,
): TrustClubEntitlementResolutionResult {
  const plan =
    getTrustClubMembershipPlan(
      input.planCode,
    );

  const membershipAccessActive =
    membershipAccessIsActive(
      input.subscriptionStatus,
    );

  const basePlanEntitlements =
    membershipAccessActive
      ? plan.includedEntitlements
      : [];

  const activePurchasedEntitlements =
    membershipAccessActive
      ? uniqueEntitlements(
          input.purchasedEntitlements
            .filter(
              (purchasedEntitlement) =>
                purchasedEntitlement.status ===
                  'ACTIVE',
            )
            .map(
              (purchasedEntitlement) =>
                purchasedEntitlement.entitlement,
            ),
        )
      : [];

  const effectiveEntitlements =
    uniqueEntitlements([
      ...basePlanEntitlements,
      ...activePurchasedEntitlements,
    ]);

  return {
    planCode:
      input.planCode,

    subscriptionStatus:
      input.subscriptionStatus,

    basePlanEntitlements,

    activePurchasedEntitlements,

    effectiveEntitlements,

    membershipAccessActive,
  };
}