import {
  createHash,
} from 'node:crypto';

import {
  trustClubInvitationPersistence,
} from './trust-club-invitation.persistence';

import type {
  TrustClubRegistrationAdmissionInput,
  TrustClubRegistrationAdmissionResult,
} from './trust-club-registration-admission.contracts';

const REGISTRATION_ADMISSION_WINDOW_MS =
  15 * 60 * 1000;

function requireNormalizedEmail(
  value:
    string,
): string {
  const normalized =
    value.trim().toLowerCase();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_EMAIL_REQUIRED',
    );
  }

  return normalized;
}

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
      'TRUST_CLUB_REGISTRATION_ADMISSION_TOKEN_REQUIRED',
    );
  }

  return normalized;
}

function hashRawInvitationToken(
  rawInvitationToken:
    string,
): string {
  return createHash(
    'sha256',
  )
    .update(
      rawInvitationToken,
      'utf8',
    )
    .digest(
      'hex',
    );
}

export async function authorizeTrustClubRegistrationAdmission(
  input:
    TrustClubRegistrationAdmissionInput,
): Promise<
  TrustClubRegistrationAdmissionResult
> {
  const normalizedEmail =
    requireNormalizedEmail(
      input.normalizedEmail,
    );

  const rawInvitationToken =
    requireRawInvitationToken(
      input.rawInvitationToken,
    );

  const tokenHash =
    hashRawInvitationToken(
      rawInvitationToken,
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
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    invitation.status !==
      'CONSUMED'
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    invitation.tokenHash !==
      tokenHash
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    invitation.normalizedEmail !==
      normalizedEmail
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    invitation.consumedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    invitation.expiresAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  const evaluatedAt =
    new Date();

  const consumedAtTime =
    invitation.consumedAt.getTime();

  const invitationExpiresAtTime =
    invitation.expiresAt.getTime();

  const evaluatedAtTime =
    evaluatedAt.getTime();

  if (
    !Number.isFinite(
      consumedAtTime,
    ) ||
    !Number.isFinite(
      invitationExpiresAtTime,
    ) ||
    !Number.isFinite(
      evaluatedAtTime,
    )
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    consumedAtTime >
      evaluatedAtTime
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  if (
    evaluatedAtTime >
      invitationExpiresAtTime
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  const admissionWindowExpiresAt =
    consumedAtTime +
    REGISTRATION_ADMISSION_WINDOW_MS;

  const effectiveAdmissionExpiresAt =
    Math.min(
      admissionWindowExpiresAt,
      invitationExpiresAtTime,
    );

  if (
    evaluatedAtTime >
      effectiveAdmissionExpiresAt
  ) {
    throw new Error(
      'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',
    );
  }

  return {
    admitted:
      true,

    invitationId:
      invitation.id,

    normalizedEmail:
      invitation.normalizedEmail,

    consumedAt:
      invitation.consumedAt,

    admissionExpiresAt:
      new Date(
        effectiveAdmissionExpiresAt,
      ),
  };
}

export const TRUST_CLUB_REGISTRATION_ADMISSION_HASH_RULE =
  'REGISTRATION_ADMISSION_USES_SHA256_OF_TRANSIENT_RAW_INVITATION_TOKEN' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_STATUS_RULE =
  'ONLY_CONSUMED_INVITATION_CAN_AUTHORIZE_REGISTRATION' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_MATCH_RULE =
  'TOKEN_HASH_AND_NORMALIZED_EMAIL_MUST_MATCH_THE_SAME_CONSUMED_INVITATION' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_EXPIRATION_RULE =
  'REGISTRATION_ADMISSION_EXPIRES_AT_EARLIER_OF_INVITATION_EXPIRATION_OR_FIFTEEN_MINUTES_AFTER_CONSUMPTION' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_PERSISTENCE_RULE =
  'REGISTRATION_ADMISSION_READS_INVITATION_PERSISTENCE_BUT_DOES_NOT_PERSIST_RAW_TOKEN' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_AUTHORITY_RULE =
  'REGISTRATION_ADMISSION_DOES_NOT_CREATE_USER_ACCOUNT_SESSION_OR_MEMBERSHIP' as const;