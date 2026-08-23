import type {
  TrustClubActionPersistenceService,
} from '../application/trust-club-action-persistence.service';

import {
  createTrustClubPersistenceRuntime,
} from './trust-club-persistence.runtime';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.7
 * Application Runtime Consumption Boundary
 *
 * Purpose:
 * Defines the controlled consumption boundary through which
 * future server-side Trust Club application operations may
 * use the certified Phase 5.6 persistence runtime.
 *
 * Phase 5.7 does not expose the concrete Prisma adapter.
 *
 * Consumers receive only the certified Phase 5.2
 * TrustClubActionPersistenceService.
 *
 * Runtime creation and controlled resource shutdown remain
 * owned by the certified Phase 5.6 runtime composition.
 *
 * It does NOT:
 * - expose Prisma;
 * - expose the concrete persistence adapter;
 * - redefine persistence contracts;
 * - redefine domain models;
 * - control Action lifecycle authority;
 * - perform lifecycle transitions;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - create API routes;
 * - create Server Actions;
 * - expose persistence to client-side code;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services.
 */

/**
 * Controlled Trust Club persistence operation.
 *
 * The operation receives only the application persistence
 * service and therefore cannot depend directly on the
 * concrete Prisma adapter through this boundary.
 */
export type TrustClubPersistenceOperation<T> =
  (
    persistence:
      TrustClubActionPersistenceService,
  ) => Promise<T>;

/**
 * Executes a controlled application persistence operation.
 *
 * Resource lifecycle:
 *
 * 1. Create certified Phase 5.6 runtime.
 * 2. Provide only the Phase 5.2 application service.
 * 3. Execute the consumer operation.
 * 4. Always disconnect the runtime in finally.
 */
export async function withTrustClubPersistence<T>(
  operation:
    TrustClubPersistenceOperation<T>,
): Promise<T> {
  const runtime =
    createTrustClubPersistenceRuntime();

  try {
    return await operation(
      runtime.persistence,
    );
  } finally {
    await runtime.disconnect();
  }
}

/**
 * Consumption-boundary rule.
 *
 * Runtime consumers receive the certified application
 * persistence service rather than the concrete adapter.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_BOUNDARY_RULE =
  'RUNTIME_CONSUMERS_RECEIVE_APPLICATION_PERSISTENCE_SERVICE_ONLY' as const;

/**
 * Adapter-isolation rule.
 *
 * Concrete persistence technology remains hidden behind the
 * certified runtime composition boundary.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_ADAPTER_RULE =
  'RUNTIME_CONSUMERS_DO_NOT_RECEIVE_CONCRETE_PERSISTENCE_ADAPTER' as const;

/**
 * Resource-lifecycle rule.
 *
 * Controlled runtime consumption must always release the
 * runtime resource after the consumer operation completes.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_RESOURCE_RULE =
  'RUNTIME_CONSUMPTION_ALWAYS_RELEASES_RUNTIME_RESOURCE' as const;

/**
 * Exposure rule.
 *
 * Phase 5.7 defines an internal application consumption
 * boundary only. It does not create a public API, route,
 * Server Action, or client-side persistence surface.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_EXPOSURE_RULE =
  'RUNTIME_CONSUMPTION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;