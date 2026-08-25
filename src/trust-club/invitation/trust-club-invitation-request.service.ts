import {
  trustClubInvitationPersistence,
} from './trust-club-invitation.persistence';

import type {
  TrustClubInvitation,
} from './trust-club-invitation.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 7.2
 *
 * Invitation Request Service
 *
 * Purpose:
 * - establish the application boundary that creates a Trust Club
 *   invitation in REQUESTED state;
 * - normalize the requested email before persistence;
 * - preserve invitation approval and token issuance as separate
 *   authenticated administrative operations.
 *
 * This service does NOT:
 * - approve invitations;
 * - generate invitation tokens;
 * - hash invitation tokens;
 * - authenticate users;
 * - authorize administrators;
 * - create Better Auth users;
 * - create sessions;
 * - establish Membership;
 * - activate Membership;
 * - deliver invitation email.
 */

export interface RequestTrustClubInvitationInput {
  email:
    string;
}

function requireNormalizedEmail(
  value:
    string,
): string {
  const normalizedEmail =
    value
      .trim()
      .toLowerCase();

  if (
    normalizedEmail.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REQUEST_EMAIL_REQUIRED',
    );
  }

  return normalizedEmail;
}

export async function requestTrustClubInvitation(
  input:
    RequestTrustClubInvitationInput,
): Promise<
  TrustClubInvitation
> {
  const normalizedEmail =
    requireNormalizedEmail(
      input.email,
    );

  const invitation =
    await trustClubInvitationPersistence
      .createRequested({
        normalizedEmail,
      });

  if (
    invitation.status !==
      'REQUESTED'
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REQUEST_REQUESTED_STATUS_NOT_PERSISTED',
    );
  }

  if (
    invitation.normalizedEmail !==
      normalizedEmail
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_REQUEST_EMAIL_PERSISTENCE_MISMATCH',
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
      'TRUST_CLUB_INVITATION_REQUEST_INITIAL_STATE_NOT_CLEAN',
    );
  }

  return invitation;
}

export const TRUST_CLUB_INVITATION_REQUEST_SOURCE_STATUS_RULE =
  'INVITATION_REQUEST_CREATES_REQUESTED_STATUS' as const;

export const TRUST_CLUB_INVITATION_REQUEST_TOKEN_RULE =
  'INVITATION_REQUEST_DOES_NOT_CREATE_OR_PERSIST_TOKEN_MATERIAL' as const;

export const TRUST_CLUB_INVITATION_REQUEST_APPROVAL_RULE =
  'INVITATION_REQUEST_DOES_NOT_APPROVE_INVITATION' as const;

export const TRUST_CLUB_INVITATION_REQUEST_AUTHORITY_RULE =
  'INVITATION_REQUEST_DOES_NOT_GRANT_ADMINISTRATIVE_AUTHORITY' as const;

export const TRUST_CLUB_INVITATION_REQUEST_MEMBERSHIP_RULE =
  'INVITATION_REQUEST_DOES_NOT_ESTABLISH_MEMBERSHIP' as const;

export const TRUST_CLUB_INVITATION_REQUEST_REGISTRATION_RULE =
  'INVITATION_REQUEST_DOES_NOT_CREATE_AUTHENTICATION_IDENTITY_OR_SESSION' as const;