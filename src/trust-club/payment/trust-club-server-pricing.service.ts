import {
  getTrustClubMembershipPlan,
} from '@/trust-club/domain/trust-club-commercial-catalog';

import type {
  TrustClubPlanCode,
} from '@/trust-club/domain/trust-club-plan-pricing.contracts';

export interface TrustClubServerResolvedPrice {
  planCode:
    TrustClubPlanCode;

  amountMinor:
    bigint;

  currency:
    'ILS';

  billingInterval:
    'MONTHLY';
}

function parseIlsMajorAmountToMinor(
  amount:
    string,
): bigint {
  if (
    !/^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(
      amount,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_CATALOG_PRICE_AMOUNT_INVALID',
    );
  }

  const [
    whole,
    fraction = '',
  ] =
    amount.split('.');

  const normalizedFraction =
    fraction.padEnd(
      2,
      '0',
    );

  return (
    BigInt(whole) *
      BigInt(100)
  ) +
    BigInt(
      normalizedFraction.length === 0
        ? '0'
        : normalizedFraction,
    );
}

export function resolveTrustClubMembershipPrice(
  planCode:
    TrustClubPlanCode,
): TrustClubServerResolvedPrice {
  const plan =
    getTrustClubMembershipPlan(
      planCode,
    );

  if (
    plan.price.priceKind !==
      'FIXED' ||
    plan.price.amount ===
      undefined
  ) {
    throw new Error(
      'TRUST_CLUB_CATALOG_FIXED_PRICE_REQUIRED',
    );
  }

  if (
    plan.price.billingInterval !==
      'MONTHLY'
  ) {
    throw new Error(
      'TRUST_CLUB_CATALOG_MONTHLY_PRICE_REQUIRED',
    );
  }

  if (
    plan.price.amount.currency !==
      'ILS'
  ) {
    throw new Error(
      'TRUST_CLUB_CATALOG_ILS_PRICE_REQUIRED',
    );
  }

  const amountMinor =
    parseIlsMajorAmountToMinor(
      plan.price.amount.amount,
    );

  if (
    amountMinor <=
      BigInt(0)
  ) {
    throw new Error(
      'TRUST_CLUB_CATALOG_PRICE_MUST_BE_POSITIVE',
    );
  }

  return {
    planCode,

    amountMinor,

    currency:
      'ILS',

    billingInterval:
      'MONTHLY',
  };
}

export const TRUST_CLUB_SERVER_PRICING_AUTHORITY_RULE =
  'PAYMENT_AMOUNT_AND_CURRENCY_ARE_RESOLVED_FROM_THE_SERVER_COMMERCIAL_CATALOG' as const;

export const TRUST_CLUB_SERVER_PRICING_MINOR_UNIT_RULE =
  'ILS_FIXED_CATALOG_PRICES_ARE_CONVERTED_SERVER_SIDE_TO_MINOR_UNITS' as const;