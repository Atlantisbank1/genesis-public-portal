import {
  readTrustClubAction,
} from '@/trust-club/server/trust-club-action-read.operation';

import type {
  TrustClubStandardTrustFormation,
} from './trust-club-standard-trust-formation.contracts';

import {
  trustClubStandardTrustFormationPersistence,
} from './trust-club-standard-trust-formation.persistence';

export interface ReadStandardTrustFormationInput {
  actionId:
    string;
}

export interface ReadStandardTrustFormationResult {
  actionId:
    string;

  actionType:
    'CREATE_STANDARD_TRUST';

  actionStatus:
    string;

  formation:
    TrustClubStandardTrustFormation |
    null;
}

export async function readStandardTrustFormation(
  input:
    ReadStandardTrustFormationInput,
): Promise<
  ReadStandardTrustFormationResult
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

  const formation =
    await trustClubStandardTrustFormationPersistence
      .findByActionId(
        action.actionId,
      );

  return {
    actionId:
      action.actionId,

    actionType:
      'CREATE_STANDARD_TRUST',

    actionStatus:
      action.status,

    formation,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READ_ACTION_RULE =
  'FORMATION_READ_REQUIRES_EXISTING_CREATE_STANDARD_TRUST_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READ_LIFECYCLE_RULE =
  'FORMATION_READ_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;