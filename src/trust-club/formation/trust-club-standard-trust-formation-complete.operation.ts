import {
  allocateTrustClubTrustId,
} from '../domain/trust-club-trust-identity.service';

import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

import {
  verifyStandardTrustExternalCompletion,
} from './trust-club-standard-trust-external-completion-verification.service';

export interface CompleteStandardTrustFormationInput {
  applicationEntry:
    Omit<
      TrustClubServerApplicationEntryInput,
      'operation' |
      'input'
    >;

  actionId:
    string;

  externalReference:
    string;

  completedAt:
    string;

  verifiedAt:
    string;

  updatedAt:
    string;

  recordedAt:
    string;
}

export interface CompleteStandardTrustFormationResult {
  actionId:
    string;

  trustId:
    string;

  previousActionStatus:
    'EXTERNAL_PENDING';

  actionStatus:
    'COMPLETE';

  outcomeType:
    'COMPLETED';

  externalReference:
    string;

  verifiedByUserId:
    string;

  transitionPersisted:
    boolean;

  outcomePersisted:
    boolean;
}

export async function completeStandardTrustFormation(
  input:
    CompleteStandardTrustFormationInput,
): Promise<CompleteStandardTrustFormationResult> {
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
      'EXTERNAL_PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_EXTERNAL_PENDING_FOR_COMPLETION',
    );
  }

  if (
    action.trustId !==
      undefined
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_TRUST_ID_ALREADY_ASSIGNED',
    );
  }

  const verification =
    await verifyStandardTrustExternalCompletion({
      authenticationSource:
        input.applicationEntry.authenticationSource,

      verification: {
        actionId:
          input.actionId,

        evidence: {
          externalReference:
            input.externalReference,

          completedAt:
            input.completedAt,
        },
      },

      verifiedAt:
        input.verifiedAt,
    });

  if (
    verification.status !==
      'VERIFIED'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_EXTERNAL_COMPLETION_NOT_VERIFIED',
    );
  }

  if (
    verification.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_VERIFICATION_ACTION_ID_MISMATCH',
    );
  }

  const trustId =
    allocateTrustClubTrustId();

  const transitionExecution =
    await executeTrustClubServerApplicationEntry({
      ...input.applicationEntry,

      operation:
        'TRANSITION_ACTION',

      input: {
        actionId:
          input.actionId,

        requestedStatus:
          'COMPLETE',

        requestedTrustId:
          trustId,

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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRANSITION_NOT_EXECUTED',
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    transitionGatewayExecution.value;

  if (
    transition.previousRecord.status !==
      'EXTERNAL_PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      'COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_ACTION_ID_MISMATCH',
    );
  }

  if (
    transition.progressedRecord.trustId !==
      trustId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRUST_ID_MISMATCH',
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
            'COMPLETE',

          outcomeType:
            'COMPLETED',

          recordedAt:
            input.recordedAt,

          externalReference:
            verification.externalReference,
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_NOT_EXECUTED',
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_GATEWAY_OUTCOME_NOT_EXECUTED',
    );
  }

  const outcomeResult =
    outcomeGatewayExecution.value;

  if (
    outcomeResult.creation.outcome ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_NOT_CREATED',
    );
  }

  if (
    outcomeResult.creation.outcome.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_ACTION_ID_MISMATCH',
    );
  }

  if (
    outcomeResult.creation.outcome.actionStatus !==
      'COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_STATUS_INVALID',
    );
  }

  if (
    outcomeResult.creation.outcome.outcomeType !==
      'COMPLETED'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_TYPE_INVALID',
    );
  }

  if (
    outcomeResult.creation.outcome.externalReference !==
      verification.externalReference
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_EXTERNAL_REFERENCE_MISMATCH',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    trustId,

    previousActionStatus:
      'EXTERNAL_PENDING',

    actionStatus:
      'COMPLETE',

    outcomeType:
      'COMPLETED',

    externalReference:
      verification.externalReference,

    verifiedByUserId:
      verification.verifiedByUserId,

    transitionPersisted:
      transition.persisted,

    outcomePersisted:
      outcomeResult.persisted,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_REQUIRES_EXTERNAL_PENDING' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_VERIFICATION_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_REQUIRES_CERTIFIED_EXTERNAL_COMPLETION_VERIFICATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRANSITION_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_USES_CERTIFIED_TRANSITION_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TARGET_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_TARGETS_COMPLETE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_OUTCOME_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_RECORDS_COMPLETED_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_EXTERNAL_REFERENCE_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_PRESERVES_VERIFIED_EXTERNAL_REFERENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_AUTHORITY_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_USES_VERIFIED_TRUST_CLUB_ADMIN_AUTHORITY' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_DIRECT_PERSISTENCE_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_EXTERNAL_EXECUTION_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_DOES_NOT_EXECUTE_EXTERNAL_SERVICE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRUST_ID_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_ALLOCATES_CANONICAL_TRUST_ID_ONLY_AFTER_VERIFIED_EXTERNAL_COMPLETION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_COMPLETION_TRUST_ID_REASSIGNMENT_RULE =
  'STANDARD_TRUST_FORMATION_COMPLETION_PROHIBITS_EXISTING_TRUST_ID_REASSIGNMENT' as const;