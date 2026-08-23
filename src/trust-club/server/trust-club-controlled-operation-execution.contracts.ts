import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../domain/trust-club-action-outcome.contracts';

import type {
  TrustClubActionRequestIntakeInput,
} from '../domain/trust-club-action-request-intake.contracts';

import type {
  TrustClubAuthorizedOperationDelegationResult,
} from './trust-club-authorized-operation-delegation.contracts';

import type {
  CreateTrustClubActionResult,
} from './trust-club-action-create.operation';

import type {
  ReadTrustClubActionInput,
} from './trust-club-action-read.operation';

import type {
  TransitionTrustClubActionInput,
  TransitionTrustClubActionResult,
} from './trust-club-action-transition.operation';

import type {
  RecordTrustClubActionOutcomeInput,
  RecordTrustClubActionOutcomeResult,
} from './trust-club-action-outcome-record.operation';

import type {
  ReadTrustClubActionOutcomesInput,
} from './trust-club-action-outcome-read.operation';

import type {
  ReadTrustClubActionAggregateInput,
  TrustClubActionAggregate,
} from './trust-club-action-aggregate-read.operation';

/**
 * TRUST-CLUB-V1
 * PHASE 5.22
 *
 * Controlled Authorized Operation Execution Contracts
 *
 * Purpose:
 *
 * Defines the typed execution boundary between a Phase 5.21
 * authorized-operation delegation result and the six certified
 * Trust Club Server Application Gateway operations.
 *
 * This contract does NOT:
 * - authenticate users;
 * - verify identity;
 * - assemble Authentication Context;
 * - assemble Authorization Context;
 * - authorize Trust actions;
 * - replace authorization orchestration;
 * - duplicate the CREATE_ACTION authorization gate;
 * - redefine Action lifecycle authority;
 * - execute Application Gateway operations;
 * - access persistence;
 * - access Prisma;
 * - access repositories;
 * - modify certified Gateway operations;
 * - create public application exposure;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - establish external completion.
 */

export type TrustClubControlledOperationExecutionStatus =
  | 'DELEGATION_NOT_READY'
  | 'EXECUTION_READY';

export interface TrustClubControlledCreateActionExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'CREATE_ACTION';

  input:
    TrustClubActionRequestIntakeInput;
}

export interface TrustClubControlledReadActionExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'READ_ACTION';

  input:
    ReadTrustClubActionInput;
}

export interface TrustClubControlledTransitionActionExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'TRANSITION_ACTION';

  input:
    TransitionTrustClubActionInput;
}

export interface TrustClubControlledRecordOutcomeExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'RECORD_OUTCOME';

  input:
    RecordTrustClubActionOutcomeInput;
}

export interface TrustClubControlledReadOutcomesExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'READ_OUTCOMES';

  input:
    ReadTrustClubActionOutcomesInput;
}

export interface TrustClubControlledReadActionAggregateExecutionInput {
  delegation:
    TrustClubAuthorizedOperationDelegationResult;

  operation:
    'READ_ACTION_AGGREGATE';

  input:
    ReadTrustClubActionAggregateInput;
}

export type TrustClubControlledOperationExecutionInput =
  | TrustClubControlledCreateActionExecutionInput
  | TrustClubControlledReadActionExecutionInput
  | TrustClubControlledTransitionActionExecutionInput
  | TrustClubControlledRecordOutcomeExecutionInput
  | TrustClubControlledReadOutcomesExecutionInput
  | TrustClubControlledReadActionAggregateExecutionInput;

export type TrustClubControlledOperationExecutionValue =
  | CreateTrustClubActionResult
  | TrustClubActionRecord
  | TransitionTrustClubActionResult
  | RecordTrustClubActionOutcomeResult
  | readonly TrustClubActionOutcome[]
  | TrustClubActionAggregate
  | null;

export interface TrustClubControlledOperationExecutionRejectedResult {
  status:
    'DELEGATION_NOT_READY';

  operation:
    TrustClubControlledOperationExecutionInput['operation'];

  value:
    null;
}

export interface TrustClubControlledOperationExecutionReadyResult {
  status:
    'EXECUTION_READY';

  operation:
    TrustClubControlledOperationExecutionInput['operation'];
}

export type TrustClubControlledOperationExecutionPreparationResult =
  | TrustClubControlledOperationExecutionRejectedResult
  | TrustClubControlledOperationExecutionReadyResult;

/**
 * Delegation precondition.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_DELEGATION_RULE =
  'CONTROLLED_EXECUTION_REQUIRES_DELEGATION_READY' as const;

/**
 * Operation identity boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_OPERATION_RULE =
  'CONTROLLED_EXECUTION_REQUIRES_OPERATION_IDENTIFIER_MATCH' as const;

/**
 * Authorization authority boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_AUTHORIZATION_RULE =
  'CONTROLLED_EXECUTION_DOES_NOT_CREATE_NEW_AUTHORIZATION_AUTHORITY' as const;

/**
 * CREATE_ACTION authority boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_CREATE_RULE =
  'CONTROLLED_EXECUTION_PRESERVES_CREATE_ACTION_CERTIFIED_AUTHORIZATION_GATE' as const;

/**
 * Lifecycle authority boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_TRANSITION_RULE =
  'CONTROLLED_EXECUTION_DOES_NOT_REDEFINE_ACTION_LIFECYCLE_AUTHORITY' as const;

/**
 * Gateway boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_GATEWAY_RULE =
  'CONTROLLED_EXECUTION_DELEGATES_ONLY_TO_CERTIFIED_APPLICATION_GATEWAY_OPERATIONS' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_PERSISTENCE_RULE =
  'CONTROLLED_EXECUTION_DOES_NOT_ACCESS_PERSISTENCE_DIRECTLY' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_EXPOSURE_RULE =
  'CONTROLLED_EXECUTION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;

/**
 * External-completion boundary.
 */
export const TRUST_CLUB_CONTROLLED_OPERATION_EXECUTION_EXTERNAL_COMPLETION_RULE =
  'CONTROLLED_EXECUTION_DOES_NOT_ESTABLISH_EXTERNAL_COMPLETION' as const;