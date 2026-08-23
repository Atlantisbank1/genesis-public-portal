import type {
  TrustClubEntitlement,
} from './trust-club-domain.contracts';

import type {
  TrustClubServiceCode,
} from './trust-club-service-catalog';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.6
 * Plan / Pricing / Entitlement Contracts
 *
 * Purpose:
 * Defines the controlled commercial vocabulary used to describe
 * Trust Club Membership Plans, prices and separately purchasable
 * entitlements.
 *
 * This file contains domain contracts only.
 *
 * It does NOT:
 * - process payments;
 * - verify payments;
 * - activate subscriptions;
 * - grant entitlements;
 * - perform authorization;
 * - access a database;
 * - access Atlantis;
 * - create or modify a Trust;
 * - execute banking activity;
 * - execute external services.
 */

export type TrustClubPlanCode =
  | 'STANDARD_MEMBERSHIP';

export type TrustClubBillingInterval =
  | 'ONE_TIME'
  | 'MONTHLY'
  | 'ANNUAL'
  | 'CUSTOM_QUOTE';

export type TrustClubPriceCurrency =
  | 'USD';

export type TrustClubPriceKind =
  | 'FIXED'
  | 'CUSTOM_QUOTE';

export interface TrustClubMoneyAmount {
  currency:
    TrustClubPriceCurrency;

  amount:
    string;
}

/**
 * Price definition.
 *
 * FIXED prices must contain an amount.
 *
 * CUSTOM_QUOTE prices deliberately do not assert a fixed
 * monetary amount before the applicable scope is approved.
 */
export interface TrustClubPriceDefinition {
  priceKind:
    TrustClubPriceKind;

  billingInterval:
    TrustClubBillingInterval;

  amount?:
    TrustClubMoneyAmount;

  externalFeesIncluded:
    boolean;

  description:
    string;
}

export interface TrustClubPlanDefinition {
  planCode:
    TrustClubPlanCode;

  name:
    string;

  description:
    string;

  recurring:
    boolean;

  price:
    TrustClubPriceDefinition;

  includedEntitlements:
    readonly TrustClubEntitlement[];

  includedServices:
    readonly TrustClubServiceCode[];
}

/**
 * Separately purchasable entitlement.
 *
 * An entitlement definition describes commercial availability.
 *
 * It does NOT grant the entitlement merely because the
 * definition exists in the catalog.
 */
export interface TrustClubPurchasableEntitlementDefinition {
  entitlement:
    TrustClubEntitlement;

  name:
    string;

  description:
    string;

  price:
    TrustClubPriceDefinition;

  serviceCodes:
    readonly TrustClubServiceCode[];

  requiresActiveMembership:
    boolean;
}

/**
 * Commercial catalog boundary.
 *
 * A Membership Plan describes recurring Membership access.
 *
 * A separately purchasable entitlement describes additional
 * scope that is not automatically included merely because a
 * Member has an active Membership.
 */
export const TRUST_CLUB_COMMERCIAL_CATALOG_RULE =
  'PLAN_ACCESS_AND_SEPARATELY_PURCHASED_ENTITLEMENTS_ARE_EXPLICITLY_DEFINED' as const;

/**
 * Pricing boundary.
 *
 * A catalog price describes Trust Club charges only.
 *
 * External authority fees, bank fees, registry fees,
 * professional fees, notarization fees, translation fees,
 * taxes or other third-party costs are not included unless
 * expressly stated by the applicable price definition.
 */
export const TRUST_CLUB_PRICING_BOUNDARY_RULE =
  'CATALOG_PRICE_INCLUDES_ONLY_EXPRESSLY_STATED_TRUST_CLUB_CHARGES' as const;

/**
 * Entitlement activation boundary.
 *
 * Presence of an entitlement in a commercial catalog does not
 * prove that a Member owns or may exercise that entitlement.
 *
 * Actual authorization continues to depend on the applicable
 * authorization context and subscription state.
 */
export const TRUST_CLUB_ENTITLEMENT_CATALOG_RULE =
  'CATALOG_AVAILABILITY_IS_NOT_ENTITLEMENT_ACTIVATION' as const;