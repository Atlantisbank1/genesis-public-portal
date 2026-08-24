import type {
  TrustClubInvitation,
} from './trust-club-invitation.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 7.0
 *
 * Invitation Token Redemption Contracts
 *
 * Security model:
 *
 * raw invitation token
 *   -> strict transient validation
 *   -> SHA-256 token hash
 *   -> APPROVED invitation lookup
 *   -> expiration verification
 *   -> atomic APPROVED -> CONSUMED persistence
 *
 * The raw invitation token is transient security material.
 *
 * It MUST NOT be persisted.
 * It MUST NOT be returned from the redemption boundary.
 * It MUST NOT activate membership.
 * It MUST NOT create a user or registration session.
 */

export interface RedeemTrustClubInvitationTokenInput {
  rawToken:
    string;
}

export interface RedeemedTrustClubInvitationToken {
  invitation:
    TrustClubInvitation;
}

/**
 * Raw-token persistence prohibition.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_RAW_TOKEN_RULE =
  'INVITATION_REDEMPTION_RAW_TOKEN_IS_TRANSIENT_AND_NEVER_PERSISTED' as const;

/**
 * Hashing rule.
 *
 * Redemption MUST use the same SHA-256 representation
 * used by the certified issuance boundary.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_TOKEN_HASH_ALGORITHM =
  'sha256' as const;

/**
 * Source lifecycle rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_SOURCE_STATUS_RULE =
  'INVITATION_TOKEN_REDEMPTION_REQUIRES_APPROVED_STATUS' as const;

/**
 * Target lifecycle rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_TARGET_STATUS_RULE =
  'INVITATION_TOKEN_REDEMPTION_PERSISTS_CONSUMED_STATUS' as const;

/**
 * Expiration rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_EXPIRATION_RULE =
  'INVITATION_TOKEN_REDEMPTION_REQUIRES_UNEXPIRED_APPROVED_INVITATION' as const;

/**
 * Single-use rule.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_SINGLE_USE_RULE =
  'INVITATION_TOKEN_CAN_BE_CONSUMED_EXACTLY_ONCE' as const;

/**
 * Secret comparison boundary.
 *
 * Persistence receives only the SHA-256 token hash.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_PERSISTENCE_SECRET_RULE =
  'INVITATION_REDEMPTION_PERSISTENCE_RECEIVES_ONLY_SHA256_TOKEN_HASH' as const;

/**
 * Membership boundary.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_MEMBERSHIP_RULE =
  'INVITATION_TOKEN_REDEMPTION_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;

/**
 * Registration boundary.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_REGISTRATION_RULE =
  'INVITATION_TOKEN_REDEMPTION_DOES_NOT_CREATE_USER_OR_REGISTRATION_SESSION' as const;

/**
 * HTTP exposure boundary.
 */
export const TRUST_CLUB_INVITATION_REDEMPTION_HTTP_EXPOSURE_RULE =
  'INVITATION_TOKEN_REDEMPTION_CONTRACT_DOES_NOT_CREATE_PUBLIC_HTTP_EXPOSURE' as const;
