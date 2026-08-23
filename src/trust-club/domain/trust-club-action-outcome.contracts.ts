import type {
  TrustClubActionStatus,
  TrustClubActionType,
} from './trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.4
 * Action Outcome Domain Model Contracts
 *
 * Purpose:
 * Defines the controlled domain representation of an outcome
 * associated with an existing Trust Club Action.
 *
 * An Action outcome is separate from the Action lifecycle
 * record defined in Phase 4.1.
 *
 * This file defines domain contracts only.
 *
 * It does NOT:
 * - modify the Phase 4.1 Action Record;
 * - define lifecycle-transition authority;
 * - authorize Trust actions;
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

export type TrustClubActionOutcomeType =
  | 'INTERNAL_COMPLETION'
  | 'EXTERNAL_PENDING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface TrustClubActionOutcome {
  actionId:
    string;

  actionType:
    TrustClubActionType;

  actionStatus:
    TrustClubActionStatus;

  outcomeType:
    TrustClubActionOutcomeType;

  recordedAt:
    string;

  outcomeCode?:
    string;

  outcomeReason?:
    string;

  externalReference?:
    string;
}

export interface TrustClubActionOutcomeCreationInput {
  actionId:
    string;

  actionType:
    TrustClubActionType;

  actionStatus:
    TrustClubActionStatus;

  outcomeType:
    TrustClubActionOutcomeType;

  recordedAt:
    string;

  outcomeCode?:
    string;

  outcomeReason?:
    string;

  externalReference?:
    string;
}

/**
 * Separation rule.
 *
 * Outcome information supplements an Action record and does
 * not replace the Action lifecycle state.
 */
export const TRUST_CLUB_ACTION_OUTCOME_SEPARATION_RULE =
  'ACTION_OUTCOME_DOES_NOT_REPLACE_ACTION_LIFECYCLE_STATE' as const;

/**
 * Workflow-authority rule.
 *
 * Recording an outcome does not determine or perform an Action
 * lifecycle transition.
 */
export const TRUST_CLUB_ACTION_OUTCOME_WORKFLOW_RULE =
  'ACTION_OUTCOME_IS_NOT_LIFECYCLE_TRANSITION_AUTHORITY' as const;

/**
 * Authorization boundary.
 *
 * Recording an Action outcome does not authorize the
 * underlying Trust action.
 */
export const TRUST_CLUB_ACTION_OUTCOME_AUTHORIZATION_RULE =
  'ACTION_OUTCOME_IS_NOT_ACTION_AUTHORIZATION' as const;

/**
 * Persistence boundary.
 *
 * An Action outcome is a domain representation only.
 */
export const TRUST_CLUB_ACTION_OUTCOME_PERSISTENCE_RULE =
  'ACTION_OUTCOME_IS_NOT_PERSISTENCE' as const;

/**
 * External-completion boundary.
 *
 * Internal lifecycle state or an internally recorded outcome
 * must not by itself be treated as proof that an external
 * service, payment, banking process or other external action
 * was completed.
 */
export const TRUST_CLUB_ACTION_OUTCOME_EXTERNAL_COMPLETION_RULE =
  'INTERNAL_ACTION_OUTCOME_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;