import type {
  TrustClubInvitation,
} from './trust-club-invitation.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 6.9
 *
 * Invitation Token Issuance Contracts
 *
 * Security model:
 *
 * REQUESTED Invitation
 *   -> authenticated TRUST_CLUB_ADMIN authorization
 *   -> cryptographically secure raw token generation
 *   -> SHA-256 token hash
 *   -> APPROVED persistence
 *   -> raw token returned exactly at issuance boundary
 *
 * The raw invitation token is intentionally NOT part of the
 * persisted TrustClubInvitation aggregate.
 */

export interface IssueTrustClubInvitationTokenInput {
  invitationId:
    string;

  expiresAt:
    Date;
}

/**
 * One-time issuance result.
 *
 * rawToken is transient security material.
 *
 * It may be delivered to the approved recipient by a later
 * delivery boundary, but MUST NOT be persisted.
 */
export interface IssuedTrustClubInvitationToken {
  invitation:
    TrustClubInvitation;

  rawToken:
    string;
}

/**
 * Persistence mutation input produced only after:
 *
 * - admin authorization;
 * - REQUESTED-state verification;
 * - secure token generation;
 * - token hashing;
 * - expiration validation.
 *
 * approvedByUserId is derived from the authenticated
 * TRUST_CLUB_ADMIN identity. It is never caller authority.
 */
export interface ApproveTrustClubInvitationPersistenceInput {
  invitationId:
    string;

  tokenHash:
    string;

  expiresAt:
    Date;

  approvedByUserId:
    string;

  approvedAt:
    Date;
}

/**
 * Raw-token persistence prohibition.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_RAW_TOKEN_RULE =
  'INVITATION_ISSUANCE_RAW_TOKEN_IS_RETURNED_ONCE_AND_NEVER_PERSISTED' as const;

/**
 * Token entropy rule.
 *
 * 32 cryptographically secure random bytes = 256 bits.
 */
export const TRUST_CLUB_INVITATION_TOKEN_ENTROPY_BYTES =
  32 as const;

/**
 * Hashing rule.
 */
export const TRUST_CLUB_INVITATION_TOKEN_HASH_ALGORITHM =
  'sha256' as const;

/**
 * Source lifecycle rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_SOURCE_STATUS_RULE =
  'INVITATION_TOKEN_ISSUANCE_REQUIRES_REQUESTED_STATUS' as const;

/**
 * Target lifecycle rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_TARGET_STATUS_RULE =
  'INVITATION_TOKEN_ISSUANCE_PERSISTS_APPROVED_STATUS' as const;

/**
 * Administrative authority rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_ADMIN_AUTHORITY_RULE =
  'INVITATION_TOKEN_ISSUANCE_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_AUTHORITY' as const;

/**
 * Caller-authority prohibition.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_CALLER_AUTHORITY_RULE =
  'INVITATION_TOKEN_ISSUANCE_DOES_NOT_ACCEPT_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

/**
 * Expiration rule.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_EXPIRATION_RULE =
  'INVITATION_TOKEN_EXPIRATION_MUST_BE_AFTER_ISSUANCE_TIME' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_HTTP_EXPOSURE_RULE =
  'INVITATION_TOKEN_ISSUANCE_CONTRACT_DOES_NOT_CREATE_PUBLIC_HTTP_EXPOSURE' as const;

/**
 * Membership boundary.
 */
export const TRUST_CLUB_INVITATION_ISSUANCE_MEMBERSHIP_RULE =
  'INVITATION_TOKEN_ISSUANCE_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;
