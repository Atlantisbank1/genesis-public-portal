import {
  evaluateTrustClubActionTransition,
} from './trust-club-action-workflow.policy';

import type {
  TrustClubActionRecord,
  TrustClubActionRecordCreationInput,
  TrustClubActionRecordTransitionInput,
} from './trust-club-action-record.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.1
 * Action Record Domain Model Service
 *
 * Purpose:
 * Constructs and transforms Trust Club Action domain records
 * without persistence.
 *
 * This service:
 * - creates new Action records in DRAFT status;
 * - delegates lifecycle transition validation to Phase 4.0;
 * - returns a new immutable-style Action record when allowed.
 *
 * It does NOT:
 * - persist Action records;
 * - mutate a database;
 * - access Prisma;
 * - access Atlantis;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - execute payments;
 * - execute banking activity;
 * - execute external services.
 */

export function createTrustClubActionRecord(
  input:
    TrustClubActionRecordCreationInput,
): TrustClubActionRecord {
  return {
    actionId:
      input.actionId,

    actionType:
      input.actionType,

    status:
      'DRAFT',

    requestedByUserId:
      input.requestedByUserId,

    memberId:
      input.memberId,

    trustId:
      input.trustId,

    createdAt:
      input.createdAt,

    updatedAt:
      input.createdAt,
  };
}

export function transitionTrustClubActionRecord(
  input:
    TrustClubActionRecordTransitionInput,
): TrustClubActionRecord {
  const decision =
    evaluateTrustClubActionTransition({
      actionType:
        input.record.actionType,

      currentStatus:
        input.record.status,

      requestedStatus:
        input.requestedStatus,
    });

  if (!decision.allowed) {
    throw new Error(
      `TRUST_CLUB_ACTION_TRANSITION_DENIED:${decision.reason}`,
    );
  }

  if (
    input.requestedTrustId !== undefined &&
    input.requestedStatus !== 'COMPLETE'
  ) {
    throw new Error(
      'TRUST_CLUB_TRUST_ID_ASSIGNMENT_REQUIRES_COMPLETE_STATUS',
    );
  }

  if (
    input.requestedTrustId !== undefined &&
    input.record.trustId !== undefined
  ) {
    throw new Error(
      'TRUST_CLUB_TRUST_ID_REASSIGNMENT_PROHIBITED',
    );
  }

  return {
    ...input.record,

    status:
      input.requestedStatus,

    trustId:
      input.requestedTrustId ??
      input.record.trustId,

    updatedAt:
      input.updatedAt,
  };
}