import type {
  TrustClubActionOutcome,
  TrustClubActionOutcomeCreationInput,
} from './trust-club-action-outcome.contracts';

import type {
  TrustClubActionOutcomeConsistencyDecision,
} from './trust-club-action-outcome-consistency.policy';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.6
 * Action Outcome Creation Orchestration Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * coordinate Phase 4.5 outcome-consistency evaluation with
 * Phase 4.4 Action Outcome construction.
 *
 * Phase 4.6 reuses:
 *
 * - Phase 4.5 Action Outcome Consistency Policy;
 * - Phase 4.4 Action Outcome Domain Model.
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

export interface TrustClubActionOutcomeCreationOrchestrationInput {
  outcome:
    TrustClubActionOutcomeCreationInput;
}

export interface TrustClubActionOutcomeCreationOrchestrationResult {
  consistency:
    TrustClubActionOutcomeConsistencyDecision;

  outcome:
    TrustClubActionOutcome | null;
}

/**
 * Consistency-authority rule.
 *
 * Phase 4.5 remains the sole authority used by this
 * orchestration for deciding whether the supplied Action
 * status and outcome type are consistent.
 */
export const TRUST_CLUB_ACTION_OUTCOME_CREATION_CONSISTENCY_RULE =
  'OUTCOME_CREATION_USES_PHASE_4_5_CONSISTENCY_AUTHORITY' as const;

/**
 * Construction-authority rule.
 *
 * Phase 4.4 remains the Action Outcome construction authority.
 */
export const TRUST_CLUB_ACTION_OUTCOME_CREATION_CONSTRUCTION_RULE =
  'OUTCOME_CREATION_USES_PHASE_4_4_OUTCOME_CONSTRUCTION' as const;

/**
 * Denial rule.
 *
 * An inconsistent status / outcome combination must not
 * produce an Action Outcome.
 */
export const TRUST_CLUB_ACTION_OUTCOME_CREATION_DENIAL_RULE =
  'INCONSISTENT_OUTCOME_IS_NOT_CREATED' as const;

/**
 * Persistence boundary.
 *
 * A successfully constructed outcome remains a domain
 * representation only and does not prove persistence.
 */
export const TRUST_CLUB_ACTION_OUTCOME_CREATION_PERSISTENCE_RULE =
  'CREATED_ACTION_OUTCOME_IS_NOT_PERSISTENCE' as const;

/**
 * External-completion boundary.
 *
 * Construction of an Action Outcome does not prove completion
 * of an external service, payment, banking process or other
 * external action.
 */
export const TRUST_CLUB_ACTION_OUTCOME_CREATION_EXTERNAL_RULE =
  'CREATED_ACTION_OUTCOME_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;