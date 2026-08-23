import type {
  TrustClubActionStatus,
} from '../domain/trust-club-domain.contracts';

import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import {
  progressTrustClubAction,
} from '../domain/trust-club-action-progression.service';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.10
 * Server Application Lifecycle Transition Operation
 *
 * Purpose:
 * Defines a controlled server-side application operation for
 * progressing an existing persisted Trust Club Action record.
 *
 * The operation:
 * 1. reads the existing Action record through the certified
 *    persistence consumption boundary;
 * 2. delegates lifecycle progression to the certified
 *    Phase 4.3 Action Progression authority;
 * 3. relies on Phase 4.1 and Phase 4.0 for lifecycle
 *    transformation and transition permission;
 * 4. persists only the progressed record returned by the
 *    certified domain progression authority.
 *
 * This operation does NOT:
 * - create a new lifecycle vocabulary;
 * - independently decide whether a transition is allowed;
 * - construct a transitioned Action record directly;
 * - mutate status directly;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - activate entitlements;
 * - expose Prisma;
 * - expose the persistence adapter;
 * - expose the repository;
 * - create an HTTP route;
 * - create a Server Action;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services;
 * - prove external completion.
 */

export interface TransitionTrustClubActionInput {
  actionId:
    string;

  requestedStatus:
    TrustClubActionStatus;

  updatedAt:
    string;
}

export interface TransitionTrustClubActionResult {
  previousRecord:
    TrustClubActionRecord;

  progressedRecord:
    TrustClubActionRecord;

  persisted:
    boolean;
}

/**
 * Progresses one existing persisted Trust Club Action.
 *
 * Missing Action records are rejected before lifecycle
 * progression is attempted.
 *
 * Lifecycle permission remains exclusively controlled by
 * the certified domain workflow authority.
 */
export async function transitionTrustClubAction(
  input:
    TransitionTrustClubActionInput,
): Promise<TransitionTrustClubActionResult> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      const existingRecord =
        await persistence.findActionRecord(
          input.actionId,
        );

      if (existingRecord === null) {
        throw new Error(
          'TRUST_CLUB_ACTION_NOT_FOUND',
        );
      }

      const progression =
        progressTrustClubAction({
          record:
            existingRecord,

          requestedStatus:
            input.requestedStatus,

          updatedAt:
            input.updatedAt,
        });

      const persistenceResult =
        await persistence.saveActionRecord(
          progression.progressedRecord,
        );

      return {
        previousRecord:
          progression.previousRecord,

        progressedRecord:
          persistenceResult.value,

        persisted:
          persistenceResult.persisted,
      };
    },
  );
}

/**
 * Domain-authority rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_DOMAIN_AUTHORITY_RULE =
  'SERVER_ACTION_TRANSITION_USES_CERTIFIED_DOMAIN_PROGRESSION_AUTHORITY' as const;

/**
 * Workflow-authority rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_WORKFLOW_AUTHORITY_RULE =
  'SERVER_ACTION_TRANSITION_DOES_NOT_REPLACE_PHASE_4_0_WORKFLOW_AUTHORITY' as const;

/**
 * Persistence-boundary rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_PERSISTENCE_RULE =
  'SERVER_ACTION_TRANSITION_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Missing-record rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_MISSING_RECORD_RULE =
  'MISSING_ACTION_RECORD_CANNOT_BE_PROGRESSED' as const;

/**
 * Authorization-boundary rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_AUTHORIZATION_RULE =
  'ACTION_LIFECYCLE_PROGRESSION_IS_NOT_UNDERLYING_ACTION_AUTHORIZATION' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_TRANSITION_EXPOSURE_RULE =
  'SERVER_ACTION_TRANSITION_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;