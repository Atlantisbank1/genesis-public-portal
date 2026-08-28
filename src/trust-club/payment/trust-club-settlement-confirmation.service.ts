import {
  prisma,
} from '@/lib/prisma';

export interface ConfirmTrustClubSettlementInput {
  settlementReference:
    string;

  confirmedBy:
    string;
}

export interface ConfirmedTrustClubSettlement {
  settlementId:
    string;

  settlementReference:
    string;

  paymentIntentId:
    string;

  paymentReference:
    string;

  amountMinor:
    bigint;

  currency:
    string;

  settlementStatus:
    'CONFIRMED';

  paymentIntentStatus:
    'CONFIRMED';

  settlementConfirmedAt:
    Date;

  paymentIntentConfirmedAt:
    Date;

  confirmedBy:
    string;
}

function requireSettlementReference(
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
      'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
    );
  }

  return normalized;
}

function requireConfirmedBy(
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
      'TRUST_CLUB_SETTLEMENT_CONFIRMATION_ACTOR_REQUIRED',
    );
  }

  return normalized;
}

export async function confirmTrustClubSettlement(
  input:
    ConfirmTrustClubSettlementInput,
): Promise<ConfirmedTrustClubSettlement> {
  const settlementReference =
    requireSettlementReference(
      input.settlementReference,
    );

  const confirmedBy =
    requireConfirmedBy(
      input.confirmedBy,
    );

  return prisma.$transaction(
    async (
      transaction,
    ) => {
      const settlement =
        await transaction
          .trustClubSettlementReflection
          .findUnique({
            where: {
              settlementReference,
            },
          });

      if (
        settlement ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_NOT_FOUND',
        );
      }

      const paymentIntent =
        await transaction
          .trustClubPaymentIntent
          .findUnique({
            where: {
              paymentIntentId:
                settlement.paymentIntentId,
            },
          });

      if (
        paymentIntent ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_PAYMENT_INTENT_NOT_FOUND',
        );
      }

      if (
        settlement.amountMinor !==
          paymentIntent.amountMinor
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_AMOUNT_MISMATCH',
        );
      }

      if (
        settlement.currency !==
          paymentIntent.currency
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_CURRENCY_MISMATCH',
        );
      }

      if (
        settlement.status ===
          'CONFIRMED'
      ) {
        if (
          paymentIntent.status !==
            'CONFIRMED' ||
          settlement.confirmedAt ===
            null ||
          paymentIntent.confirmedAt ===
            null
        ) {
          throw new Error(
            'TRUST_CLUB_SETTLEMENT_CONFIRMATION_STATE_DIVERGENCE',
          );
        }

        if (
          settlement.confirmedBy ===
            null
        ) {
          throw new Error(
            'TRUST_CLUB_SETTLEMENT_CONFIRMATION_ACTOR_MISSING',
          );
        }

        return {
          settlementId:
            settlement.settlementId,

          settlementReference:
            settlement.settlementReference,

          paymentIntentId:
            paymentIntent.paymentIntentId,

          paymentReference:
            paymentIntent.paymentReference,

          amountMinor:
            settlement.amountMinor,

          currency:
            settlement.currency,

          settlementStatus:
            'CONFIRMED',

          paymentIntentStatus:
            'CONFIRMED',

          settlementConfirmedAt:
            settlement.confirmedAt,

          paymentIntentConfirmedAt:
            paymentIntent.confirmedAt,

          confirmedBy:
            settlement.confirmedBy,
        };
      }

      if (
        settlement.status !==
          'RECEIVED'
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_REQUIRES_RECEIVED_SETTLEMENT',
        );
      }

      if (
        paymentIntent.status !==
          'AWAITING_SETTLEMENT'
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_REQUIRES_AWAITING_PAYMENT_INTENT',
        );
      }

      const confirmedAt =
        new Date();

      const settlementUpdate =
        await transaction
          .trustClubSettlementReflection
          .updateMany({
            where: {
              settlementId:
                settlement.settlementId,

              status:
                'RECEIVED',

              confirmedAt:
                null,

              confirmedBy:
                null,
            },

            data: {
              status:
                'CONFIRMED',

              confirmedAt,

              confirmedBy,
            },
          });

      if (
        settlementUpdate.count !==
          1
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_SETTLEMENT_UPDATE_FAILED',
        );
      }

      const paymentIntentUpdate =
        await transaction
          .trustClubPaymentIntent
          .updateMany({
            where: {
              paymentIntentId:
                paymentIntent.paymentIntentId,

              status:
                'AWAITING_SETTLEMENT',

              confirmedAt:
                null,
            },

            data: {
              status:
                'CONFIRMED',

              confirmedAt,
            },
          });

      if (
        paymentIntentUpdate.count !==
          1
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_CONFIRMATION_PAYMENT_INTENT_UPDATE_FAILED',
        );
      }

      return {
        settlementId:
          settlement.settlementId,

        settlementReference:
          settlement.settlementReference,

        paymentIntentId:
          paymentIntent.paymentIntentId,

        paymentReference:
          paymentIntent.paymentReference,

        amountMinor:
          settlement.amountMinor,

        currency:
          settlement.currency,

        settlementStatus:
          'CONFIRMED',

        paymentIntentStatus:
          'CONFIRMED',

        settlementConfirmedAt:
          confirmedAt,

        paymentIntentConfirmedAt:
          confirmedAt,

        confirmedBy,
      };
    },
  );
}

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ATOMICITY_RULE =
  'SETTLEMENT_AND_PAYMENT_INTENT_CONFIRMATION_MUST_COMMIT_OR_ROLL_BACK_TOGETHER' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_SOURCE_STATE_RULE =
  'CONFIRMATION_REQUIRES_RECEIVED_SETTLEMENT_AND_AWAITING_SETTLEMENT_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_AMOUNT_RULE =
  'CONFIRMATION_REVALIDATES_SETTLEMENT_AMOUNT_AND_CURRENCY_AGAINST_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_REPLAY_RULE =
  'CONFIRMED_SETTLEMENT_REPLAY_RETURNS_EXISTING_CONFIRMED_STATE_ONLY_WHEN_PAYMENT_INTENT_IS_ALSO_CONFIRMED_AND_CONFIRMATION_ACTOR_IS_PERSISTED' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ACTOR_RULE =
  'CONFIRMATION_ACTOR_MUST_BE_SERVER_SUPPLIED_AND_PERSISTED_WITH_SETTLEMENT_CONFIRMATION' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_TOKEN_RULE =
  'SETTLEMENT_CONFIRMATION_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_MEMBERSHIP_RULE =
  'SETTLEMENT_CONFIRMATION_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;