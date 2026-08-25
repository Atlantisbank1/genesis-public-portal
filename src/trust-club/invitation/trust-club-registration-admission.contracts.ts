/**
 * TRUST-CLUB-V1
 * PHASE 7.2
 *
 * Invitation-Gated Registration Admission Contracts
 *
 * Purpose:
 * - define the narrow pre-authentication registration admission
 *   boundary for Trust Club account creation;
 * - require proof derived from an already-consumed invitation;
 * - bind registration admission to the invitation email;
 * - keep Better Auth as the sole credential, user, account,
 *   and session authority.
 *
 * This contract does NOT:
 * - authenticate credentials;
 * - hash passwords;
 * - create users;
 * - create accounts;
 * - create sessions;
 * - establish Membership;
 * - activate Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - authorize Trust actions;
 * - persist raw invitation tokens.
 */

export interface TrustClubRegistrationAdmissionInput {
  normalizedEmail:
    string;

  rawInvitationToken:
    string;
}

export interface TrustClubRegistrationAdmissionResult {
  admitted:
    true;

  invitationId:
    string;

  normalizedEmail:
    string;

  consumedAt:
    Date;

  admissionExpiresAt:
    Date;
}

export const TRUST_CLUB_REGISTRATION_ADMISSION_INVITATION_RULE =
  'REGISTRATION_REQUIRES_ALREADY_CONSUMED_INVITATION' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_EMAIL_RULE =
  'REGISTRATION_EMAIL_MUST_MATCH_CONSUMED_INVITATION_EMAIL' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_SECRET_RULE =
  'RAW_INVITATION_TOKEN_IS_TRANSIENT_REGISTRATION_PROOF_AND_IS_NEVER_PERSISTED' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_AUTHENTICATION_RULE =
  'REGISTRATION_ADMISSION_DOES_NOT_REPLACE_BETTER_AUTH_AUTHENTICATION_AUTHORITY' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_MEMBERSHIP_RULE =
  'REGISTRATION_ADMISSION_DOES_NOT_ESTABLISH_MEMBERSHIP' as const;

export const TRUST_CLUB_REGISTRATION_ADMISSION_WINDOW_RULE =
  'REGISTRATION_ADMISSION_IS_TIME_BOUNDED_AFTER_INVITATION_CONSUMPTION' as const;