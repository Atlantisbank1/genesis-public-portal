import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

export interface StartStandardTrustFormationInput {
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
}

export interface StartStandardTrustFormationResult {
  actionId:
    string;

  previousActionStatus:
    'AUTHORIZED';

  actionStatus:
    'IN_PROGRESS';

  persisted:
    boolean;
}

export async function startStandardTrustFormation(
  input:
    StartStandardTrustFormationInput,
): Promise<StartStandardTrustFormationResult> {
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
      'AUTHORIZED'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_AUTHORIZED_FOR_START',
    );
  }

  const execution =
    await executeTrustClubServerApplicationEntry({
      ...input.applicationEntry,

      operation:
        'TRANSITION_ACTION',

      input: {
        actionId:
          input.actionId,

        requestedStatus:
          'IN_PROGRESS',

        updatedAt:
          input.updatedAt,
      },
    });

  if (
    execution.status !==
      'EXECUTED' ||
    execution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_NOT_EXECUTED',
    );
  }

  const gatewayExecution =
    execution.value;

  if (
    gatewayExecution.status !==
      'EXECUTED' ||
    gatewayExecution.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    gatewayExecution.value;

  if (
    transition.previousRecord.status !==
      'AUTHORIZED'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      'IN_PROGRESS'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_START_ACTION_ID_MISMATCH',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    previousActionStatus:
      'AUTHORIZED',

    actionStatus:
      'IN_PROGRESS',

    persisted:
      transition.persisted,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_START_TRANSITION_RULE =
  'STANDARD_TRUST_FORMATION_START_USES_CERTIFIED_TRANSITION_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_START_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_START_REQUIRES_AUTHORIZED' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_START_TARGET_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_START_TARGETS_IN_PROGRESS' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_START_AUTHORIZATION_RULE =
  'STANDARD_TRUST_FORMATION_START_USES_SERVER_APPLICATION_ENTRY_AUTHORIZATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_START_DIRECT_PERSISTENCE_RULE =
  'STANDARD_TRUST_FORMATION_START_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;