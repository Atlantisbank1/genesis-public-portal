import {
  executeTrustClubServerApplicationEntry,
} from '../server/trust-club-server-application-entry.service';

import type {
  TrustClubServerApplicationEntryInput,
} from '../server/trust-club-server-application-entry.contracts';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

export interface SubmitStandardTrustFormationForReviewInput {
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

export interface SubmitStandardTrustFormationForReviewResult {
  actionId:
    string;

  previousActionStatus:
    'READY';

  actionStatus:
    'PENDING_REVIEW';

  persisted:
    boolean;
}

export async function submitStandardTrustFormationForReview(
  input:
    SubmitStandardTrustFormationForReviewInput,
): Promise<SubmitStandardTrustFormationForReviewResult> {
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
      'READY'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_READY_FOR_REVIEW',
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
          'PENDING_REVIEW',

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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_NOT_EXECUTED',
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_GATEWAY_TRANSITION_NOT_EXECUTED',
    );
  }

  const transition =
    gatewayExecution.value;

  if (
    transition.previousRecord.status !==
      'READY'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_PREVIOUS_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.status !==
      'PENDING_REVIEW'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_STATUS_INVALID',
    );
  }

  if (
    transition.progressedRecord.actionId !==
      input.actionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_ACTION_ID_MISMATCH',
    );
  }

  return {
    actionId:
      transition.progressedRecord.actionId,

    previousActionStatus:
      'READY',

    actionStatus:
      'PENDING_REVIEW',

    persisted:
      transition.persisted,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_TRANSITION_RULE =
  'STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_USES_CERTIFIED_TRANSITION_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_SOURCE_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_REQUIRES_READY' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_TARGET_STATUS_RULE =
  'STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_TARGETS_PENDING_REVIEW' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_AUTHORIZATION_RULE =
  'STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_USES_SERVER_APPLICATION_ENTRY_AUTHORIZATION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_REVIEW_DIRECT_PERSISTENCE_RULE =
  'STANDARD_TRUST_FORMATION_REVIEW_SUBMISSION_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;