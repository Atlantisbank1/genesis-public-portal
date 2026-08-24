import {
  createHash,
} from 'node:crypto';

import {
  trustClubInvitationPersistence,
} from './trust-club-invitation.persistence';

import type {
  RedeemTrustClubInvitationTokenInput,
  RedeemedTrustClubInvitationToken,
} from './trust-club-invitation-token-redemption.contracts';

import {
  TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_ALGORITHM,
} from './trust-club-invitation-token-redemption.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 7.0
 *
 * Cryptographic Invitation Token Redemption Service
 *
 * Security sequence:
 *
 * 1. receive the transient raw invitation token;
 * 2. require a non-empty raw token;
 * 3. hash the raw token with SHA-256;
 * 4. resolve the persisted invitation by token hash;
 * 5. require APPROVED status;
 * 6. require persisted expiration;
 * 7. require the invitation to remain unexpired;
 * 8. atomically persist APPROVED -> CONSUMED through the
 *    certified invitation persistence boundary;
 * 9. verify the persisted consumed state;
 * 10. return only the persisted invitation aggregate.
 *
 * The raw token is never sent to persistence.
 *
 * This service does not:
 *
 * - activate membership;
 * - create a user;
 * - create a registration session;
 * - authorize application access;
 * - create public HTTP exposure.
 */

function requireRawInvitationToken(
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
      'TRUST_CLUB_INVITATION_RAW_TOKEN_REQUIRED',
    );
  }

  return normalized;
}

function hashInvitationToken(
  rawToken:
    string,
): string {
  return createHash(
    TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_ALGORITHM,
  )
    .update(
      rawToken,
      'utf8',
    )
    .digest(
      'hex',
    );
}

function requireApprovedInvitationExpiration(
  expiresAt:
    Date | null,
  consumedAt:
    Date,
): void {
  if (
    expiresAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRATION_REQUIRED',
    );
  }

  const expiresAtMilliseconds =
    expiresAt.getTime();

  const consumedAtMilliseconds =
    consumedAt.getTime();

  if (
    !Number.isFinite(
      expiresAtMilliseconds,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRATION_INVALID',
    );
  }

  if (
    !Number.isFinite(
      consumedAtMilliseconds,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_CONSUMED_AT_INVALID',
    );
  }

  if (
    expiresAtMilliseconds <=
      consumedAtMilliseconds
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_EXPIRED',
    );
  }
}

export async function redeemTrustClubInvitationToken(
  input:
    RedeemTrustClubInvitationTokenInput,
): Promise<
  RedeemedTrustClubInvitationToken
> {
  const rawToken =
    requireRawInvitationToken(
      input.rawToken,
    );

  const tokenHash =
    hashInvitationToken(
      rawToken,
    );

  const invitation =
    await trustClubInvitationPersistence
      .findByTokenHash(
        tokenHash,
      );

  if (
    invitation ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_INVALID_TOKEN',
    );
  }

  if (
    invitation.status !==
      'APPROVED'
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_REQUIRES_APPROVED_STATUS',
    );
  }

  if (
    invitation.tokenHash !==
      tokenHash
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_MISMATCH',
    );
  }

  if (
    invitation.consumedAt !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_ALREADY_CONSUMED',
    );
  }

  const consumedAt =
    new Date();

  requireApprovedInvitationExpiration(
    invitation.expiresAt,
    consumedAt,
  );

  const consumedInvitation =
    await trustClubInvitationPersistence
      .consumeApproved({
        invitationId:
          invitation.id,

        tokenHash,

        consumedAt,
      });

  if (
    consumedInvitation.status !==
      'CONSUMED'
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_CONSUMED_STATUS_NOT_PERSISTED',
    );
  }

  if (
    consumedInvitation.consumedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_CONSUMED_AT_NOT_PERSISTED',
    );
  }

  if (
    consumedInvitation.tokenHash !==
      tokenHash
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_NOT_PRESERVED',
    );
  }

  return {
    invitation:
      consumedInvitation,
  };
}

/**
 * Cryptographic hashing rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_CRYPTOGRAPHY_RULE =
  'INVITATION_REDEMPTION_USES_SHA256_OF_TRANSIENT_RAW_TOKEN' as const;

/**
 * Raw-token persistence rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_SECRET_BOUNDARY_RULE =
  'RAW_INVITATION_TOKEN_NEVER_CROSSES_PERSISTENCE_BOUNDARY' as const;

/**
 * Lifecycle mutation rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_TRANSITION_RULE =
  'REDEMPTION_CAN_TRANSITION_ONLY_APPROVED_INVITATION_TO_CONSUMED' as const;

/**
 * Replay boundary.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_REPLAY_RULE =
  'CONSUMED_INVITATION_CANNOT_BE_REDEEMED_AGAIN' as const;

/**
 * Membership separation rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_MEMBERSHIP_BOUNDARY_RULE =
  'REDEMPTION_IS_NOT_MEMBERSHIP_ACTIVATION' as const;

/**
 * Registration separation rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_REGISTRATION_BOUNDARY_RULE =
  'REDEMPTION_DOES_NOT_CREATE_USER_OR_SESSION' as const;
