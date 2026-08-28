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
  requireTrustClubTokenPaymentConfirmation,
} from '../payment/trust-club-token-payment-gate.service';

import {
  trustClubInvitationPersistence,
} from './trust-club-invitation.persistence';

import type {
  IssueTrustClubInvitationTokenInput,
  IssuedTrustClubInvitationToken,
} from './trust-club-invitation-token-issuance.contracts';

import {
  TRUST_CLUB_INVITATION_TOKEN_ENTROPY_BYTES,
  TRUST_CLUB_INVITATION_TOKEN_HASH_ALGORITHM,
} from './trust-club-invitation-token-issuance.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 6.9
 *
 * Cryptographic Invitation Token Issuance Service
 *
 * Security sequence:
 *
 * 1. resolve authenticated identity through the existing
 *    Trust Club Authentication Source;
 * 2. require persisted TRUST_CLUB_ADMIN authority through
 *    the certified Admin Review Authorization boundary;
 * 3. load the invitation;
 * 4. require REQUESTED status;
 * 5. require a valid future expiration;
 * 6. generate 256 bits of cryptographically secure entropy;
 * 7. encode the raw token as base64url;
 * 8. hash the raw token with SHA-256;
 * 9. atomically persist REQUESTED -> APPROVED using only
 *    the token hash;
 * 10. return the raw token exactly from this issuance boundary.
 *
 * The raw token is never sent to persistence.
 */

export interface IssueTrustClubInvitationTokenAsAdminInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  issuance:
    IssueTrustClubInvitationTokenInput;
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
      'TRUST_CLUB_INVITATION_ID_REQUIRED',
    );
  }

  return normalized;
}

function requireFutureExpiration(
  expiresAt:
    Date,
  approvedAt:
    Date,
): void {
  const expiresAtMilliseconds =
    expiresAt.getTime();

  const approvedAtMilliseconds =
    approvedAt.getTime();

  if (
    !Number.isFinite(
      expiresAtMilliseconds,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_EXPIRATION_INVALID',
    );
  }

  if (
    expiresAtMilliseconds <=
      approvedAtMilliseconds
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_EXPIRATION_NOT_AFTER_APPROVAL',
    );
  }
}

function generateRawInvitationToken():
  string {
  return randomBytes(
    TRUST_CLUB_INVITATION_TOKEN_ENTROPY_BYTES,
  ).toString(
    'base64url',
  );
}

function hashInvitationToken(
  rawToken:
    string,
): string {
  return createHash(
    TRUST_CLUB_INVITATION_TOKEN_HASH_ALGORITHM,
  )
    .update(
      rawToken,
      'utf8',
    )
    .digest(
      'hex',
    );
}

export async function issueTrustClubInvitationTokenAsAdmin(
  input:
    IssueTrustClubInvitationTokenAsAdminInput,
): Promise<
  IssuedTrustClubInvitationToken
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
        ? 'TRUST_CLUB_INVITATION_ISSUANCE_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_INVITATION_ISSUANCE_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  const invitationId =
    requireInvitationId(
      input.issuance.invitationId,
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
      'TRUST_CLUB_INVITATION_NOT_FOUND',
    );
  }

  if (
    invitation.status !==
      'REQUESTED'
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_REQUIRES_REQUESTED_STATUS',
    );
  }

  if (
    invitation.tokenHash !==
      null ||
    invitation.approvedByUserId !==
      null ||
    invitation.approvedAt !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_REQUESTED_STATE_NOT_CLEAN',
    );
  }

  await requireTrustClubTokenPaymentConfirmation({
    invitationId,
  });

  const approvedAt =
    new Date();

  requireFutureExpiration(
    input.issuance.expiresAt,
    approvedAt,
  );

  const rawToken =
    generateRawInvitationToken();

  const tokenHash =
    hashInvitationToken(
      rawToken,
    );

  const approvedInvitation =
    await trustClubInvitationPersistence
      .approveRequested({
        invitationId,

        tokenHash,

        expiresAt:
          input.issuance.expiresAt,

        approvedByUserId:
          adminAuthorization.authenticatedUserId,

        approvedAt,
      });

  if (
    approvedInvitation.status !==
      'APPROVED'
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_APPROVED_STATUS_NOT_PERSISTED',
    );
  }

  if (
    approvedInvitation.tokenHash !==
      tokenHash
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_TOKEN_HASH_NOT_PERSISTED',
    );
  }

  if (
    approvedInvitation.approvedByUserId !==
      adminAuthorization.authenticatedUserId
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_ADMIN_IDENTITY_MISMATCH',
    );
  }

  if (
    approvedInvitation.approvedAt ===
      null ||
    approvedInvitation.expiresAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_ISSUANCE_TIMESTAMPS_NOT_PERSISTED',
    );
  }

  return {
    invitation:
      approvedInvitation,

    rawToken,
  };
}

/**
 * Cryptographic entropy rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_CRYPTOGRAPHY_RULE =
  'INVITATION_TOKEN_USES_NODE_CRYPTO_RANDOM_BYTES_256_BIT' as const;

/**
 * Raw-token persistence rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_PERSISTENCE_SECRET_RULE =
  'INVITATION_PERSISTENCE_RECEIVES_ONLY_SHA256_TOKEN_HASH' as const;

/**
 * Administrative identity rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_AUTHENTICATED_ADMIN_RULE =
  'APPROVED_BY_USER_ID_IS_DERIVED_FROM_CERTIFIED_ADMIN_AUTHORIZATION' as const;

/**
 * Replay / duplicate issuance boundary.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_SINGLE_TRANSITION_RULE =
  'TOKEN_ISSUANCE_CAN_TRANSITION_ONLY_REQUESTED_INVITATION' as const;

/**
 * Delivery boundary.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_DELIVERY_RULE =
  'TOKEN_ISSUANCE_DOES_NOT_SEND_EMAIL_OR_DELIVER_TOKEN' as const;

/**
 * Registration boundary.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_REGISTRATION_RULE =
  'TOKEN_ISSUANCE_DOES_NOT_CREATE_USER_OR_REGISTRATION_SESSION' as const;
