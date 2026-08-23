import {
  orchestrateTrustClubActionOutcomeCreation,
} from './trust-club-action-outcome-creation.service';

import type {
  TrustClubActionOutcomeIntegrationInput,
  TrustClubActionOutcomeIntegrationResult,
} from './trust-club-action-outcome-integration.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.7
 * Action / Outcome Integration Closure Service
 *
 * Purpose:
 * Coordinates an already established Phase 4.3 Action
 * progression result with Phase 4.6 consistency-gated
 * Action Outcome creation.
 *
 * This service:
 * - uses the progressed Action record as the authoritative
 *   Action state;
 * - verifies Action identity consistency;
 * - verifies lifecycle-status consistency;
 * - delegates controlled outcome creation to Phase 4.6;
 * - preserves the supplied Phase 4.3 progression result.
 *
 * It does NOT:
 * - create a new Action lifecycle vocabulary;
 * - decide lifecycle-transition permission;
 * - perform a lifecycle transition;
 * - modify the progression result;
 * - modify an Action record;
 * - bypass Phase 4.5 consistency evaluation;
 * - bypass Phase 4.6 outcome creation;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - persist Action records or outcomes;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - prove external completion.
 */

function assertActionIdentityConsistency(
  input:
    TrustClubActionOutcomeIntegrationInput,
): void {
  const progressedRecord =
    input.progression.progressedRecord;

  if (
    progressedRecord.actionId !==
      input.outcome.actionId ||
    progressedRecord.actionType !==
      input.outcome.actionType
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_IDENTITY_MISMATCH',
    );
  }
}

function assertActionStatusConsistency(
  input:
    TrustClubActionOutcomeIntegrationInput,
): void {
  if (
    input.progression.progressedRecord.status !==
    input.outcome.actionStatus
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_STATUS_MISMATCH',
    );
  }
}

export function integrateTrustClubActionOutcome(
  input:
    TrustClubActionOutcomeIntegrationInput,
): TrustClubActionOutcomeIntegrationResult {
  assertActionIdentityConsistency(
    input,
  );

  assertActionStatusConsistency(
    input,
  );

  const outcomeCreation =
    orchestrateTrustClubActionOutcomeCreation({
      outcome:
        input.outcome,
    });

  return {
    progression:
      input.progression,

    consistency:
      outcomeCreation.consistency,

    outcome:
      outcomeCreation.outcome,
  };
}