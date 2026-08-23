import type {
  TrustClubActionOutcome,
  TrustClubActionOutcomeCreationInput,
} from './trust-club-action-outcome.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.4
 * Action Outcome Domain Model Service
 *
 * Purpose:
 * Constructs a controlled Trust Club Action outcome domain
 * representation from already established Action state and
 * outcome information.
 *
 * This service:
 * - preserves the supplied Action identity;
 * - preserves the supplied Action lifecycle status;
 * - preserves the supplied outcome metadata;
 * - returns a new Action outcome domain representation.
 *
 * It does NOT:
 * - modify an Action record;
 * - perform a lifecycle transition;
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

export function createTrustClubActionOutcome(
  input:
    TrustClubActionOutcomeCreationInput,
): TrustClubActionOutcome {
  return {
    actionId:
      input.actionId,

    actionType:
      input.actionType,

    actionStatus:
      input.actionStatus,

    outcomeType:
      input.outcomeType,

    recordedAt:
      input.recordedAt,

    outcomeCode:
      input.outcomeCode,

    outcomeReason:
      input.outcomeReason,

    externalReference:
      input.externalReference,
  };
}