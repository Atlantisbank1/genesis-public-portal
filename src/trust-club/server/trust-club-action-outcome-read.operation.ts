import type {
  TrustClubActionOutcome,
} from '../domain/trust-club-action-outcome.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.12
 * Server Application Action Outcome Read Operation
 *
 * Purpose:
 * Defines a controlled server-side application operation for
 * reading persisted Trust Club Action Outcomes associated with
 * one Action through the certified Phase 5.7 controlled
 * persistence-consumption boundary.
 *
 * The operation uses only the existing certified persistence
 * read capability.
 *
 * It does NOT:
 * - redefine the Action Outcome domain;
 * - redefine persistence contracts;
 * - modify Action lifecycle state;
 * - perform lifecycle transitions;
 * - create or record outcomes;
 * - perform persistence writes;
 * - access Prisma directly;
 * - access the repository directly;
 * - expose the concrete persistence adapter;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - create an HTTP route;
 * - create a Server Action;
 * - expose persistence to client-side code;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services;
 * - prove external completion.
 */

export interface ReadTrustClubActionOutcomesInput {
  actionId:
    string;
}

/**
 * Reads all persisted Action Outcomes associated with one
 * Trust Club Action.
 *
 * Persistence access is performed only through the certified
 * Phase 5.7 controlled consumption boundary.
 *
 * Ordering remains owned by the certified persistence
 * implementation and is not redefined by this operation.
 */
export async function readTrustClubActionOutcomes(
  input:
    ReadTrustClubActionOutcomesInput,
): Promise<
  readonly TrustClubActionOutcome[]
> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      return persistence.findActionOutcomes(
        input.actionId,
      );
    },
  );
}

/**
 * Server-boundary rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_SERVER_BOUNDARY_RULE =
  'SERVER_APPLICATION_OUTCOME_READ_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Read-only rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_ONLY_RULE =
  'SERVER_APPLICATION_OUTCOME_READ_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Existing-domain rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_DOMAIN_RULE =
  'SERVER_APPLICATION_OUTCOME_READ_PRESERVES_CERTIFIED_OUTCOME_DOMAIN' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_EXPOSURE_RULE =
  'SERVER_APPLICATION_OUTCOME_READ_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_LIFECYCLE_RULE =
  'SERVER_APPLICATION_OUTCOME_READ_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * External-completion rule.
 */
export const TRUST_CLUB_ACTION_OUTCOME_READ_EXTERNAL_RULE =
  'READING_RECORDED_OUTCOMES_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;