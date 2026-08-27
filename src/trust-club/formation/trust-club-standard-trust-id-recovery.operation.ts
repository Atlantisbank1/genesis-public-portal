import {
  allocateTrustClubTrustId,
} from '../domain/trust-club-trust-identity.service';

import {
  authorizeTrustClubAdminReview,
} from '../server/trust-club-admin-review-authorization.service';

import {
  readTrustClubAction,
} from '../server/trust-club-action-read.operation';

import {
  readTrustClubActionOutcomes,
} from '../server/trust-club-action-outcome-read.operation';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from '../server/trust-club-server-application-entry.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 * PHASE 9.0
 *
 * Controlled Canonical Trust ID Recovery Operation
 *
 * Purpose:
 *
 * Repairs one narrowly defined historical runtime anomaly:
 *
 * - CREATE_STANDARD_TRUST Action already reached COMPLETE;
 * - canonical trustId was not persisted because completion was
 *   executed by a stale pre-Phase-9.0 runtime;
 * - the certified COMPLETED Outcome already exists;
 * - the verified external reference already exists;
 * - lifecycle completion itself MUST NOT be replayed.
 *
 * Recovery is permitted only when all certified historical
 * completion evidence remains intact.
 *
 * This operation:
 *
 * 1. requires authenticated persisted TRUST_CLUB_ADMIN authority;
 * 2. requires an existing CREATE_STANDARD_TRUST Action;
 * 3. requires status COMPLETE;
 * 4. requires trustId to be absent;
 * 5. requires exactly one INTERNAL_COMPLETION Outcome;
 * 6. requires exactly one EXTERNAL_PENDING Outcome;
 * 7. requires exactly one COMPLETED Outcome;
 * 8. requires a non-empty verified externalReference on the
 *    COMPLETED Outcome;
 * 9. allocates the canonical Trust ID using the existing
 *    certified Trust Identity allocation authority;
 * 10. persists the same COMPLETE Action record with only the
 *     missing canonical trustId and updatedAt changed.
 *
 * This operation does NOT:
 *
 * - transition Action lifecycle state;
 * - replay COMPLETE;
 * - create a new Action Outcome;
 * - replace the existing COMPLETED Outcome;
 * - modify the verified externalReference;
 * - execute or re-execute an external service;
 * - accept caller-supplied Trust IDs;
 * - reassign an existing Trust ID;
 * - access Prisma directly;
 * - access PostgreSQL directly;
 * - change Membership;
 * - grant or revoke System Roles;
 * - access Atlantis.
 */

export interface RecoverStandardTrustCanonicalTrustIdInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  actionId:
    string;

  recoveredAt:
    string;
}

export interface RecoverStandardTrustCanonicalTrustIdResult {
  actionId:
    string;

  trustId:
    string;

  actionStatus:
    'COMPLETE';

  externalReference:
    string;

  recoveredByUserId:
    string;

  persisted:
    true;
}

