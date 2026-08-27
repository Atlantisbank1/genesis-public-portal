import type {
  TrustClubActionPersistenceService,
} from '../application/trust-club-action-persistence.service';

import type {
  TrustClubTrustRegistryService,
} from '../application/trust-club-trust-registry.service';

import {
  createTrustClubPersistenceRuntime,
} from './trust-club-persistence.runtime';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R23
 * Application Runtime Consumption Boundary
 *
 * Purpose:
 * Defines the controlled consumption boundary through which
 * server-side Trust Club application operations may use the
 * composed Trust Club persistence services.
 *
 * Consumers may receive:
 *
 * 1. TrustClubActionPersistenceService
 *    - Action Record persistence;
 *    - Action Outcome persistence;
 *    - Action persistence reads.
 *
 * 2. TrustClubTrustRegistryService
 *    - Canonical Trust Record persistence;
 *    - Canonical Trust Record reads.
 *
 * Concrete Prisma adapters remain hidden.
 *
 * Runtime creation and controlled resource shutdown remain
 * owned by the runtime composition boundary.
 *
 * This boundary does NOT:
 * - expose Prisma;
 * - expose concrete persistence adapters;
 * - redefine persistence contracts;
 * - redefine domain models;
 * - control Action lifecycle authority;
 * - perform lifecycle transitions;
 * - allocate Canonical Trust IDs;
 * - infer Trust establishment;
 * - automatically create Canonical Trust Records;
 * - create Action Outcomes;
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
 * Existing consumers may continue accepting only the first
 * argument.
 *
 * New Canonical Trust Registry consumers may additionally
 * accept the second application service.
 *
 * Neither argument exposes a concrete Prisma adapter.
 */
export type TrustClubPersistenceOperation<T> =
  (
    persistence:
      TrustClubActionPersistenceService,

    trustRegistry:
      TrustClubTrustRegistryService,
  ) => Promise<T>;

/**
 * Executes a controlled application persistence operation.
 *
 * Resource lifecycle:
 *
 * 1. Create the Trust Club persistence runtime.
 * 2. Provide application services only.
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
      runtime.trustRegistry,
    );
  }
  finally {
    await runtime.disconnect();
  }
}

/**
 * Consumption-boundary rule.
 *
 * Runtime consumers receive application persistence services
 * rather than concrete persistence adapters.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_BOUNDARY_RULE =
  'RUNTIME_CONSUMERS_RECEIVE_APPLICATION_PERSISTENCE_SERVICES_ONLY' as const;

/**
 * Canonical Trust Registry consumption rule.
 *
 * Canonical Trust Registry access is exposed only through the
 * application-layer Trust Registry service.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_TRUST_REGISTRY_RULE =
  'CANONICAL_TRUST_REGISTRY_CONSUMPTION_USES_APPLICATION_SERVICE_ONLY' as const;

/**
 * Adapter-isolation rule.
 *
 * Concrete persistence technology remains hidden behind the
 * runtime composition boundary.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_ADAPTER_RULE =
  'RUNTIME_CONSUMERS_DO_NOT_RECEIVE_CONCRETE_PERSISTENCE_ADAPTERS' as const;

/**
 * Lifecycle-authority rule.
 *
 * Receiving persistence services does not grant authority to
 * transition an Action or establish lifecycle state.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_LIFECYCLE_RULE =
  'RUNTIME_CONSUMPTION_DOES_NOT_GRANT_ACTION_LIFECYCLE_AUTHORITY' as const;

/**
 * Trust-ID authority rule.
 *
 * Runtime consumption does not allocate or derive Canonical
 * Trust IDs.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_TRUST_ID_RULE =
  'RUNTIME_CONSUMPTION_DOES_NOT_ALLOCATE_CANONICAL_TRUST_IDS' as const;

/**
 * Automatic-execution rule.
 *
 * Merely consuming the runtime does not create or recover a
 * Canonical Trust Record.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_EXECUTION_RULE =
  'RUNTIME_CONSUMPTION_DOES_NOT_AUTOMATICALLY_CREATE_OR_RECOVER_TRUST' as const;

/**
 * Resource-lifecycle rule.
 *
 * Controlled runtime consumption must always release the
 * runtime resources after the consumer operation completes.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_RESOURCE_RULE =
  'RUNTIME_CONSUMPTION_ALWAYS_RELEASES_RUNTIME_RESOURCES' as const;

/**
 * Exposure rule.
 *
 * This remains an internal application consumption boundary.
 * It does not create a public API, route, Server Action, or
 * client-side persistence surface.
 */
export const TRUST_CLUB_PERSISTENCE_CONSUMPTION_EXPOSURE_RULE =
  'RUNTIME_CONSUMPTION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;