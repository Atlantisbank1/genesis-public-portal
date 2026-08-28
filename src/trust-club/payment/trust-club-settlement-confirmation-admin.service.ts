import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '@/trust-club/server/trust-club-server-application-entry.contracts';

import {
  authorizeTrustClubAdminReview,
} from '@/trust-club/server/trust-club-admin-review-authorization.service';

import type {
  ConfirmedTrustClubSettlement,
} from './trust-club-settlement-confirmation.service';

import {
  confirmTrustClubSettlement,
} from './trust-club-settlement-confirmation.service';

export interface ConfirmTrustClubSettlementAsAdminInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  settlementReference:
    string;
}

export async function confirmTrustClubSettlementAsAdmin(
  input:
    ConfirmTrustClubSettlementAsAdminInput,
): Promise<ConfirmedTrustClubSettlement> {
  const authorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    authorization.status ===
      'UNAUTHENTICATED'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_CONFIRMATION_AUTHENTICATION_REQUIRED',
    );
  }

  if (
    authorization.status ===
      'ADMIN_SYSTEM_ROLE_REQUIRED'
  ) {
    throw new Error(
      'TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  return confirmTrustClubSettlement({
    settlementReference:
      input.settlementReference,

    confirmedBy:
      authorization.authenticatedUserId,
  });
}

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_AUTHENTICATION_RULE =
  'SETTLEMENT_CONFIRMATION_CONSUMES_EXISTING_AUTHENTICATION_SOURCE' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_AUTHORITY_RULE =
  'SETTLEMENT_CONFIRMATION_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_SYSTEM_ROLE' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_CALLER_AUTHORITY_RULE =
  'SETTLEMENT_CONFIRMATION_ACCEPTS_NO_CALLER_SUPPLIED_ADMIN_IDENTITY_OR_ROLE' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_ACTOR_RULE =
  'SETTLEMENT_CONFIRMATION_PERSISTS_AUTHENTICATED_ADMINISTRATOR_IDENTITY_AS_CONFIRMATION_ACTOR' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_TOKEN_RULE =
  'SETTLEMENT_CONFIRMATION_ADMIN_BOUNDARY_DOES_NOT_ISSUE_REGISTRATION_TOKEN' as const;

export const TRUST_CLUB_SETTLEMENT_CONFIRMATION_ADMIN_MEMBERSHIP_RULE =
  'SETTLEMENT_CONFIRMATION_ADMIN_BOUNDARY_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;