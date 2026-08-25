import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

export interface MarkStandardTrustFormationExternalPendingInput {
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

export interface MarkStandardTrustFormationExternalPendingResult {
  actionId:
    string;

  previousActionStatus:
    'INTERNAL_COMPLETE';

  actionStatus:
    'EXTERNAL_PENDING';

  outcomeType:
    'EXTERNAL_PENDING';

  transitionPersisted:
    boolean;

  outcomePersisted:
    boolean;
}

export async function markStandardTrustFormationExternalPending(
  input:
    MarkStandardTrustFormationExternalPendingInput,
): Promise<MarkStandardTrustFormationExternalPendingResult> {
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
      'INTERNAL_COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_INTERNAL_COMPLETE_FOR_EXTERNAL_PENDING',
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
          'EXTERNAL_PENDING',

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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_TRANSITION_NOT_EXECUTED',
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    transitionGatewayExecution.value;

  if (
    transition.previousRecord.status !==
      'INTERNAL_COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      'EXTERNAL_PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_ACTION_ID_MISMATCH',
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
            input.actionId,

          actionType:
            'CREATE_STANDARD_TRUST',

          actionStatus:
            'EXTERNAL_PENDING',

          outcomeType:
            'EXTERNAL_PENDING',

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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_NOT_EXECUTED',
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_GATEWAY_OUTCOME_NOT_EXECUTED',
    );
  }

  const outcomeResult =
    outcomeGatewayExecution.value;

  if (
    outcomeResult.creation.outcome ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_NOT_CREATED',
    );
  }

  if (
    outcomeResult.creation.outcome.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_ACTION_ID_MISMATCH',
    );
  }

  if (
    outcomeResult.creation.outcome.actionStatus !==
      'EXTERNAL_PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_STATUS_INVALID',
    );
  }

  if (
    outcomeResult.creation.outcome.outcomeType !==
      'EXTERNAL_PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_TYPE_INVALID',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    previousActionStatus:
      'INTERNAL_COMPLETE',

    actionStatus:
      'EXTERNAL_PENDING',

    outcomeType:
      'EXTERNAL_PENDING',

    transitionPersisted:
      transition.persisted,

    outcomePersisted:
      outcomeResult.persisted,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_TRANSITION_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_USES_CERTIFIED_TRANSITION_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_REQUIRES_INTERNAL_COMPLETE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_TARGET_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_TARGETS_EXTERNAL_PENDING' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_OUTCOME_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_RECORDS_EXTERNAL_PENDING_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_AUTHORIZATION_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_USES_SERVER_APPLICATION_ENTRY_AUTHORIZATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_DIRECT_PERSISTENCE_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_EXTERNAL_EXECUTION_RULE =
  'STANDARD_TRUST_FORMATION_EXTERNAL_PENDING_DOES_NOT_PROVE_OR_EXECUTE_EXTERNAL_COMPLETION' as const;