import type {
  TrustClubSettlementReflection,
} from './trust-club-settlement-reflection.contracts';

import {
  trustClubSettlementReflectionPersistence,
} from './trust-club-settlement-reflection.persistence';

import {
  trustClubPaymentIntentPersistence,
} from './trust-club-payment-intent.persistence';

export interface ReceiveTrustClubSettlementReflectionInput {
  paymentReference:
    string;

  settlementReference:
    string;

  originatingInstitution?:
    string | null;

  externalTransactionRef?:
    string | null;

  amountMinor:
    bigint;

  currency:
    string;

  verificationReference?:
    string | null;

  verifiedBy?:
    string | null;
}

function requireExistingSettlementBinding(
  existing:
    TrustClubSettlementReflection,
  paymentIntentId:
    string,
  amountMinor:
    bigint,
  currency:
    string,
): TrustClubSettlementReflection {
  if (
    existing.paymentIntentId !==
      paymentIntentId ||
    existing.amountMinor !==
      amountMinor ||
    existing.currency !==
      currency
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_REFERENCE_CONFLICT',
    );
  }

  return existing;
}

function isPrismaUniqueConstraintError(
  error:
    unknown,
): boolean {
  if (
    typeof error !==
      'object' ||
    error ===
      null
  ) {
    return false;
  }

  const candidate =
    error as {
      code?:
        unknown;
    };

  return (
    candidate.code ===
      'P2002'
  );
}

export async function receiveTrustClubSettlementReflection(
  input:
    ReceiveTrustClubSettlementReflectionInput,
): Promise<TrustClubSettlementReflection> {
  const paymentReference =
    input.paymentReference.trim();

  if (
    paymentReference.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_REFERENCE_REQUIRED',
    );
  }

  const settlementReference =
    input.settlementReference.trim();

  if (
    settlementReference.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
    );
  }

  if (
    input.amountMinor <=
      BigInt(0)
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_AMOUNT_MUST_BE_POSITIVE',
    );
  }

  const currency =
    input.currency
      .trim()
      .toUpperCase();

  if (
    !/^[A-Z]{3,12}$/.test(
      currency,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_CURRENCY_INVALID',
    );
  }

  const paymentIntent =
    await trustClubPaymentIntentPersistence
      .findByPaymentReference(
        paymentReference,
      );

  if (
    paymentIntent ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_NOT_FOUND',
    );
  }

  if (
    input.amountMinor !==
      paymentIntent.amountMinor
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_AMOUNT_MISMATCH',
    );
  }

  if (
    currency !==
      paymentIntent.currency
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_CURRENCY_MISMATCH',
    );
  }

  const existing =
    await trustClubSettlementReflectionPersistence
      .findBySettlementReference(
        settlementReference,
      );

  if (
    existing !==
      null
  ) {
    return requireExistingSettlementBinding(
      existing,
      paymentIntent.paymentIntentId,
      paymentIntent.amountMinor,
      paymentIntent.currency,
    );
  }

  if (
    paymentIntent.status !==
      'AWAITING_SETTLEMENT'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_NOT_AWAITING_SETTLEMENT',
    );
  }

  if (
    paymentIntent.expiresAt !==
      null &&
    paymentIntent.expiresAt.getTime() <=
      Date.now()
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_PAYMENT_INTENT_EXPIRED',
    );
  }

  let settlement:
    TrustClubSettlementReflection;

  try {
    settlement =
      await trustClubSettlementReflectionPersistence
        .create({
          paymentIntentId:
            paymentIntent.paymentIntentId,

          settlementReference,

          originatingInstitution:
            input.originatingInstitution ??
            null,

          externalTransactionRef:
            input.externalTransactionRef ??
            null,

          amountMinor:
            input.amountMinor,

          currency,

          verificationReference:
            input.verificationReference ??
            null,

          verifiedBy:
            input.verifiedBy ??
            null,
        });
  }
  catch (
    error:
      unknown
  ) {
    if (
      !isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw error;
    }

    const concurrentExisting =
      await trustClubSettlementReflectionPersistence
        .findBySettlementReference(
          settlementReference,
        );

    if (
      concurrentExisting ===
        null
    ) {
      throw error;
    }

    return requireExistingSettlementBinding(
      concurrentExisting,
      paymentIntent.paymentIntentId,
      paymentIntent.amountMinor,
      paymentIntent.currency,
    );
  }

  if (
    settlement.status !==
      'RECEIVED'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_INITIAL_STATUS_INVALID',
    );
  }

  return settlement;
}

export const TRUST_CLUB_SETTLEMENT_PAYMENT_BINDING_RULE =
  'SETTLEMENT_REFLECTION_REQUIRES_EXISTING_PAYMENT_REFERENCE' as const;

export const TRUST_CLUB_SETTLEMENT_AMOUNT_RULE =
  'SETTLEMENT_REFLECTION_AMOUNT_AND_CURRENCY_MUST_MATCH_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_IDEMPOTENCY_RULE =
  'SETTLEMENT_REFERENCE_IS_UNIQUE_AND_REPLAY_RETURNS_EXISTING_REFLECTION' as const;

export const TRUST_CLUB_SETTLEMENT_CONCURRENCY_RULE =
  'CONCURRENT_SETTLEMENT_REFERENCE_COLLISION_REFETCHES_AND_REVALIDATES_EXISTING_REFLECTION' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_RULE =
  'SETTLEMENT_REFLECTION_RECEIPT_DOES_NOT_CONFIRM_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_TOKEN_RULE =
  'SETTLEMENT_REFLECTION_RECEIPT_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;