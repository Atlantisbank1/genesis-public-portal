import type {
  TrustClubActionProgressionResult,
} from './trust-club-action-progression.contracts';

import type {
  TrustClubActionOutcomeCreationInput,
  TrustClubActionOutcome,
} from './trust-club-action-outcome.contracts';

import type {
  TrustClubActionOutcomeConsistencyDecision,
} from './trust-club-action-outcome-consistency.policy';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.7
 * Action / Outcome Integration Closure Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * coordinate an already completed Phase 4.3 Action progression
 * result with Phase 4.6 Action Outcome creation.
 *
 * Phase 4.7 reuses:
 *
 * - Phase 4.3 Action Progression Orchestration;
 * - Phase 4.6 Action Outcome Creation Orchestration;
 * - Phase 4.5 Action Outcome Consistency Policy;
 * - Phase 4.4 Action Outcome Domain Model.
 *
 * Phase 4.7 does not replace or bypass any of those authorities.
 *
 * It does NOT:
 * - create a new Action lifecycle vocabulary;
 * - decide lifecycle-transition permission;
 * - modify the Phase 4.3 progression result;
 * - modify an Action record;
 * - invent an Action outcome;
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

export interface TrustClubActionOutcomeIntegrationInput {
  progression:
    TrustClubActionProgressionResult;

  outcome:
    TrustClubActionOutcomeCreationInput;
}

export interface TrustClubActionOutcomeIntegrationResult {
  progression:
    TrustClubActionProgressionResult;

  consistency:
    TrustClubActionOutcomeConsistencyDecision;

  outcome:
    TrustClubActionOutcome | null;
}

/**
 * Progression-source rule.
 *
 * Phase 4.7 accepts an already established Phase 4.3
 * progression result and does not independently perform or
 * authorize a lifecycle transition.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_PROGRESSION_RULE =
  'ACTION_OUTCOME_INTEGRATION_USES_PHASE_4_3_PROGRESSION_RESULT' as const;

/**
 * Progressed-record rule.
 *
 * Outcome integration must use the progressed Action record as
 * the authoritative Action state for outcome association.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_RECORD_RULE =
  'ACTION_OUTCOME_INTEGRATION_USES_PROGRESSED_ACTION_RECORD_STATE' as const;

/**
 * Outcome-creation authority rule.
 *
 * Phase 4.6 remains the controlled orchestration authority for
 * consistency-gated Action Outcome construction.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_CREATION_RULE =
  'ACTION_OUTCOME_INTEGRATION_USES_PHASE_4_6_OUTCOME_CREATION' as const;

/**
 * Identity-consistency rule.
 *
 * Supplied outcome information must describe the same Action
 * represented by the progressed Action record.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_IDENTITY_RULE =
  'ACTION_OUTCOME_MUST_MATCH_PROGRESSED_ACTION_IDENTITY' as const;

/**
 * Lifecycle-consistency rule.
 *
 * Supplied outcome information must use the lifecycle status
 * of the progressed Action record.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_STATUS_RULE =
  'ACTION_OUTCOME_STATUS_MUST_MATCH_PROGRESSED_ACTION_STATUS' as const;

/**
 * Persistence boundary.
 *
 * An integrated progression / outcome result remains a domain
 * representation only and does not prove persistence.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_PERSISTENCE_RULE =
  'ACTION_OUTCOME_INTEGRATION_IS_NOT_PERSISTENCE' as const;

/**
 * External-completion boundary.
 *
 * An integrated Action / Outcome representation does not prove
 * completion of an external service, payment, banking process
 * or other external action.
 */
export const TRUST_CLUB_ACTION_OUTCOME_INTEGRATION_EXTERNAL_RULE =
  'ACTION_OUTCOME_INTEGRATION_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;