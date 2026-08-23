import type {
  TrustClubEntitlement,
} from './trust-club-domain.contracts';

import {
  getTrustClubBaseMembershipServices,
} from './trust-club-service-catalog';

import type {
  TrustClubServiceCode,
} from './trust-club-service-catalog';

import type {
  TrustClubPlanDefinition,
  TrustClubPurchasableEntitlementDefinition,
} from './trust-club-plan-pricing.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.6
 * Plan / Pricing / Entitlement Catalog
 *
 * Purpose:
 * Defines the controlled commercial catalog for Trust Club
 * Membership access and separately purchasable entitlements.
 *
 * This catalog:
 * - maps the Standard Membership Plan to Base services;
 * - maps separately purchasable entitlements to Add-On services;
 * - does not process or verify payment;
 * - does not activate a subscription;
 * - does not grant an entitlement;
 * - does not perform authorization;
 * - does not access a database;
 * - does not access Atlantis.
 */

const TRUST_CLUB_BASE_MEMBERSHIP_SERVICES:
  readonly TrustClubServiceCode[] =
  getTrustClubBaseMembershipServices();

const TRUST_CLUB_BASE_MEMBERSHIP_ENTITLEMENTS:
  readonly TrustClubEntitlement[] = [
    'TRUST_CREATE_STANDARD',
    'TRUST_VIEW',
    'TRUST_DOCUMENTS_STANDARD',
    'TRUST_REGISTRY_RECORD',
    'TRUST_SELF_MANAGEMENT_TOOLBOX',
    'TRUST_STANDARD_MAINTENANCE',
    'TRUST_ASSET_REGISTER_VIEW',
    'TRUST_ASSET_REGISTER_UPDATE',
    'TRUST_STANDARD_RESOLUTIONS',
    'TRUST_STANDARD_ROLE_RECORDS',
    'TRUST_STANDARD_CHANGE_REQUESTS',
    'BANKING_DIY_PACK',
  ];

export const TRUST_CLUB_MEMBERSHIP_PLANS = {
  STANDARD_MEMBERSHIP: {
    planCode:
      'STANDARD_MEMBERSHIP',

    name:
      'Standard Membership',

    description:
      'Standard recurring Genesis Trust Club Membership providing access to the expressly included Base services and entitlements.',

    recurring:
      true,

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'MONTHLY',

      externalFeesIncluded:
        false,

      description:
        'Membership price is commercially defined separately and is not asserted by this domain catalog until expressly approved.',
    },

    includedEntitlements:
      TRUST_CLUB_BASE_MEMBERSHIP_ENTITLEMENTS,

    includedServices:
      TRUST_CLUB_BASE_MEMBERSHIP_SERVICES,
  },
} as const satisfies Record<
  string,
  TrustClubPlanDefinition
>;

export const TRUST_CLUB_PURCHASABLE_ENTITLEMENTS = {
  TRUST_AMENDMENT: {
    entitlement:
      'PROFESSIONAL_REVIEW',

    name:
      'Trust Amendment',

    description:
      'Separately scoped Trust Instrument amendment service.',

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'CUSTOM_QUOTE',

      externalFeesIncluded:
        false,

      description:
        'Price depends on the approved amendment scope and any expressly included professional work.',
    },

    serviceCodes: [
      'TRUST_AMENDMENT',
    ],

    requiresActiveMembership:
      true,
  },

  EXTERNAL_IDENTIFICATION_ASSISTANCE: {
    entitlement:
      'EXTERNAL_IDENTIFICATION_ASSISTED',

    name:
      'External Identification Assistance',

    description:
      'Separately purchased assistance for a supported external identifier application.',

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'ONE_TIME',

      externalFeesIncluded:
        false,

      description:
        'Price covers only the expressly approved Trust Club assistance scope.',
    },

    serviceCodes: [
      'EXTERNAL_IDENTIFICATION_ASSISTANCE',
    ],

    requiresActiveMembership:
      true,
  },

  ASSISTED_BANKING_ACTIVATION: {
    entitlement:
      'BANKING_ASSISTED',

    name:
      'Assisted Banking Activation',

    description:
      'Separately purchased assistance with a supported external banking onboarding process.',

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'ONE_TIME',

      externalFeesIncluded:
        false,

      description:
        'Price covers only the expressly approved Trust Club banking-assistance scope.',
    },

    serviceCodes: [
      'ASSISTED_BANKING_ACTIVATION',
    ],

    requiresActiveMembership:
      true,
  },

  PROFESSIONAL_REVIEW: {
    entitlement:
      'PROFESSIONAL_REVIEW',

    name:
      'Professional Review',

    description:
      'Separately scoped specialist review or review coordination.',

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'CUSTOM_QUOTE',

      externalFeesIncluded:
        false,

      description:
        'Price depends on the approved professional-review scope.',
    },

    serviceCodes: [
      'PROFESSIONAL_REVIEW',
    ],

    requiresActiveMembership:
      true,
  },

  TRUST_TERMINATION: {
    entitlement:
      'PROFESSIONAL_REVIEW',

    name:
      'Trust Termination',

    description:
      'Separately controlled Trust termination or closure workflow.',

    price: {
      priceKind:
        'CUSTOM_QUOTE',

      billingInterval:
        'CUSTOM_QUOTE',

      externalFeesIncluded:
        false,

      description:
        'Price depends on the approved termination scope and any expressly included professional or external coordination work.',
    },

    serviceCodes: [
      'TRUST_TERMINATION',
    ],

    requiresActiveMembership:
      true,
  },
} as const satisfies Record<
  string,
  TrustClubPurchasableEntitlementDefinition
>;

export function getTrustClubMembershipPlan(
  planCode:
    keyof typeof TRUST_CLUB_MEMBERSHIP_PLANS,
): TrustClubPlanDefinition {
  return TRUST_CLUB_MEMBERSHIP_PLANS[
    planCode
  ];
}

export function getTrustClubPurchasableEntitlement(
  catalogCode:
    keyof typeof TRUST_CLUB_PURCHASABLE_ENTITLEMENTS,
): TrustClubPurchasableEntitlementDefinition {
  return TRUST_CLUB_PURCHASABLE_ENTITLEMENTS[
    catalogCode
  ];
}

/**
 * Base-service consistency rule.
 *
 * The Standard Membership service list is derived directly from
 * the certified service catalog rather than duplicated manually.
 */
export const TRUST_CLUB_BASE_SERVICE_DERIVATION_RULE =
  'STANDARD_MEMBERSHIP_BASE_SERVICES_ARE_DERIVED_FROM_SERVICE_CATALOG' as const;

/**
 * Add-On boundary.
 *
 * Add-On service availability does not activate the underlying
 * entitlement and does not prove that payment, scope approval,
 * professional review or external requirements have been satisfied.
 */
export const TRUST_CLUB_ADD_ON_AVAILABILITY_RULE =
  'ADD_ON_CATALOG_ENTRY_IS_NOT_PURCHASE_OR_AUTHORIZATION' as const;