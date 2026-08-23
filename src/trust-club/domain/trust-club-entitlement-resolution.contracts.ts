import type {
  TrustClubEntitlement,
  TrustClubSubscriptionStatus,
} from './trust-club-domain.contracts';

import type {
  TrustClubPlanCode,
} from './trust-club-plan-pricing.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.7
 * Membership Access / Entitlement Resolution Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * calculate effective Trust Club entitlements.
 *
 * This file contains domain contracts only.
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

export type TrustClubPurchasedEntitlementStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CANCELLED';

export interface TrustClubPurchasedEntitlement {
  entitlement:
    TrustClubEntitlement;

  status:
    TrustClubPurchasedEntitlementStatus;
}

export interface TrustClubEntitlementResolutionInput {
  planCode:
    TrustClubPlanCode;

  subscriptionStatus:
    TrustClubSubscriptionStatus;

  purchasedEntitlements:
    readonly TrustClubPurchasedEntitlement[];
}

export interface TrustClubEntitlementResolutionResult {
  planCode:
    TrustClubPlanCode;

  subscriptionStatus:
    TrustClubSubscriptionStatus;

  basePlanEntitlements:
    readonly TrustClubEntitlement[];

  activePurchasedEntitlements:
    readonly TrustClubEntitlement[];

  effectiveEntitlements:
    readonly TrustClubEntitlement[];

  membershipAccessActive:
    boolean;
}

/**
 * Membership-access rule.
 *
 * Base-plan entitlements are effective only while the applicable
 * Membership subscription status permits access.
 */
export const TRUST_CLUB_MEMBERSHIP_ACCESS_RULE =
  'BASE_PLAN_ENTITLEMENTS_REQUIRE_ACTIVE_OR_GRACE_SUBSCRIPTION' as const;

/**
 * Purchased-entitlement rule.
 *
 * A purchased entitlement contributes to effective access only
 * when its purchased-entitlement status is ACTIVE.
 */
export const TRUST_CLUB_PURCHASED_ENTITLEMENT_RULE =
  'ONLY_ACTIVE_PURCHASED_ENTITLEMENTS_CONTRIBUTE_TO_EFFECTIVE_ACCESS' as const;

/**
 * Resolution boundary.
 *
 * Entitlement resolution calculates access state only.
 *
 * It does not itself authorize a Trust action.
 */
export const TRUST_CLUB_ENTITLEMENT_RESOLUTION_RULE =
  'ENTITLEMENT_RESOLUTION_IS_NOT_ACTION_AUTHORIZATION' as const;