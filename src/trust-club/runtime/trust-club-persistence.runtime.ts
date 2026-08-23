import {
  TrustClubActionPersistenceService,
} from '../application/trust-club-action-persistence.service';

import {
  TrustClubActionPrismaAdapter,
} from '../persistence/adapters/trust-club-action-prisma.adapter';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.6
 * Application Persistence Runtime Composition
 *
 * Purpose:
 * Composes the certified Trust Club persistence chain:
 *
 * Phase 5.1
 * Repository Contract
 *
 * Phase 5.2
 * Application Persistence Service
 *
 * Phase 5.3
 * Persistence Adapter Boundary
 *
 * Phase 5.4
 * Prisma / PostgreSQL Foundation
 *
 * Phase 5.5
 * Concrete Prisma Persistence Adapter
 *
 * This runtime composition owns dependency construction only.
 *
 * It does NOT:
 * - redefine persistence contracts;
 * - redefine domain models;
 * - control Action lifecycle authority;
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

export interface TrustClubPersistenceRuntime {
  readonly persistence:
    TrustClubActionPersistenceService;

  disconnect():
    Promise<void>;
}

/**
 * Creates the Trust Club persistence runtime.
 *
 * Construction ownership:
 *
 * TrustClubActionPrismaAdapter
 *              ↓
 * TrustClubActionPersistenceService
 *
 * The application service remains dependent only on the
 * certified Phase 5.1 repository boundary.
 */
export function createTrustClubPersistenceRuntime():
  TrustClubPersistenceRuntime {
  const adapter =
    new TrustClubActionPrismaAdapter();

  const persistence =
    new TrustClubActionPersistenceService(
      adapter,
    );

  return {
    persistence,

    async disconnect():
      Promise<void> {
      await adapter.disconnect();
    },
  };
}

/**
 * Composition-boundary rule.
 *
 * Concrete persistence technology is selected only at the
 * Trust Club runtime composition boundary.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_COMPOSITION_RULE =
  'CONCRETE_PERSISTENCE_SELECTED_ONLY_AT_RUNTIME_COMPOSITION_BOUNDARY' as const;

/**
 * Application-boundary rule.
 *
 * The certified Phase 5.2 application service remains
 * dependent on the Phase 5.1 repository contract.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_APPLICATION_RULE =
  'APPLICATION_SERVICE_REMAINS_REPOSITORY_BOUND' as const;

/**
 * Lifecycle-authority rule.
 *
 * Runtime composition constructs persistence dependencies
 * but does not control Trust Club Action lifecycle state.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_LIFECYCLE_RULE =
  'RUNTIME_COMPOSITION_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Resource-ownership rule.
 *
 * The runtime composition owns controlled shutdown of the
 * concrete Prisma adapter that it creates.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_RESOURCE_RULE =
  'RUNTIME_COMPOSITION_OWNS_ADAPTER_RESOURCE_SHUTDOWN' as const;