function normalizeRequiredString(
  value:
    string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

export async function recoverStandardTrustCanonicalTrustId(
  input:
    RecoverStandardTrustCanonicalTrustIdInput,
): Promise<RecoverStandardTrustCanonicalTrustIdResult> {
  const normalizedActionId =
    normalizeRequiredString(
      input.actionId,
    );

  if (
    normalizedActionId ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_ID_REQUIRED',
    );
  }

  const normalizedRecoveredAt =
    normalizeRequiredString(
      input.recoveredAt,
    );

  if (
    normalizedRecoveredAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_TIMESTAMP_REQUIRED',
    );
  }

  const adminAuthorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    throw new Error(
      adminAuthorization.status ===
        'UNAUTHENTICATED'
        ? 'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  const action =
    await readTrustClubAction({
      actionId:
        normalizedActionId,
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
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_TYPE_INVALID',
    );
  }

  if (
    action.status !==
      'COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REQUIRES_COMPLETE',
    );
  }

  if (
    action.trustId !==
      undefined
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_TRUST_ID_ALREADY_ASSIGNED',
    );
  }

  const outcomes =
    await readTrustClubActionOutcomes({
      actionId:
        normalizedActionId,
    });

  const internalCompletionOutcomes =
    outcomes.filter(
      (
        outcome,
      ) =>
        outcome.actionStatus ===
          'INTERNAL_COMPLETE' &&
        outcome.outcomeType ===
          'INTERNAL_COMPLETION',
    );

  if (
    internalCompletionOutcomes.length !==
      1
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_INTERNAL_COMPLETION_EVIDENCE_INVALID',
    );
  }

  const externalPendingOutcomes =
    outcomes.filter(
      (
        outcome,
      ) =>
        outcome.actionStatus ===
          'EXTERNAL_PENDING' &&
        outcome.outcomeType ===
          'EXTERNAL_PENDING',
    );

  if (
    externalPendingOutcomes.length !==
      1
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_PENDING_EVIDENCE_INVALID',
    );
  }

  const completedOutcomes =
    outcomes.filter(
      (
        outcome,
      ) =>
        outcome.actionStatus ===
          'COMPLETE' &&
        outcome.outcomeType ===
          'COMPLETED',
    );

  if (
    completedOutcomes.length !==
      1
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_COMPLETED_EVIDENCE_INVALID',
    );
  }

  if (
    outcomes.length !==
      3
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_OUTCOME_CHAIN_INVALID',
    );
  }

  const completedOutcome =
    completedOutcomes[0];

  const externalReference =
    normalizeRequiredString(
      completedOutcome.externalReference ??
        '',
    );

  if (
    externalReference ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_REFERENCE_REQUIRED',
    );
  }

  const trustId =
    allocateTrustClubTrustId();

  const persistenceResult =
    await withTrustClubPersistence(
      async (
        persistence,
      ) => {
        return persistence.saveActionRecord({
          ...action,

          trustId,

          updatedAt:
            normalizedRecoveredAt,
        });
      },
    );

  if (
    persistenceResult.persisted !==
      true
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_NOT_PERSISTED',
    );
  }

  if (
    persistenceResult.value.actionId !==
      normalizedActionId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_ID_MISMATCH',
    );
  }

  if (
    persistenceResult.value.actionType !==
      'CREATE_STANDARD_TRUST'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ACTION_TYPE_CHANGED',
    );
  }

  if (
    persistenceResult.value.status !==
      'COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_STATUS_CHANGED',
    );
  }

  if (
    persistenceResult.value.trustId !==
      trustId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_TRUST_ID_NOT_PERSISTED',
    );
  }

  if (
    persistenceResult.value.requestedByUserId !==
      action.requestedByUserId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REQUESTER_CHANGED',
    );
  }

  if (
    persistenceResult.value.memberId !==
      action.memberId
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_MEMBER_CHANGED',
    );
  }

  if (
    persistenceResult.value.createdAt !==
      action.createdAt
  ) {
    throw new Error(
      'TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_CREATED_AT_CHANGED',
    );
  }

  return {
    actionId:
      persistenceResult.value.actionId,

    trustId,

    actionStatus:
      'COMPLETE',

    externalReference,

    recoveredByUserId:
      adminAuthorization.authenticatedUserId,

    persisted:
      true,
  };
}

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_SCOPE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_APPLIES_ONLY_TO_COMPLETE_STANDARD_TRUST_ACTION_WITH_MISSING_TRUST_ID' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_AUTHORITY_RULE =
  'STANDARD_TRUST_ID_RECOVERY_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_AUTHORITY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_OUTCOME_RULE =
  'STANDARD_TRUST_ID_RECOVERY_REQUIRES_CERTIFIED_COMPLETE_OUTCOME_CHAIN' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_REFERENCE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_REQUIRES_EXISTING_COMPLETED_EXTERNAL_REFERENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_ALLOCATION_RULE =
  'STANDARD_TRUST_ID_RECOVERY_USES_CANONICAL_TRUST_ID_ALLOCATION_AUTHORITY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_LIFECYCLE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_OUTCOME_WRITE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_DOES_NOT_RECORD_NEW_ACTION_OUTCOME' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_REASSIGNMENT_RULE =
  'STANDARD_TRUST_ID_RECOVERY_PROHIBITS_EXISTING_TRUST_ID_REASSIGNMENT' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_PERSISTENCE_RULE =
  'STANDARD_TRUST_ID_RECOVERY_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

export const TRUST_CLUB_STANDARD_TRUST_ID_RECOVERY_EXTERNAL_EXECUTION_RULE =
  'STANDARD_TRUST_ID_RECOVERY_DOES_NOT_EXECUTE_OR_REPLAY_EXTERNAL_COMPLETION' as const;