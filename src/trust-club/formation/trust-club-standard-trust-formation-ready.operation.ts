import {
  readTrustClubAction,
} from '@/trust-club/server/trust-club-action-read.operation';

import {
  executeTrustClubServerApplicationEntry,
} from '@/trust-club/server/trust-club-server-application-entry.service';

import type {
  TrustClubEstablishedAuthorizationDomainState,
  TrustClubServerApplicationEntryAuthenticationSource,
} from '@/trust-club/server/trust-club-server-application-entry.contracts';

import type {
  TrustClubStandardTrustFormation,
} from './trust-club-standard-trust-formation.contracts';

import {
  trustClubStandardTrustFormationPersistence,
} from './trust-club-standard-trust-formation.persistence';

import {
  evaluateStandardTrustFormationReadiness,
} from './trust-club-standard-trust-formation-readiness.policy';

import type {
  TrustClubStandardTrustFormationReadinessReadyResult,
} from './trust-club-standard-trust-formation-readiness.policy';

export interface ReadyStandardTrustFormationInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  authorizationDomainState:
    TrustClubEstablishedAuthorizationDomainState;

  actionId:
    string;

  updatedAt:
    string;
}

export interface ReadyStandardTrustFormationResult {
  actionId:
    string;

  formation:
    TrustClubStandardTrustFormation;

  readiness:
    TrustClubStandardTrustFormationReadinessReadyResult;

  previousActionStatus:
    'DRAFT';

  actionStatus:
    'READY';

  persisted:
    true;
}

export async function readyStandardTrustFormation(
  input:
    ReadyStandardTrustFormationInput,
): Promise<
  ReadyStandardTrustFormationResult
> {
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
      'DRAFT'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_DRAFT',
    );
  }

  const formation =
    await trustClubStandardTrustFormationPersistence
      .findByActionId(
        input.actionId,
      );

  if (
    formation ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_FOUND',
    );
  }

  const readiness =
    evaluateStandardTrustFormationReadiness(
      formation,
    );

  if (
    readiness.ready !==
      true
  ) {
    throw new Error(
      `TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_READY:${readiness.missingFields.join(',')}`,
    );
  }

  const transition =
    await executeTrustClubServerApplicationEntry({
      authenticationSource:
        input.authenticationSource,

      authorizationDomainState:
        input.authorizationDomainState,

      operation:
        'TRANSITION_ACTION',

      input: {
        actionId:
          input.actionId,

        requestedStatus:
          'READY',

        updatedAt:
          input.updatedAt,
      },
    });

  if (
    transition.status !==
      'EXECUTED'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_TRANSITION_NOT_EXECUTED',
    );
  }

  if (
    transition.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_OPERATION_MISMATCH',
    );
  }

  if (
    transition.value ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_EXECUTION_MISSING',
    );
  }

  if (
    transition.value.operation !==
      'TRANSITION_ACTION'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_CERTIFIED_OPERATION_MISMATCH',
    );
  }

  if (
    transition.value.value.persisted !==
      true
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_TRANSITION_NOT_PERSISTED',
    );
  }

  if (
    transition.value.value.previousRecord.status !==
      'DRAFT'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_PREVIOUS_STATUS_MISMATCH',
    );
  }

  if (
    transition.value.value.progressedRecord.status !==
      'READY'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_STATUS_NOT_REACHED',
    );
  }

  return {
    actionId:
      input.actionId,

    formation,

    readiness,

    previousActionStatus:
      'DRAFT',

    actionStatus:
      'READY',

    persisted:
      true,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_ACTION_RULE =
  'FORMATION_READY_REQUIRES_EXISTING_CREATE_STANDARD_TRUST_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_SOURCE_STATUS_RULE =
  'FORMATION_READY_REQUIRES_DRAFT_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_READINESS_RULE =
  'FORMATION_READY_REQUIRES_READINESS_POLICY_READY_RESULT' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_TRANSITION_RULE =
  'FORMATION_READY_USES_CERTIFIED_TRANSITION_ACTION_TO_READY' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_APPLICATION_ENTRY_RULE =
  'FORMATION_READY_USES_SERVER_APPLICATION_ENTRY_EXECUTION_CHAIN' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_PERSISTENCE_RULE =
  'FORMATION_READY_DOES_NOT_DIRECTLY_PERSIST_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READY_AUTHORIZATION_RULE =
  'FORMATION_READY_DOES_NOT_CREATE_AUTHORIZATION_AUTHORITY' as const;