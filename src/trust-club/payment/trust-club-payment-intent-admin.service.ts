import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '@/trust-club/server/trust-club-server-application-entry.contracts';

import {
  authorizeTrustClubAdminReview,
} from '@/trust-club/server/trust-club-admin-review-authorization.service';

import type {
  TrustClubPaymentIntent,
  TrustClubPaymentMethod,
} from './trust-club-payment-intent.contracts';

import {
  createTrustClubPaymentIntent,
} from './trust-club-payment-intent.service';

export interface CreateTrustClubPaymentIntentAsAdminInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  paymentIntent: {
    invitationId:
      string;


    paymentMethod:
      TrustClubPaymentMethod;

    expiresAt?:
      Date | null;
  };
}

export async function createTrustClubPaymentIntentAsAdmin(
  input:
    CreateTrustClubPaymentIntentAsAdminInput,
): Promise<TrustClubPaymentIntent> {
  const authorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    authorization.status ===
      'UNAUTHENTICATED'
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INTENT_AUTHENTICATION_REQUIRED',
    );
  }

  if (
    authorization.status ===
      'ADMIN_SYSTEM_ROLE_REQUIRED'
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INTENT_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  return createTrustClubPaymentIntent(
    input.paymentIntent,
  );
}

export const TRUST_CLUB_PAYMENT_INTENT_ADMIN_AUTHENTICATION_RULE =
  'PAYMENT_INTENT_ADMIN_CREATION_CONSUMES_EXISTING_AUTHENTICATION_SOURCE' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ADMIN_AUTHORITY_RULE =
  'PAYMENT_INTENT_ADMIN_CREATION_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_SYSTEM_ROLE' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ADMIN_CALLER_AUTHORITY_RULE =
  'PAYMENT_INTENT_ADMIN_CREATION_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY_OR_ROLE' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ADMIN_SETTLEMENT_RULE =
  'PAYMENT_INTENT_ADMIN_CREATION_DOES_NOT_CONFIRM_SETTLEMENT' as const;

export const TRUST_CLUB_PAYMENT_INTENT_ADMIN_TOKEN_RULE =
  'PAYMENT_INTENT_ADMIN_CREATION_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;