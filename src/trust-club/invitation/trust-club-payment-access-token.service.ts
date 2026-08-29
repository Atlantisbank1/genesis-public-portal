import {
  createHash,
  randomBytes,
} from 'node:crypto';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '../server/trust-club-server-application-entry.contracts';

import {
  authorizeTrustClubAdminReview,
} from '../server/trust-club-admin-review-authorization.service';

import {
  trustClubInvitationPersistence,
} from './trust-club-invitation.persistence';

import type {
  TrustClubInvitation,
} from './trust-club-invitation.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 9.4-P8.22
 *
 * Private Payment Access Token
 *
 * This capability exists BEFORE payment intent creation.
 *
 * Security sequence:
 *
 * 1. authenticate through the existing server authentication source;
 * 2. require persisted TRUST_CLUB_ADMIN authority;
 * 3. load an existing REQUESTED invitation;
 * 4. require the registration-token boundary to remain untouched;
 * 5. require no previously issued payment-access capability;
 * 6. validate a future expiration;
 * 7. generate 256 bits of cryptographically secure entropy;
 * 8. return only the raw capability from this issuance boundary;
 * 9. persist only its SHA-256 hash and expiration;
 * 10. keep the invitation in REQUESTED status.
 *
 * This service does NOT create a Payment Intent.
 * This service does NOT confirm settlement.
 * This service does NOT issue the registration invitation token.
 * This service does NOT activate membership.
 */

export const TRUST_CLUB_PAYMENT_ACCESS_TOKEN_ENTROPY_BYTES =
  32 as const;

export const TRUST_CLUB_PAYMENT_ACCESS_TOKEN_HASH_ALGORITHM =
  'sha256' as const;

export interface IssueTrustClubPaymentAccessTokenInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  invitationId:
    string;

  expiresAt:
    Date;
}

export interface IssuedTrustClubPaymentAccessToken {
  invitation:
    TrustClubInvitation;

  rawPaymentAccessToken:
    string;
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
      'TRUST_CLUB_PAYMENT_ACCESS_INVITATION_ID_REQUIRED',
    );
  }

  return normalized;
}

function requireFutureExpiration(
  expiresAt:
    Date,
  issuedAt:
    Date,
): void {
  const expiresAtMilliseconds =
    expiresAt.getTime();

  const issuedAtMilliseconds =
    issuedAt.getTime();

  if (
    !Number.isFinite(
      expiresAtMilliseconds,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_INVALID',
    );
  }

  if (
    expiresAtMilliseconds <=
      issuedAtMilliseconds
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_EXPIRATION_NOT_AFTER_ISSUANCE',
    );
  }
}

function generateRawPaymentAccessToken():
  string {
  return randomBytes(
    TRUST_CLUB_PAYMENT_ACCESS_TOKEN_ENTROPY_BYTES,
  ).toString(
    'base64url',
  );
}

export function hashTrustClubPaymentAccessToken(
  rawPaymentAccessToken:
    string,
): string {
  const normalized =
    rawPaymentAccessToken.trim();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_RAW_TOKEN_REQUIRED',
    );
  }

  return createHash(
    TRUST_CLUB_PAYMENT_ACCESS_TOKEN_HASH_ALGORITHM,
  )
    .update(
      normalized,
      'utf8',
    )
    .digest(
      'hex',
    );
}

export async function issueTrustClubPaymentAccessTokenAsAdmin(
  input:
    IssueTrustClubPaymentAccessTokenInput,
): Promise<
  IssuedTrustClubPaymentAccessToken
> {
  const adminAuthorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    throw new Error(
      adminAuthorization.status ===
        'UNAUTHENTICATED'
        ? 'TRUST_CLUB_PAYMENT_ACCESS_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_PAYMENT_ACCESS_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  const invitationId =
    requireInvitationId(
      input.invitationId,
    );

  const invitation =
    await trustClubInvitationPersistence
      .findById(
        invitationId,
      );

  if (
    invitation ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_INVITATION_NOT_FOUND',
    );
  }

  if (
    invitation.status !==
      'REQUESTED'
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_REQUIRES_REQUESTED_INVITATION',
    );
  }

  if (
    invitation.tokenHash !==
      null ||
    invitation.expiresAt !==
      null ||
    invitation.approvedByUserId !==
      null ||
    invitation.approvedAt !==
      null ||
    invitation.consumedAt !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_REGISTRATION_BOUNDARY_NOT_CLEAN',
    );
  }

  if (
    invitation.paymentAccessTokenHash !==
      null ||
    invitation.paymentAccessExpiresAt !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_ALREADY_ISSUED',
    );
  }

  const issuedAt =
    new Date();

  requireFutureExpiration(
    input.expiresAt,
    issuedAt,
  );

  const rawPaymentAccessToken =
    generateRawPaymentAccessToken();

  const paymentAccessTokenHash =
    hashTrustClubPaymentAccessToken(
      rawPaymentAccessToken,
    );

  const persistedInvitation =
    await trustClubInvitationPersistence
      .setPaymentAccessForRequested({
        invitationId,

        paymentAccessTokenHash,

        paymentAccessExpiresAt:
          input.expiresAt,

        issuedAt,
      });

  if (
    persistedInvitation.status !==
      'REQUESTED' ||
    persistedInvitation.paymentAccessTokenHash !==
      paymentAccessTokenHash ||
    persistedInvitation.paymentAccessExpiresAt ===
      null ||
    persistedInvitation.tokenHash !==
      null ||
    persistedInvitation.approvedByUserId !==
      null ||
    persistedInvitation.approvedAt !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_ACCESS_ISSUANCE_VERIFICATION_FAILED',
    );
  }

  return {
    invitation:
      persistedInvitation,

    rawPaymentAccessToken,
  };
}

export const TRUST_CLUB_PAYMENT_ACCESS_ADMIN_AUTHORITY_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_ISSUANCE_REQUIRES_AUTHENTICATED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_RAW_TOKEN_RULE =
  'RAW_PRIVATE_PAYMENT_ACCESS_TOKEN_IS_RETURNED_ONCE_AND_NEVER_PERSISTED' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_HASH_RULE =
  'PRIVATE_PAYMENT_ACCESS_PERSISTENCE_RECEIVES_SHA256_TOKEN_HASH_ONLY' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_INVITATION_STATUS_RULE =
  'PRIVATE_PAYMENT_ACCESS_ISSUANCE_PRESERVES_REQUESTED_INVITATION_STATUS' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_REGISTRATION_BOUNDARY_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_IS_DISTINCT_FROM_POST_PAYMENT_REGISTRATION_TOKEN' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_PAYMENT_INTENT_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_ISSUANCE_DOES_NOT_CREATE_PAYMENT_INTENT' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_SETTLEMENT_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_ISSUANCE_DOES_NOT_CONFIRM_SETTLEMENT' as const;

export const TRUST_CLUB_PAYMENT_ACCESS_MEMBERSHIP_RULE =
  'PRIVATE_PAYMENT_ACCESS_TOKEN_ISSUANCE_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;