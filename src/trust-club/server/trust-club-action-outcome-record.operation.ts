import type {
  TrustClubActionOutcomeCreationInput,
} from '../domain/trust-club-action-outcome.contracts';

import type {
  TrustClubActionOutcomeCreationOrchestrationResult,
} from '../domain/trust-club-action-outcome-creation.contracts';

import {
  orchestrateTrustClubActionOutcomeCreation,
} from '../domain/trust-club-action-outcome-creation.service';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.11
 * Server Application Action Outcome Recording Operation
 *
 * Purpose:
 * Defines a controlled server-side operation for recording
 * a certified Trust Club Action Outcome for an existing
 * persisted Trust Club Action.
 *
 * The operation:
 * 1. reads the existing Action through the certified
 *    Phase 5.7 persistence-consumption boundary;
 * 2. verifies Action identity and lifecycle-state alignment;
 * 3. delegates outcome consistency and construction to the
 *    certified Phase 4.6 outcome-creation orchestration;
 * 4. persists only a successfully constructed outcome through
 *    the certified application persistence service.
 *
 * It does NOT:
 * - create a new outcome vocabulary;
 * - invent lifecycle status;
 * - perform lifecycle transitions;
 * - replace Phase 4.5 consistency authority;
 * - replace Phase 4.4 outcome construction authority;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - access Prisma directly;
 * - access the repository directly;
 * - create a public HTTP endpoint;
 * - create a Server Action;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services;
 * - prove external completion.
 */

export interface RecordTrustClubActionOutcomeInput {
  outcome:
    TrustClubActionOutcomeCreationInput;
}

export interface RecordTrustClubActionOutcomeResult {
  creation:
    TrustClubActionOutcomeCreationOrchestrationResult;

  persisted:
    boolean;
}

/**
 * Records a controlled Action Outcome for one existing
 * persisted Trust Club Action.
 */
export async function recordTrustClubActionOutcome(
  input:
    RecordTrustClubActionOutcomeInput,
): Promise<RecordTrustClubActionOutcomeResult> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      const existingRecord =
        await persistence.findActionRecord(
          input.outcome.actionId,
        );

      if (existingRecord === null) {
        throw new Error(
          'TRUST_CLUB_ACTION_NOT_FOUND',
        );
      }

      if (
        existingRecord.actionType !==
        input.outcome.actionType
      ) {
        throw new Error(
          'TRUST_CLUB_ACTION_OUTCOME_ACTION_TYPE_MISMATCH',
        );
      }

      if (
        existingRecord.status !==
        input.outcome.actionStatus
      ) {
        throw new Error(
          'TRUST_CLUB_ACTION_OUTCOME_ACTION_STATUS_MISMATCH',
        );
      }

      const creation =
        orchestrateTrustClubActionOutcomeCreation({
          outcome:
            input.outcome,
        });

      if (
        creation.outcome ===
        null
      ) {
        return {
          creation,

          persisted:
            false,
        };
      }

      const persistenceResult =
        await persistence.saveActionOutcome(
          creation.outcome,
        );

      return {
        creation: {
          consistency:
            creation.consistency,

          outcome:
            persistenceResult.value,
        },

        persisted:
          persistenceResult.persisted,
      };
    },
  );
}

/**
 * Existing-action rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_EXISTING_ACTION_RULE =
  'ACTION_OUTCOME_CAN_BE_RECORDED_ONLY_FOR_EXISTING_PERSISTED_ACTION' as const;

/**
 * Identity-alignment rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_IDENTITY_RULE =
  'ACTION_OUTCOME_IDENTITY_MUST_MATCH_PERSISTED_ACTION' as const;

/**
 * Lifecycle-alignment rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_STATUS_RULE =
  'ACTION_OUTCOME_STATUS_MUST_MATCH_PERSISTED_ACTION_STATUS' as const;

/**
 * Domain-authority rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_DOMAIN_RULE =
  'SERVER_OUTCOME_RECORDING_USES_PHASE_4_6_OUTCOME_CREATION_AUTHORITY' as const;

/**
 * Persistence-boundary rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_PERSISTENCE_RULE =
  'SERVER_OUTCOME_RECORDING_USES_PHASE_5_7_CONTROLLED_PERSISTENCE_BOUNDARY' as const;

/**
 * External-completion rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_EXTERNAL_RULE =
  'RECORDED_INTERNAL_OUTCOME_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_RECORD_EXPOSURE_RULE =
  'SERVER_OUTCOME_RECORDING_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;