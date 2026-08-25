import {
  prisma,
} from '@/lib/prisma';

import {
  authorizeTrustClubAdminReview,
} from './trust-club-admin-review-authorization.service';

import type {
  TrustClubEligibilityDecisionInput,
  TrustClubEligibilityDecisionResult,
} from './trust-club-eligibility-decision.contracts';

function requireTargetUserId(
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
      'TRUST_CLUB_ELIGIBILITY_DECISION_TARGET_USER_ID_REQUIRED',
    );
  }

  return normalized;
}

function normalizeOptionalText(
  value:
    string | null | undefined,
): string | null {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

function validateDecisionMetadata(
  input:
    TrustClubEligibilityDecisionInput,
): void {
  if (
    input.decision ===
      'ELIGIBLE' &&
    input.reasonCode !==
      null &&
    input.reasonCode !==
      undefined
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_ELIGIBLE_REASON_CODE_NOT_ALLOWED',
    );
  }

  if (
    input.decision ===
      'RESTRICTED' &&
    (
      input.reasonCode ===
        null ||
      input.reasonCode ===
        undefined
    )
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_RESTRICTED_REASON_CODE_REQUIRED',
    );
  }
}

export async function decideTrustClubEligibilityAsAdmin(
  input:
    TrustClubEligibilityDecisionInput,
): Promise<
  TrustClubEligibilityDecisionResult
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
        ? 'TRUST_CLUB_ELIGIBILITY_DECISION_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_ELIGIBILITY_DECISION_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  const targetUserId =
    requireTargetUserId(
      input.targetUserId,
    );

  validateDecisionMetadata(
    input,
  );

  const internalCaseReference =
    normalizeOptionalText(
      input.internalCaseReference,
    );

  const internalNotes =
    normalizeOptionalText(
      input.internalNotes,
    );

  const existingEligibility =
    await prisma
      .trustClubEligibilityRecord
      .findUnique({
        where: {
          userId:
            targetUserId,
        },
      });

  if (
    existingEligibility ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_RECORD_NOT_FOUND',
    );
  }

  if (
    existingEligibility.status !==
      'REVIEW_REQUIRED'
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_REQUIRES_REVIEW_REQUIRED_STATUS',
    );
  }

  const reviewedAt =
    new Date();

  const reasonCode =
    input.decision ===
      'RESTRICTED'
      ? input.reasonCode ?? null
      : null;

  const updateResult =
    await prisma
      .trustClubEligibilityRecord
      .updateMany({
        where: {
          eligibilityId:
            existingEligibility
              .eligibilityId,

          userId:
            targetUserId,

          status:
            'REVIEW_REQUIRED',
        },

        data: {
          status:
            input.decision,

          reasonCode,

          internalCaseReference,

          internalNotes,

          effectiveAt:
            reviewedAt,

          reviewedBy:
            adminAuthorization
              .authenticatedUserId,

          reviewedAt,

          liftedAt:
            null,
        },
      });

  if (
    updateResult.count !==
      1
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_TRANSITION_PRECONDITION_FAILED',
    );
  }

  const decidedEligibility =
    await prisma
      .trustClubEligibilityRecord
      .findUnique({
        where: {
          eligibilityId:
            existingEligibility
              .eligibilityId,
        },
      });

  if (
    decidedEligibility ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_RESULT_NOT_FOUND',
    );
  }

  if (
    decidedEligibility.status !==
      input.decision
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_STATUS_NOT_PERSISTED',
    );
  }

  if (
    decidedEligibility.reviewedBy !==
      adminAuthorization
        .authenticatedUserId
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_REVIEWER_IDENTITY_MISMATCH',
    );
  }

  if (
    decidedEligibility.reviewedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_REVIEW_TIMESTAMP_NOT_PERSISTED',
    );
  }

  if (
    decidedEligibility.reasonCode !==
      reasonCode
  ) {
    throw new Error(
      'TRUST_CLUB_ELIGIBILITY_DECISION_REASON_CODE_MISMATCH',
    );
  }

  return {
    eligibilityId:
      decidedEligibility
        .eligibilityId,

    userId:
      decidedEligibility
        .userId,

    status:
      input.decision,

    reasonCode:
      decidedEligibility
        .reasonCode,

    internalCaseReference:
      decidedEligibility
        .internalCaseReference,

    internalNotes:
      decidedEligibility
        .internalNotes,

    effectiveAt:
      decidedEligibility
        .effectiveAt,

    reviewedBy:
      adminAuthorization
        .authenticatedUserId,

    reviewedAt:
      decidedEligibility
        .reviewedAt,

    liftedAt:
      decidedEligibility
        .liftedAt,
  };
}

export const TRUST_CLUB_ELIGIBILITY_DECISION_ATOMIC_TRANSITION_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_ATOMICALLY_TRANSITIONS_ONLY_REVIEW_REQUIRED_RECORD' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_REVIEWER_RULE =
  'REVIEWED_BY_IS_DERIVED_FROM_AUTHENTICATED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_TIMESTAMP_RULE =
  'REVIEWED_AT_AND_EFFECTIVE_AT_ARE_SERVER_GENERATED' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_RESTRICTION_REASON_RULE =
  'RESTRICTED_DECISION_REQUIRES_PERSISTED_ELIGIBILITY_REASON_CODE' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_ELIGIBLE_REASON_RULE =
  'ELIGIBLE_DECISION_PERSISTS_NO_RESTRICTION_REASON_CODE' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_REPLAY_RULE =
  'DECISION_CANNOT_REPLAY_AFTER_RECORD_LEAVES_REVIEW_REQUIRED' as const;