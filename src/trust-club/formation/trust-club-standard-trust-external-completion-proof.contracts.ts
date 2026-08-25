/**
 * TRUST-CLUB-V1
 *
 * Phase 7.9
 * Standard Trust External Completion Proof Contracts
 *
 * Purpose:
 * Defines the narrow evidence and verification contract required
 * before a Standard Trust Formation Action may be considered for
 * final lifecycle completion.
 *
 * This contract establishes an administrative verification boundary.
 *
 * It does NOT:
 * - authenticate credentials;
 * - accept caller-supplied administrative authority;
 * - grant TRUST_CLUB_ADMIN;
 * - resolve System Roles;
 * - verify an external service automatically;
 * - call an external provider;
 * - prove cryptographic authenticity of an external reference;
 * - transition an Action lifecycle;
 * - create a COMPLETED Action outcome;
 * - persist evidence;
 * - access Prisma;
 * - access a database;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity.
 */

export type TrustClubStandardTrustExternalCompletionVerificationStatus =
  | 'VERIFIED'
  | 'REJECTED';

export type TrustClubStandardTrustExternalCompletionRejectionReason =
  | 'ACTION_ID_REQUIRED'
  | 'EXTERNAL_REFERENCE_REQUIRED'
  | 'COMPLETED_AT_REQUIRED'
  | 'VERIFICATION_AUTHORITY_REQUIRED';

export interface TrustClubStandardTrustExternalCompletionEvidence {
  /**
   * Reference supplied as evidence that the relevant external
   * completion event has occurred.
   *
   * Phase 7.9 requires a non-empty normalized value before
   * administrative verification may succeed.
   *
   * Presence of this value alone is not external verification.
   */
  externalReference:
    string;

  /**
   * Timestamp representing when the external completion is
   * reported to have occurred.
   *
   * This value is evidence metadata only and is not itself
   * verification authority.
   */
  completedAt:
    string;
}

export interface TrustClubStandardTrustExternalCompletionVerificationInput {
  /**
   * Existing Trust Club Action being evaluated.
   */
  actionId:
    string;

  /**
   * External completion evidence presented for verification.
   */
  evidence:
    TrustClubStandardTrustExternalCompletionEvidence;
}

/**
 * Successful verification result.
 *
 * verifiedByUserId must be derived by the verification service
 * from the certified authenticated TRUST_CLUB_ADMIN authority.
 *
 * It must never be accepted from caller input.
 */
export interface TrustClubStandardTrustExternalCompletionVerifiedResult {
  status:
    'VERIFIED';

  actionId:
    string;

  externalReference:
    string;

  completedAt:
    string;

  verifiedByUserId:
    string;

  verifiedAt:
    string;
}

/**
 * Rejected verification result.
 *
 * A rejected result grants no lifecycle-transition authority.
 */
export interface TrustClubStandardTrustExternalCompletionRejectedResult {
  status:
    'REJECTED';

  actionId:
    string;

  reason:
    TrustClubStandardTrustExternalCompletionRejectionReason;
}

export type TrustClubStandardTrustExternalCompletionVerificationResult =
  | TrustClubStandardTrustExternalCompletionVerifiedResult
  | TrustClubStandardTrustExternalCompletionRejectedResult;

/**
 * Evidence rule.
 *
 * Final completion consideration requires an explicit external
 * reference. The general Action Outcome contract remains unchanged.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_REFERENCE_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_REQUIRES_NON_EMPTY_EXTERNAL_REFERENCE' as const;

/**
 * Administrative authority rule.
 *
 * Verification authority must come from the existing certified
 * persisted TRUST_CLUB_ADMIN System Role boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_ADMIN_AUTHORITY_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_REQUIRES_CERTIFIED_TRUST_CLUB_ADMIN_AUTHORITY' as const;

/**
 * Caller-authority rule.
 *
 * The caller cannot nominate or assert the administrative identity
 * that verifies external completion evidence.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_CALLER_AUTHORITY_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_DOES_NOT_ACCEPT_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

/**
 * Verified-identity rule.
 *
 * verifiedByUserId must be derived from the authenticated identity
 * returned by the certified Admin Review Authorization boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFIED_BY_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFIED_BY_IS_DERIVED_FROM_AUTHENTICATED_TRUST_CLUB_ADMIN' as const;

/**
 * External-proof limitation.
 *
 * Administrative verification records a controlled decision over
 * supplied evidence. It does not independently contact or validate
 * an external provider.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_EXTERNAL_PROOF_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_ADMIN_VERIFICATION_DOES_NOT_AUTOMATICALLY_VERIFY_EXTERNAL_PROVIDER_STATE' as const;

/**
 * Lifecycle boundary.
 *
 * A VERIFIED result is a prerequisite that may be consumed by a
 * later final-completion operation. This contract does not perform
 * EXTERNAL_PENDING -> COMPLETE.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_LIFECYCLE_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

/**
 * Outcome boundary.
 *
 * Verification does not itself create the COMPLETED Action outcome.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_OUTCOME_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_DOES_NOT_CREATE_COMPLETED_OUTCOME' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_PERSISTENCE_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_CONTRACT_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * External execution boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_EXECUTION_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_DOES_NOT_EXECUTE_EXTERNAL_SERVICE' as const;