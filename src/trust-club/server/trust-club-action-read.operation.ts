import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.8
 * Server Application Read Operation
 *
 * Purpose:
 * Defines a server-side application operation for reading
 * a persisted Trust Club Action Record through the certified
 * Phase 5.7 controlled persistence consumption boundary.
 *
 * This operation does NOT:
 * - expose Prisma;
 * - expose the persistence adapter;
 * - create an HTTP route;
 * - create a Server Action;
 * - perform persistence writes;
 * - modify lifecycle state;
 * - perform lifecycle transitions;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services.
 */

export interface ReadTrustClubActionInput {
  actionId:
    string;
}

/**
 * Reads one Trust Club Action Record.
 *
 * Persistence access is performed only through the certified
 * Phase 5.7 controlled consumption boundary.
 */
export async function readTrustClubAction(
  input:
    ReadTrustClubActionInput,
): Promise<
  TrustClubActionRecord |
  null
> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      return persistence.findActionRecord(
        input.actionId,
      );
    },
  );
}

/**
 * Server-boundary rule.
 */
export const TRUST_CLUB_ACTION_READ_SERVER_BOUNDARY_RULE =
  'SERVER_APPLICATION_READ_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Read-only rule.
 */
export const TRUST_CLUB_ACTION_READ_ONLY_RULE =
  'SERVER_APPLICATION_READ_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_READ_EXPOSURE_RULE =
  'SERVER_APPLICATION_READ_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_READ_LIFECYCLE_RULE =
  'SERVER_APPLICATION_READ_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;