import {
  authorizeTrustClubAdminReview,
} from '../server/trust-club-admin-review-authorization.service';

import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

/**
 * TRUST-CLUB-V1
 * PHASE 6.8
 *
 * Standard Trust Formation Admin Review Decision Operation
 *
 * Purpose:
 *
 * Applies one controlled administrative review decision to an
 * existing CREATE_STANDARD_TRUST Action that is currently in
 * PENDING_REVIEW.
 *
 * Supported administrative decisions:
 *
 * AUTHORIZE:
 * PENDING_REVIEW -> AUTHORIZED
 *
 * REJECT:
 * PENDING_REVIEW -> REJECTED
 *
 * Administrative authority is established before lifecycle
 * progression through the dedicated persisted System Role
 * authorization boundary.
 *
 * Lifecycle progression itself remains delegated to the existing
 * certified Server Application Entry -> certified Gateway ->
 * TRANSITION_ACTION execution chain.
 *
 * This operation does NOT:
 * - accept caller-supplied System Roles as administrative authority;
 * - grant or revoke TRUST_CLUB_ADMIN;
 * - create System Role assignments;
 * - redefine the Action lifecycle;
 * - create new Action statuses;
 * - directly mutate an Action record;
 * - directly access Prisma;
 * - directly access persistence;
 * - create an HTTP endpoint;
 * - record an Action outcome;
 * - activate Membership;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis.
 */

export type StandardTrustFormationAdminReviewDecision =
  | 'AUTHORIZE'
  | 'REJECT';

export interface ReviewStandardTrustFormationAsAdminInput {
  applicationEntry:
    Omit<
      TrustClubServerApplicationEntryInput,
      'operation' |
      'input'
    >;

  actionId:
    string;

  decision:
    StandardTrustFormationAdminReviewDecision;

  updatedAt:
    string;
}

export interface ReviewStandardTrustFormationAsAdminResult {
  actionId:
    string;

  reviewedByUserId:
    string;

  decision:
    StandardTrustFormationAdminReviewDecision;

  previousActionStatus:
    'PENDING_REVIEW';

  actionStatus:
    'AUTHORIZED' |
    'REJECTED';

  persisted:
    boolean;
}

export async function reviewStandardTrustFormationAsAdmin(
  input:
    ReviewStandardTrustFormationAsAdminInput,
): Promise<ReviewStandardTrustFormationAsAdminResult> {
  const adminAuthorization =
    await authorizeTrustClubAdminReview(
      input.applicationEntry.authenticationSource,
    );

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    throw new Error(
      adminAuthorization.status ===
        'UNAUTHENTICATED'
        ? 'TRUST_CLUB_ADMIN_REVIEW_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_ADMIN_REVIEW_SYSTEM_ROLE_REQUIRED',
    );
  }

  const action =
    await readTrustClubAction({
      actionId:
        input.actionId,
    });

  if (
    action ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_NOT_FOUND',
    );
  }

  if (
    action.actionType !==
      'CREATE_STANDARD_TRUST'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_ACTION_NOT_STANDARD_TRUST_FORMATION',
    );
  }

  if (
    action.status !==
      'PENDING_REVIEW'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_ACTION_NOT_PENDING_REVIEW',
    );
  }

  const requestedStatus:
    'AUTHORIZED' |
    'REJECTED' =
      input.decision ===
        'AUTHORIZE'
        ? 'AUTHORIZED'
        : 'REJECTED';

  const execution =
    await executeTrustClubServerApplicationEntry({
      ...input.applicationEntry,

      operation:
        'TRANSITION_ACTION',

      input: {
        actionId:
          input.actionId,

        requestedStatus,

        updatedAt:
          input.updatedAt,
      },
    });

  if (
    execution.status !==
      'EXECUTED' ||
    execution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_TRANSITION_NOT_EXECUTED',
    );
  }

  const gatewayExecution =
    execution.value;

  if (
    gatewayExecution.status !==
      'EXECUTED' ||
    gatewayExecution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    gatewayExecution.value;

  if (
    transition.previousRecord.actionId !==
      input.actionId ||
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_ACTION_ID_MISMATCH',
    );
  }

  if (
    transition.previousRecord.status !==
      'PENDING_REVIEW'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      requestedStatus
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_REVIEW_TARGET_STATUS_INVALID',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    reviewedByUserId:
      adminAuthorization.authenticatedUserId,

    decision:
      input.decision,

    previousActionStatus:
      'PENDING_REVIEW',

    actionStatus:
      requestedStatus,

    persisted:
      transition.persisted,
  };
}

/**
 * Administrative authority rule.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_AUTHORITY_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN' as const;

/**
 * Source-status rule.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_REQUIRES_PENDING_REVIEW' as const;

/**
 * Authorization decision rule.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_AUTHORIZE_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_AUTHORIZE_TARGETS_AUTHORIZED' as const;

/**
 * Rejection decision rule.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_REJECT_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_REJECT_TARGETS_REJECTED' as const;

/**
 * Cancellation boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_CANCELLATION_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_DOES_NOT_TREAT_CANCELLATION_AS_REVIEW_DECISION' as const;

/**
 * Certified execution rule.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_EXECUTION_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_USES_SERVER_APPLICATION_ENTRY_CERTIFIED_TRANSITION_ACTION' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_PERSISTENCE_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_STANDARD_TRUST_ADMIN_REVIEW_EXPOSURE_RULE =
  'STANDARD_TRUST_ADMIN_REVIEW_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;
