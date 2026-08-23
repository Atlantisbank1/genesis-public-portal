import type {
  TrustClubActionRequestIntakeInput,
  TrustClubActionRequestIntakeResult,
} from '../domain/trust-club-action-request-intake.contracts';

import {
  intakeTrustClubActionRequest,
} from '../domain/trust-club-action-request-intake.service';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.9
 * Server Application Action Creation Operation
 *
 * Purpose:
 * Defines a controlled server-side application operation that:
 *
 * 1. delegates authorization and Action-record construction
 *    to the certified domain intake authority;
 * 2. persists the resulting Action record only when the
 *    intake authority produces one;
 * 3. performs persistence only through the certified
 *    Phase 5.7 controlled persistence consumption boundary.
 *
 * This operation does NOT:
 * - construct Action records directly;
 * - choose the initial Action status;
 * - perform lifecycle transitions;
 * - bypass authorization;
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
 * - execute external services.
 */

export interface CreateTrustClubActionResult {
  intake:
    TrustClubActionRequestIntakeResult;

  persisted:
    boolean;
}

/**
 * Creates a Trust Club Action through the existing
 * domain authority and persists it when creation is allowed.
 *
 * Authorization-denied intake produces no Action record
 * and therefore performs no persistence write.
 */
export async function createTrustClubAction(
  input:
    TrustClubActionRequestIntakeInput,
): Promise<CreateTrustClubActionResult> {
  const intake =
    intakeTrustClubActionRequest(
      input,
    );

  const actionRecord =
    intake.actionRecord;

  if (actionRecord === null) {
    return {
      intake,

      persisted:
        false,
    };
  }

  const persistenceResult =
    await withTrustClubPersistence(
      async (
        persistence,
      ) => {
        return persistence.saveActionRecord(
          actionRecord,
        );
      },
    );

  return {
    intake: {
      ...intake,

      actionRecord:
        persistenceResult.value,
    },

    persisted:
      persistenceResult.persisted,
  };
}

/**
 * Domain-authority rule.
 */
export const TRUST_CLUB_ACTION_CREATE_DOMAIN_AUTHORITY_RULE =
  'SERVER_ACTION_CREATION_USES_CERTIFIED_DOMAIN_INTAKE_AUTHORITY' as const;

/**
 * Authorization-gate rule.
 */
export const TRUST_CLUB_ACTION_CREATE_AUTHORIZATION_GATE_RULE =
  'DENIED_ACTION_INTAKE_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Persistence-boundary rule.
 */
export const TRUST_CLUB_ACTION_CREATE_PERSISTENCE_RULE =
  'SERVER_ACTION_CREATION_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_CREATE_LIFECYCLE_RULE =
  'SERVER_ACTION_CREATION_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_CREATE_EXPOSURE_RULE =
  'SERVER_ACTION_CREATION_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;