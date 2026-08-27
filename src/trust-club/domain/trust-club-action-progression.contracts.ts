import type {
  TrustClubActionRecord,
} from './trust-club-action-record.contracts';

import type {
  TrustClubActionStatus,
} from './trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.3
 * Action Progression Orchestration Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * request lifecycle advancement of an existing Trust Club
 * Action record.
 *
 * Phase 4.3 reuses:
 *
 * - Phase 4.0 Action Workflow / Lifecycle Transition Policy;
 * - Phase 4.1 Action Record Domain Model.
 *
 * It does NOT:
 * - create a new Action lifecycle vocabulary;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - persist Action records;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - prove external completion.
 */

export interface TrustClubActionProgressionInput {
  record:
    TrustClubActionRecord;

  requestedStatus:
    TrustClubActionStatus;

  requestedTrustId?:
    string;

  updatedAt:
    string;
}

export interface TrustClubActionProgressionResult {
  previousRecord:
    TrustClubActionRecord;

  progressedRecord:
    TrustClubActionRecord;
}

/**
 * Workflow-authority rule.
 *
 * Phase 4.0 remains the sole authority for deciding whether
 * the requested lifecycle transition is permitted.
 */
export const TRUST_CLUB_ACTION_PROGRESSION_WORKFLOW_RULE =
  'ACTION_PROGRESSION_USES_PHASE_4_0_WORKFLOW_AUTHORITY' as const;

/**
 * Record-transition rule.
 *
 * Phase 4.3 delegates controlled Action-record transformation
 * to the Phase 4.1 Action Record Domain Model.
 */
export const TRUST_CLUB_ACTION_PROGRESSION_RECORD_RULE =
  'ACTION_PROGRESSION_USES_PHASE_4_1_ACTION_RECORD_TRANSITION' as const;

/**
 * Authorization boundary.
 *
 * Progressing an Action lifecycle record does not itself
 * authorize the underlying Trust action.
 */
export const TRUST_CLUB_ACTION_PROGRESSION_AUTHORIZATION_RULE =
  'ACTION_PROGRESSION_IS_NOT_ACTION_AUTHORIZATION' as const;

/**
 * Persistence boundary.
 *
 * A progressed Action record is a domain representation only.
 * It does not prove persistence.
 */
export const TRUST_CLUB_ACTION_PROGRESSION_PERSISTENCE_RULE =
  'PROGRESSED_ACTION_RECORD_IS_NOT_PERSISTENCE' as const;

/**
 * External-completion boundary.
 *
 * INTERNAL_COMPLETE and EXTERNAL_PENDING remain internal
 * lifecycle states and do not prove completion of an external
 * service, payment, banking process or other external action.
 */
export const TRUST_CLUB_ACTION_PROGRESSION_EXTERNAL_RULE =
  'ACTION_PROGRESSION_DOES_NOT_PROVE_EXTERNAL_COMPLETION' as const;