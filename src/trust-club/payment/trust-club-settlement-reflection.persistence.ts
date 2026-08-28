import {
  prisma,
} from '@/lib/prisma';

import type {
  CreateTrustClubSettlementReflectionPersistenceInput,
  TrustClubSettlementReflection,
  TrustClubSettlementReflectionPersistence,
} from './trust-club-settlement-reflection.contracts';

function requireText(
  value:
    string,
  code:
    string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      code,
    );
  }

  return normalized;
}

function optionalText(
  value:
    string | null,
): string | null {
  if (
    value ===
      null
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

export const trustClubSettlementReflectionPersistence:
  TrustClubSettlementReflectionPersistence = {
    async create(
      input:
        CreateTrustClubSettlementReflectionPersistenceInput,
    ): Promise<TrustClubSettlementReflection> {
      const paymentIntentId =
        requireText(
          input.paymentIntentId,
          'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_ID_REQUIRED',
        );

      const settlementReference =
        requireText(
          input.settlementReference,
          'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
        );

      const currency =
        requireText(
          input.currency,
          'TRUST_CLUB_SETTLEMENT_CURRENCY_REQUIRED',
        )
          .toUpperCase();

      if (
        input.amountMinor <=
          BigInt(0)
      ) {
        throw new Error(
          'TRUST_CLUB_SETTLEMENT_AMOUNT_MUST_BE_POSITIVE',
        );
      }

      return prisma
        .trustClubSettlementReflection
        .create({
          data: {
            paymentIntentId,
            settlementReference,
            originatingInstitution:
              optionalText(
                input.originatingInstitution,
              ),
            externalTransactionRef:
              optionalText(
                input.externalTransactionRef,
              ),
            amountMinor:
              input.amountMinor,
            currency,
            status:
              'RECEIVED',
            verificationReference:
              optionalText(
                input.verificationReference,
              ),
            verifiedBy:
              optionalText(
                input.verifiedBy,
              ),
          },
        });
    },

    async findBySettlementReference(
      settlementReference,
    ): Promise<TrustClubSettlementReflection | null> {
      const normalizedReference =
        requireText(
          settlementReference,
          'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
        );

      return prisma
        .trustClubSettlementReflection
        .findUnique({
          where: {
            settlementReference:
              normalizedReference,
          },
        });
    },
  };