import {
  prisma,
} from '@/lib/prisma';

export interface RequireTrustClubTokenPaymentConfirmationInput {
  invitationId:
    string;
}

export interface TrustClubTokenPaymentConfirmation {
  paymentIntentId:
    string;

  paymentReference:
    string;

  settlementId:
    string;

  settlementReference:
    string;

  amountMinor:
    bigint;

  currency:
    string;

  paymentConfirmedAt:
    Date;

  settlementConfirmedAt:
    Date;
}

function requireInvitationId(
  value:
    string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_PAYMENT_INVITATION_ID_REQUIRED',
    );
  }

  return normalized;
}

export async function requireTrustClubTokenPaymentConfirmation(
  input:
    RequireTrustClubTokenPaymentConfirmationInput,
): Promise<TrustClubTokenPaymentConfirmation> {
  const invitationId =
    requireInvitationId(
      input.invitationId,
    );

  const latestConfirmedPaymentIntent =
    await prisma
      .trustClubPaymentIntent
      .findFirst({
        where: {
          invitationId,

          status:
            'CONFIRMED',

          confirmedAt: {
            not:
              null,
          },
        },

        orderBy: {
          confirmedAt:
            'desc',
        },
      });

  if (
    latestConfirmedPaymentIntent ===
      null ||
    latestConfirmedPaymentIntent.confirmedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_PAYMENT_CONFIRMATION_REQUIRED',
    );
  }

  const paymentIntent =
    await prisma
      .trustClubPaymentIntent
      .findFirst({
        where: {
          invitationId,

          status:
            'CONFIRMED',

          confirmedAt: {
            not:
              null,
          },

          settlements: {
            some: {
              status:
                'CONFIRMED',

              confirmedAt: {
                not:
                  null,
              },
            },
          },
        },

        orderBy: {
          confirmedAt:
            'desc',
        },
      });

  if (
    paymentIntent ===
      null ||
    paymentIntent.confirmedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_SETTLEMENT_CONFIRMATION_REQUIRED',
    );
  }

  const settlement =
    await prisma
      .trustClubSettlementReflection
      .findFirst({
        where: {
          paymentIntentId:
            paymentIntent.paymentIntentId,

          status:
            'CONFIRMED',

          confirmedAt: {
            not:
              null,
          },

          amountMinor:
            paymentIntent.amountMinor,

          currency:
            paymentIntent.currency,
        },

        orderBy: {
          confirmedAt:
            'desc',
        },
      });

  if (
    settlement ===
      null ||
    settlement.confirmedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_SETTLEMENT_CONFIRMATION_REQUIRED',
    );
  }

  if (
    settlement.amountMinor !==
      paymentIntent.amountMinor
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_PAYMENT_AMOUNT_MISMATCH',
    );
  }

  if (
    settlement.currency !==
      paymentIntent.currency
  ) {
    throw new Error(
      'TRUST_CLUB_TOKEN_PAYMENT_CURRENCY_MISMATCH',
    );
  }

  return {
    paymentIntentId:
      paymentIntent.paymentIntentId,

    paymentReference:
      paymentIntent.paymentReference,

    settlementId:
      settlement.settlementId,

    settlementReference:
      settlement.settlementReference,

    amountMinor:
      paymentIntent.amountMinor,

    currency:
      paymentIntent.currency,

    paymentConfirmedAt:
      paymentIntent.confirmedAt,

    settlementConfirmedAt:
      settlement.confirmedAt,
  };
}

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_RULE =
  'REGISTRATION_TOKEN_ISSUANCE_REQUIRES_CONFIRMED_PAYMENT_INTENT_AND_CONFIRMED_SETTLEMENT' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_BINDING_RULE =
  'CONFIRMED_SETTLEMENT_MUST_BE_BOUND_TO_THE_CONFIRMED_PAYMENT_INTENT_FOR_THE_INVITATION' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_PAIR_SELECTION_RULE =
  'TOKEN_PAYMENT_GATE_SELECTS_A_CONFIRMED_PAYMENT_INTENT_WITH_A_CONFIRMED_SETTLEMENT' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_ERROR_SEMANTICS_RULE =
  'PAYMENT_CONFIRMATION_AND_SETTLEMENT_CONFIRMATION_FAILURES_REMAIN_DISTINCT' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_AMOUNT_RULE =
  'CONFIRMED_SETTLEMENT_AMOUNT_AND_CURRENCY_MUST_MATCH_PAYMENT_INTENT' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_AUTHORITY_RULE =
  'CALLER_CANNOT_SUPPLY_OR_OVERRIDE_PAYMENT_CONFIRMATION_STATE' as const;

export const TRUST_CLUB_TOKEN_PAYMENT_GATE_MUTATION_RULE =
  'PAYMENT_CONFIRMATION_GATE_PERFORMS_NO_TOKEN_OR_MEMBERSHIP_MUTATION' as const;