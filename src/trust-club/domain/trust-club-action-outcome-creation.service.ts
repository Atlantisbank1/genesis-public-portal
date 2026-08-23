import {
  createTrustClubActionOutcome,
} from './trust-club-action-outcome.service';

import {
  evaluateTrustClubActionOutcomeConsistency,
} from './trust-club-action-outcome-consistency.policy';

import type {
  TrustClubActionOutcomeCreationOrchestrationInput,
  TrustClubActionOutcomeCreationOrchestrationResult,
} from './trust-club-action-outcome-creation.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.6
 * Action Outcome Creation Orchestration Service
 *
 * Purpose:
 * Coordinates Phase 4.5 Action Outcome consistency evaluation
 * with Phase 4.4 Action Outcome construction.
 *
 * This service:
 * - evaluates the supplied Action status / outcome type through
 *   the certified Phase 4.5 consistency policy;
 * - prevents Action Outcome construction when consistency fails;
 * - delegates Action Outcome construction to Phase 4.4 when
 *   consistency succeeds.
 *
 * It does NOT:
 * - create a new Action lifecycle vocabulary;
 * - modify an Action record;
 * - perform lifecycle transitions;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - persist outcomes;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - prove external completion.
 */

export function orchestrateTrustClubActionOutcomeCreation(
  input:
    TrustClubActionOutcomeCreationOrchestrationInput,
): TrustClubActionOutcomeCreationOrchestrationResult {
  const consistency =
    evaluateTrustClubActionOutcomeConsistency(
      input.outcome.actionStatus,
      input.outcome.outcomeType,
    );

  if (!consistency.consistent) {
    return {
      consistency,

      outcome:
        null,
    };
  }

  const outcome =
    createTrustClubActionOutcome(
      input.outcome,
    );

  return {
    consistency,

    outcome,
  };
}