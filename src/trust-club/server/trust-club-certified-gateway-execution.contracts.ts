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

import type {
  TrustClubControlledOperationExecutionPreparationResult,
} from './trust-club-controlled-operation-execution.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.23
 *
 * Controlled Certified Gateway Execution Contracts
 *
 * Purpose:
 *
 * Defines the typed boundary for executing one certified
 * Trust Club Server Application Gateway operation after the
 * Phase 5.22 controlled execution preparation boundary has
 * established EXECUTION_READY.
 *
 * This contract does NOT:
 * - authenticate users;
 * - resolve Authentication Context;
 * - assemble Authorization Context;
 * - authorize Trust actions;
 * - create delegation authority;
 * - replace Phase 5.22 execution preparation;
 * - access Prisma;
 * - access repositories;
 * - create public application exposure;
 * - modify the certified Application Gateway;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - establish external completion.
 */

export type TrustClubCertifiedGatewayOperation =
  | 'CREATE_ACTION'
  | 'READ_ACTION'
  | 'TRANSITION_ACTION'
  | 'RECORD_OUTCOME'
  | 'READ_OUTCOMES'
  | 'READ_ACTION_AGGREGATE';

interface TrustClubCertifiedGatewayExecutionInputBase {
  preparation:
    TrustClubControlledOperationExecutionPreparationResult;
}

export interface TrustClubCertifiedGatewayCreateActionExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'CREATE_ACTION';

  input:
    TrustClubActionRequestIntakeInput;
}

export interface TrustClubCertifiedGatewayReadActionExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'READ_ACTION';

  input:
    ReadTrustClubActionInput;
}

export interface TrustClubCertifiedGatewayTransitionActionExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'TRANSITION_ACTION';

  input:
    TransitionTrustClubActionInput;
}

export interface TrustClubCertifiedGatewayRecordOutcomeExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'RECORD_OUTCOME';

  input:
    RecordTrustClubActionOutcomeInput;
}

export interface TrustClubCertifiedGatewayReadOutcomesExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'READ_OUTCOMES';

  input:
    ReadTrustClubActionOutcomesInput;
}

export interface TrustClubCertifiedGatewayReadActionAggregateExecutionInput
  extends TrustClubCertifiedGatewayExecutionInputBase {
  operation:
    'READ_ACTION_AGGREGATE';

  input:
    ReadTrustClubActionAggregateInput;
}

export type TrustClubCertifiedGatewayExecutionInput =
  | TrustClubCertifiedGatewayCreateActionExecutionInput
  | TrustClubCertifiedGatewayReadActionExecutionInput
  | TrustClubCertifiedGatewayTransitionActionExecutionInput
  | TrustClubCertifiedGatewayRecordOutcomeExecutionInput
  | TrustClubCertifiedGatewayReadOutcomesExecutionInput
  | TrustClubCertifiedGatewayReadActionAggregateExecutionInput;

export interface TrustClubCertifiedGatewayExecutionRejectedResult {
  status:
    'EXECUTION_NOT_READY';

  operation:
    TrustClubCertifiedGatewayOperation;

  value:
    null;
}

export interface TrustClubCertifiedGatewayCreateActionExecutedResult {
  status:
    'EXECUTED';

  operation:
    'CREATE_ACTION';

  value:
    CreateTrustClubActionResult;
}

export interface TrustClubCertifiedGatewayReadActionExecutedResult {
  status:
    'EXECUTED';

  operation:
    'READ_ACTION';

  value:
    TrustClubActionRecord | null;
}

export interface TrustClubCertifiedGatewayTransitionActionExecutedResult {
  status:
    'EXECUTED';

  operation:
    'TRANSITION_ACTION';

  value:
    TransitionTrustClubActionResult;
}

export interface TrustClubCertifiedGatewayRecordOutcomeExecutedResult {
  status:
    'EXECUTED';

  operation:
    'RECORD_OUTCOME';

  value:
    RecordTrustClubActionOutcomeResult;
}

export interface TrustClubCertifiedGatewayReadOutcomesExecutedResult {
  status:
    'EXECUTED';

  operation:
    'READ_OUTCOMES';

  value:
    readonly TrustClubActionOutcome[];
}

export interface TrustClubCertifiedGatewayReadActionAggregateExecutedResult {
  status:
    'EXECUTED';

  operation:
    'READ_ACTION_AGGREGATE';

  value:
    TrustClubActionAggregate | null;
}

export type TrustClubCertifiedGatewayExecutionExecutedResult =
  | TrustClubCertifiedGatewayCreateActionExecutedResult
  | TrustClubCertifiedGatewayReadActionExecutedResult
  | TrustClubCertifiedGatewayTransitionActionExecutedResult
  | TrustClubCertifiedGatewayRecordOutcomeExecutedResult
  | TrustClubCertifiedGatewayReadOutcomesExecutedResult
  | TrustClubCertifiedGatewayReadActionAggregateExecutedResult;

export type TrustClubCertifiedGatewayExecutionResult =
  | TrustClubCertifiedGatewayExecutionRejectedResult
  | TrustClubCertifiedGatewayExecutionExecutedResult;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_PREPARATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_REQUIRES_EXECUTION_READY_PREPARATION' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_OPERATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_REQUIRES_OPERATION_IDENTIFIER_MATCH' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_DISPATCH_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_DISPATCHES_ONLY_TO_CERTIFIED_APPLICATION_GATEWAY' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_AUTHORIZATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_DOES_NOT_CREATE_AUTHORIZATION_AUTHORITY' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_PERSISTENCE_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_CONTRACT_EXPOSURE_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;