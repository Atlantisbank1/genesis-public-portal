import type {
  TrustClubActionStatus,
  TrustClubActionType,
} from './trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.0
 * Action Workflow / Lifecycle Transition Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * evaluate Trust Club Action lifecycle transitions.
 *
 * Phase 4.0 reuses the existing TrustClubActionStatus vocabulary.
 *
 * It does NOT:
 * - create a new Action status vocabulary;
 * - persist Action state;
 * - mutate a database;
 * - access Prisma;
 * - access Atlantis;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - execute payments;
 * - execute banking activity;
 * - execute external services.
 */

export interface TrustClubActionTransitionRequest {
  actionType:
    TrustClubActionType;

  currentStatus:
    TrustClubActionStatus;

  requestedStatus:
    TrustClubActionStatus;
}

export interface TrustClubActionTransitionDecision {
  allowed:
    boolean;

  currentStatus:
    TrustClubActionStatus;

  requestedStatus:
    TrustClubActionStatus;

  reason:
    | 'ALLOWED'
    | 'SAME_STATUS'
    | 'TERMINAL_STATUS'
    | 'TRANSITION_NOT_ALLOWED';
}

/**
 * Lifecycle vocabulary rule.
 *
 * Phase 4.0 uses the existing TrustClubActionStatus definition
 * as the sole Action lifecycle vocabulary.
 */
export const TRUST_CLUB_ACTION_STATUS_SOURCE_RULE =
  'ACTION_WORKFLOW_USES_EXISTING_TRUST_CLUB_ACTION_STATUS_VOCABULARY' as const;

/**
 * Persistence boundary.
 *
 * A transition decision does not itself persist or mutate
 * Action state.
 */
export const TRUST_CLUB_ACTION_TRANSITION_PERSISTENCE_RULE =
  'ACTION_TRANSITION_DECISION_IS_NOT_STATE_PERSISTENCE' as const;

/**
 * Authorization boundary.
 *
 * An allowed lifecycle transition does not itself authorize
 * the underlying Trust action.
 */
export const TRUST_CLUB_ACTION_TRANSITION_AUTHORIZATION_RULE =
  'ACTION_TRANSITION_ALLOWED_IS_NOT_ACTION_AUTHORIZATION' as const;

/**
 * External-completion boundary.
 *
 * Reaching INTERNAL_COMPLETE or EXTERNAL_PENDING does not prove
 * completion of any external process.
 */
export const TRUST_CLUB_ACTION_EXTERNAL_COMPLETION_RULE =
  'ACTION_INTERNAL_STATUS_IS_NOT_EXTERNAL_COMPLETION' as const;