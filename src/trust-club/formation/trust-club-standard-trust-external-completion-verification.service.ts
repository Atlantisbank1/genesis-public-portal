import {
  authorizeTrustClubAdminReview,
} from '../server/trust-club-admin-review-authorization.service';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '../server/trust-club-server-application-entry.contracts';

import type {
  TrustClubStandardTrustExternalCompletionVerificationInput,
  TrustClubStandardTrustExternalCompletionVerificationResult,
} from './trust-club-standard-trust-external-completion-proof.contracts';

export interface VerifyStandardTrustExternalCompletionInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  verification:
    TrustClubStandardTrustExternalCompletionVerificationInput;

  verifiedAt:
    string;
}

function normalizeRequiredString(
  value:
    string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

export async function verifyStandardTrustExternalCompletion(
  input:
    VerifyStandardTrustExternalCompletionInput,
): Promise<TrustClubStandardTrustExternalCompletionVerificationResult> {
  const actionId =
    normalizeRequiredString(
      input.verification.actionId,
    );

  if (
    actionId ===
      null
  ) {
    return {
      status:
        'REJECTED',

      actionId:
        '',

      reason:
        'ACTION_ID_REQUIRED',
    };
  }

  const externalReference =
    normalizeRequiredString(
      input.verification.evidence.externalReference,
    );

  if (
    externalReference ===
      null
  ) {
    return {
      status:
        'REJECTED',

      actionId,

      reason:
        'EXTERNAL_REFERENCE_REQUIRED',
    };
  }

  const completedAt =
    normalizeRequiredString(
      input.verification.evidence.completedAt,
    );

  if (
    completedAt ===
      null
  ) {
    return {
      status:
        'REJECTED',

      actionId,

      reason:
        'COMPLETED_AT_REQUIRED',
    };
  }

  const verifiedAt =
    normalizeRequiredString(
      input.verifiedAt,
    );

  if (
    verifiedAt ===
      null
  ) {
    return {
      status:
        'REJECTED',

      actionId,

      reason:
        'VERIFICATION_AUTHORITY_REQUIRED',
    };
  }

  const adminAuthorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    return {
      status:
        'REJECTED',

      actionId,

      reason:
        'VERIFICATION_AUTHORITY_REQUIRED',
    };
  }

  const verifiedByUserId =
    normalizeRequiredString(
      adminAuthorization.authenticatedUserId,
    );

  if (
    verifiedByUserId ===
      null
  ) {
    return {
      status:
        'REJECTED',

      actionId,

      reason:
        'VERIFICATION_AUTHORITY_REQUIRED',
    };
  }

  return {
    status:
      'VERIFIED',

    actionId,

    externalReference,

    completedAt,

    verifiedByUserId,

    verifiedAt,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_AUTHORITY_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_USES_CERTIFIED_ADMIN_REVIEW_AUTHORIZATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_IDENTITY_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFIED_BY_IS_DERIVED_FROM_AUTHENTICATED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_INPUT_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_NORMALIZES_REQUIRED_INPUTS' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_REJECTION_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_FAILS_CLOSED' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_PERSISTENCE_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_SERVICE_DOES_NOT_WRITE_PERSISTENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_LIFECYCLE_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_SERVICE_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_OUTCOME_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_SERVICE_DOES_NOT_RECORD_ACTION_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_EXTERNAL_EXECUTION_RULE =
  'STANDARD_TRUST_EXTERNAL_COMPLETION_VERIFICATION_SERVICE_DOES_NOT_EXECUTE_EXTERNAL_SERVICE' as const;