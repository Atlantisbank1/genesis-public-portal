import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '@/trust-club/server/trust-club-server-application-entry.contracts';

import {
  authorizeTrustClubAdminReview,
} from '@/trust-club/server/trust-club-admin-review-authorization.service';

import type {
  TrustClubSettlementReflection,
} from './trust-club-settlement-reflection.contracts';

import {
  receiveTrustClubSettlementReflection,
} from './trust-club-settlement-reflection.service';

export interface ReceiveTrustClubSettlementReflectionAsAdminInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  settlement: {
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
  };
}

export async function receiveTrustClubSettlementReflectionAsAdmin(
  input:
    ReceiveTrustClubSettlementReflectionAsAdminInput,
): Promise<TrustClubSettlementReflection> {
  const authorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    authorization.status ===
      'UNAUTHENTICATED'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_AUTHENTICATION_REQUIRED',
    );
  }

  if (
    authorization.status ===
      'ADMIN_SYSTEM_ROLE_REQUIRED'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  return receiveTrustClubSettlementReflection({
    ...input.settlement,

    verifiedBy:
      authorization.authenticatedUserId,
  });
}

export const TRUST_CLUB_SETTLEMENT_ADMIN_AUTHENTICATION_RULE =
  'SETTLEMENT_RECEIPT_CONSUMES_EXISTING_AUTHENTICATION_SOURCE' as const;

export const TRUST_CLUB_SETTLEMENT_ADMIN_AUTHORITY_RULE =
  'SETTLEMENT_RECEIPT_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_SYSTEM_ROLE' as const;

export const TRUST_CLUB_SETTLEMENT_ADMIN_CALLER_AUTHORITY_RULE =
  'SETTLEMENT_RECEIPT_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY_OR_ROLE' as const;

export const TRUST_CLUB_SETTLEMENT_ADMIN_CONFIRMATION_RULE =
  'SETTLEMENT_RECEIPT_DOES_NOT_CONFIRM_PAYMENT_INTENT' as const;

export const TRUST_CLUB_SETTLEMENT_ADMIN_TOKEN_RULE =
  'SETTLEMENT_RECEIPT_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;