import type {
  TrustClubActionOutcome,
  TrustClubActionOutcomeType,
} from './trust-club-action-outcome.contracts';

import type {
  TrustClubActionStatus,
} from './trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.5
 * Action Outcome Consistency Policy
 *
 * Purpose:
 * Evaluates whether a Trust Club Action outcome type is
 * consistent with the Action lifecycle status represented by
 * the outcome.
 *
 * Phase 4.5 does not create a new Action lifecycle vocabulary.
 *
 * Phase 4.0 remains the sole authority for Action lifecycle
 * transition permission.
 *
 * Phase 4.4 remains the Action Outcome Domain Model.
 *
 * This policy:
 * - evaluates Action-status / outcome-type consistency only;
 * - does not modify an Action record;
 * - does not perform lifecycle transitions;
 * - does not construct or persist outcomes;
 * - does not authorize the underlying Trust action;
 * - does not authenticate users;
 * - does not verify identity;
 * - does not resolve entitlements;
 * - does not access a database;
 * - does not access Prisma;
 * - does not access Atlantis;
 * - does not execute payments;
 * - does not execute banking activity;
 * - does not execute external services;
 * - does not prove external completion.
 */

const CONSISTENT_OUTCOME_BY_STATUS:
  Readonly<
    Partial<
      Record<
        TrustClubActionStatus,
        TrustClubActionOutcomeType
      >
    >
  > = {
    INTERNAL_COMPLETE:
      'INTERNAL_COMPLETION',

    EXTERNAL_PENDING:
      'EXTERNAL_PENDING',

    COMPLETE:
      'COMPLETED',

    REJECTED:
      'REJECTED',

    CANCELLED:
      'CANCELLED',
  };

export type TrustClubActionOutcomeConsistencyReason =
  | 'CONSISTENT'
  | 'ACTION_STATUS_HAS_NO_OUTCOME'
  | 'OUTCOME_TYPE_MISMATCH';

export interface TrustClubActionOutcomeConsistencyDecision {
  consistent:
    boolean;

  actionStatus:
    TrustClubActionStatus;

  outcomeType:
    TrustClubActionOutcomeType;

  expectedOutcomeType?:
    TrustClubActionOutcomeType;

  reason:
    TrustClubActionOutcomeConsistencyReason;
}

/**
 * Evaluates whether the supplied lifecycle status and outcome
 * type form an approved Phase 4.5 combination.
 *
 * Lifecycle statuses that do not represent an outcome-bearing
 * state are rejected rather than assigned a synthetic outcome.
 */
export function evaluateTrustClubActionOutcomeConsistency(
  actionStatus:
    TrustClubActionStatus,

  outcomeType:
    TrustClubActionOutcomeType,
): TrustClubActionOutcomeConsistencyDecision {
  const expectedOutcomeType =
    CONSISTENT_OUTCOME_BY_STATUS[
      actionStatus
    ];

  if (!expectedOutcomeType) {
    return {
      consistent:
        false,

      actionStatus,

      outcomeType,

      reason:
        'ACTION_STATUS_HAS_NO_OUTCOME',
    };
  }

  if (
    expectedOutcomeType !==
    outcomeType
  ) {
    return {
      consistent:
        false,

      actionStatus,

      outcomeType,

      expectedOutcomeType,

      reason:
        'OUTCOME_TYPE_MISMATCH',
    };
  }

  return {
    consistent:
      true,

    actionStatus,

    outcomeType,

    expectedOutcomeType,

    reason:
      'CONSISTENT',
  };
}

/**
 * Evaluates an already constructed Phase 4.4 Action Outcome.
 *
 * The supplied outcome remains unchanged.
 */
export function evaluateTrustClubActionOutcomeRecordConsistency(
  outcome:
    TrustClubActionOutcome,
): TrustClubActionOutcomeConsistencyDecision {
  return evaluateTrustClubActionOutcomeConsistency(
    outcome.actionStatus,
    outcome.outcomeType,
  );
}