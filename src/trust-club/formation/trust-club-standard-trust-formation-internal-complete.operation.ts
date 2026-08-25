import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

export interface CompleteStandardTrustFormationInternallyInput {
  applicationEntry:
    Omit<
      TrustClubServerApplicationEntryInput,
      'operation' |
      'input'
    >;

  actionId:
    string;

  updatedAt:
    string;

  recordedAt:
    string;
}

export interface CompleteStandardTrustFormationInternallyResult {
  actionId:
    string;

  previousActionStatus:
    'IN_PROGRESS';

  actionStatus:
    'INTERNAL_COMPLETE';

  outcomeType:
    'INTERNAL_COMPLETION';

  transitionPersisted:
    boolean;

  outcomePersisted:
    boolean;
}

export async function completeStandardTrustFormationInternally(
  input:
    CompleteStandardTrustFormationInternallyInput,
): Promise<CompleteStandardTrustFormationInternallyResult> {
  const action =
    await readTrustClubAction({
      actionId:
        input.actionId,
    });

  if (
    action ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_NOT_FOUND',
    );
  }

  if (
    action.actionType !==
      'CREATE_STANDARD_TRUST'
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_NOT_STANDARD_TRUST_FORMATION',
    );
  }

  if (
    action.status !==
      'IN_PROGRESS'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_IN_PROGRESS_FOR_INTERNAL_COMPLETION',
    );
  }

  const transitionExecution =
    await executeTrustClubServerApplicationEntry({
      ...input.applicationEntry,

      operation:
        'TRANSITION_ACTION',

      input: {
        actionId:
          input.actionId,

        requestedStatus:
          'INTERNAL_COMPLETE',

        updatedAt:
          input.updatedAt,
      },
    });

  if (
    transitionExecution.status !==
      'EXECUTED' ||
    transitionExecution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_TRANSITION_NOT_EXECUTED',
    );
  }

  const transitionGatewayExecution =
    transitionExecution.value;

  if (
    transitionGatewayExecution.status !==
      'EXECUTED' ||
    transitionGatewayExecution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    transitionGatewayExecution.value;

  if (
    transition.previousRecord.status !==
      'IN_PROGRESS'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      'INTERNAL_COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_ACTION_ID_MISMATCH',
    );
  }

  const outcomeExecution =
    await executeTrustClubServerApplicationEntry({
      ...input.applicationEntry,

      operation:
        'RECORD_OUTCOME',

      input: {
        outcome: {
          actionId:
            transition.progressedRecord.actionId,

          actionType:
            transition.progressedRecord.actionType,

          actionStatus:
            transition.progressedRecord.status,

          outcomeType:
            'INTERNAL_COMPLETION',

          recordedAt:
            input.recordedAt,
        },
      },
    });

  if (
    outcomeExecution.status !==
      'EXECUTED' ||
    outcomeExecution.operation !==
      'RECORD_OUTCOME'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_NOT_EXECUTED',
    );
  }

  const outcomeGatewayExecution =
    outcomeExecution.value;

  if (
    outcomeGatewayExecution.status !==
      'EXECUTED' ||
    outcomeGatewayExecution.operation !==
      'RECORD_OUTCOME'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_GATEWAY_OUTCOME_NOT_EXECUTED',
    );
  }

  const outcomeResult =
    outcomeGatewayExecution.value;

  if (
    outcomeResult.creation.outcome ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_NOT_CREATED',
    );
  }

  if (
    outcomeResult.creation.outcome.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_ACTION_ID_MISMATCH',
    );
  }

  if (
    outcomeResult.creation.outcome.actionStatus !==
      'INTERNAL_COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_STATUS_INVALID',
    );
  }

  if (
    outcomeResult.creation.outcome.outcomeType !==
      'INTERNAL_COMPLETION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_TYPE_INVALID',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    previousActionStatus:
      'IN_PROGRESS',

    actionStatus:
      'INTERNAL_COMPLETE',

    outcomeType:
      'INTERNAL_COMPLETION',

    transitionPersisted:
      transition.persisted,

    outcomePersisted:
      outcomeResult.persisted,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_TRANSITION_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_USES_CERTIFIED_TRANSITION_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_USES_CERTIFIED_RECORD_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_REQUIRES_IN_PROGRESS' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_TARGET_STATUS_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_TARGETS_INTERNAL_COMPLETE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_OUTCOME_TYPE_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_RECORDS_INTERNAL_COMPLETION_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_AUTHORIZATION_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_USES_SERVER_APPLICATION_ENTRY_AUTHORIZATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_DIRECT_PERSISTENCE_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_INTERNAL_COMPLETION_EXTERNAL_RULE =
  'STANDARD_TRUST_INTERNAL_COMPLETION_IS_NOT_EXTERNAL_COMPLETION' as const;