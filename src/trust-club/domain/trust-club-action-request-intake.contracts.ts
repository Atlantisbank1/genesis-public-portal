import type {
  TrustClubActionRecord,
  TrustClubActionRecordCreationInput,
} from './trust-club-action-record.contracts';

import type {
  TrustClubAuthorizationOrchestrationInput,
  TrustClubAuthorizationOrchestrationResult,
} from './trust-club-authorization-orchestration.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.2
 * Action Request Intake Orchestration Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * coordinate authorization evaluation with Action-record
 * construction.
 *
 * Phase 4.2 reuses:
 *
 * - Phase 3.9 Authorization Request Orchestration;
 * - Phase 4.1 Action Record Domain Model.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify identity;
 * - create Membership;
 * - create a Trust;
 * - establish Trust ownership;
 * - grant Trust roles;
 * - resolve entitlements;
 * - activate entitlements;
 * - persist Action records;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - bypass the Action Workflow Policy;
 * - convert authorization approval directly into
 *   AUTHORIZED Action status.
 */

export interface TrustClubActionRequestIntakeInput {
  authorization:
    TrustClubAuthorizationOrchestrationInput;

  actionRecord:
    TrustClubActionRecordCreationInput;
}

export interface TrustClubActionRequestIntakeResult {
  authorization:
    TrustClubAuthorizationOrchestrationResult;

  actionRecord:
    TrustClubActionRecord | null;
}

/**
 * Action identity consistency rule.
 *
 * The Action type presented for authorization must be the same
 * Action type used to construct the Action record.
 */
export const TRUST_CLUB_ACTION_REQUEST_TYPE_CONSISTENCY_RULE =
  'AUTHORIZED_ACTION_TYPE_MUST_MATCH_ACTION_RECORD_TYPE' as const;

/**
 * Authorization gate rule.
 *
 * A denied authorization decision must not produce an
 * Action record.
 */
export const TRUST_CLUB_ACTION_REQUEST_AUTHORIZATION_GATE_RULE =
  'DENIED_AUTHORIZATION_DOES_NOT_CREATE_ACTION_RECORD' as const;

/**
 * Initial lifecycle rule.
 *
 * Authorization approval permits controlled Action-record
 * construction only.
 *
 * It does not place the Action directly into AUTHORIZED status.
 * The Phase 4.1 initial-status rule remains authoritative.
 */
export const TRUST_CLUB_ACTION_REQUEST_INITIAL_STATUS_RULE =
  'AUTHORIZED_INTAKE_CREATES_DRAFT_ACTION_RECORD' as const;

/**
 * Persistence boundary.
 *
 * A successful intake result contains a domain Action record.
 * It does not prove persistence.
 */
export const TRUST_CLUB_ACTION_REQUEST_PERSISTENCE_RULE =
  'ACTION_REQUEST_INTAKE_RESULT_IS_NOT_PERSISTENCE' as const;

/**
 * Workflow boundary.
 *
 * Phase 4.2 does not replace or bypass the Phase 4.0
 * Action Workflow Policy.
 */
export const TRUST_CLUB_ACTION_REQUEST_WORKFLOW_RULE =
  'ACTION_REQUEST_INTAKE_DOES_NOT_REPLACE_ACTION_WORKFLOW_POLICY' as const;