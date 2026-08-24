/**
 * TRUST-CLUB-V1
 * PHASE 6.9
 *
 * Invitation Persistence Contracts
 *
 * Purpose:
 * - represent the persisted Trust Club invitation aggregate;
 * - define the narrow persistence capability required by the
 *   invitation security boundary;
 * - keep authentication, authorization, token generation,
 *   token verification, email delivery, membership activation,
 *   and public HTTP exposure outside persistence.
 */

export type TrustClubInvitationStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'CONSUMED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED';

export interface TrustClubInvitation {
  id:
    string;

  normalizedEmail:
    string;

  status:
    TrustClubInvitationStatus;

  tokenHash:
    string | null;

  expiresAt:
    Date | null;

  approvedByUserId:
    string | null;

  approvedAt:
    Date | null;

  rejectedAt:
    Date | null;

  revokedAt:
    Date | null;

  consumedAt:
    Date | null;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export interface CreateTrustClubInvitationRequestInput {
  normalizedEmail:
    string;
}

export interface TrustClubInvitationPersistence {
  createRequested(
    input:
      CreateTrustClubInvitationRequestInput,
  ): Promise<
    TrustClubInvitation
  >;

  approveRequested(
    input: {
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
    },
  ): Promise<
    TrustClubInvitation
  >;

  findById(
    invitationId:
      string,
  ): Promise<
    TrustClubInvitation | null
  >;

  findByNormalizedEmail(
    normalizedEmail:
      string,
  ): Promise<
    readonly TrustClubInvitation[]
  >;

  findByTokenHash(
    tokenHash:
      string,
  ): Promise<
    TrustClubInvitation | null
  >;
}

export const TRUST_CLUB_INVITATION_PERSISTENCE_SCOPE_RULE =
  'INVITATION_PERSISTENCE_DOES_NOT_OWN_SECURITY_OR_LIFECYCLE_AUTHORITY' as const;

export const TRUST_CLUB_INVITATION_RAW_TOKEN_RULE =
  'RAW_INVITATION_TOKEN_IS_NEVER_PERSISTED' as const;

export const TRUST_CLUB_INVITATION_HTTP_EXPOSURE_RULE =
  'INVITATION_PERSISTENCE_IS_NOT_PUBLIC_HTTP_BOUNDARY' as const;
