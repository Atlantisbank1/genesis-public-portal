import {
  readTrustClubAction,
} from '@/trust-club/server/trust-club-action-read.operation';

import type {
  SaveTrustClubStandardTrustFormationInput,
  TrustClubStandardTrustFormation,
} from './trust-club-standard-trust-formation.contracts';

import {
  trustClubStandardTrustFormationPersistence,
} from './trust-club-standard-trust-formation.persistence';

export interface SaveStandardTrustFormationResult {
  formation:
    TrustClubStandardTrustFormation;

  actionId:
    string;

  actionType:
    'CREATE_STANDARD_TRUST';

  actionStatus:
    string;
}

export async function saveStandardTrustFormation(
  input:
    SaveTrustClubStandardTrustFormationInput,
): Promise<
  SaveStandardTrustFormationResult
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
      'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_EDITABLE',
    );
  }

  const formation =
    await trustClubStandardTrustFormationPersistence
      .save(
        input,
      );

  return {
    formation,

    actionId:
      action.actionId,

    actionType:
      'CREATE_STANDARD_TRUST',

    actionStatus:
      action.status,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_ACTION_RULE =
  'FORMATION_SAVE_REQUIRES_EXISTING_CREATE_STANDARD_TRUST_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_EDITABILITY_RULE =
  'FORMATION_SAVE_IS_ALLOWED_ONLY_WHILE_ACTION_IS_DRAFT' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_LIFECYCLE_BOUNDARY_RULE =
  'FORMATION_SAVE_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;