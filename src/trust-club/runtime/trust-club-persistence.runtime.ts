import {
  TrustClubActionPersistenceService,
} from '../application/trust-club-action-persistence.service';

import {
  TrustClubTrustRegistryService,
} from '../application/trust-club-trust-registry.service';

import {
  TrustClubActionPrismaAdapter,
} from '../persistence/adapters/trust-club-action-prisma.adapter';

import {
  TrustClubTrustRecordPrismaAdapter,
} from '../persistence/adapters/trust-club-trust-record-prisma.adapter';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1
 * Application Persistence Runtime Composition
 *
 * Purpose:
 * Composes the certified Trust Club persistence boundaries.
 *
 * Action persistence chain:
 *
 * TrustClubActionPrismaAdapter
 *              ↓
 * TrustClubActionPersistenceService
 *
 * Canonical Trust Registry chain:
 *
 * TrustClubTrustRecordPrismaAdapter
 *              ↓
 * TrustClubTrustRegistryService
 *
 * This runtime composition owns dependency construction only.
 *
 * It does NOT:
 * - redefine persistence contracts;
 * - redefine domain models;
 * - control Action lifecycle authority;
 * - perform lifecycle transitions;
 * - allocate canonical Trust IDs;
 * - derive canonical Trust IDs;
 * - register a Trust automatically;
 * - recover a Trust automatically;
 * - create Action Outcomes;
 * - verify external completion;
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

  readonly trustRegistry:
    TrustClubTrustRegistryService;

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
 * TrustClubTrustRecordPrismaAdapter
 *              ↓
 * TrustClubTrustRegistryService
 *
 * Both application services remain dependent only on their
 * respective repository contracts.
 *
 * Runtime construction itself performs no persistence write.
 */
export function createTrustClubPersistenceRuntime():
  TrustClubPersistenceRuntime {
  const actionAdapter =
    new TrustClubActionPrismaAdapter();

  const persistence =
    new TrustClubActionPersistenceService(
      actionAdapter,
    );

  const trustRecordAdapter =
    new TrustClubTrustRecordPrismaAdapter();

  const trustRegistry =
    new TrustClubTrustRegistryService(
      trustRecordAdapter,
    );

  return {
    persistence,

    trustRegistry,

    async disconnect():
      Promise<void> {
      await trustRecordAdapter.disconnect();

      await actionAdapter.disconnect();
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
 * Trust Club application services remain dependent on their
 * repository contracts rather than concrete Prisma adapters.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_APPLICATION_RULE =
  'APPLICATION_SERVICES_REMAIN_REPOSITORY_BOUND' as const;

/**
 * Canonical Trust Registry composition rule.
 *
 * The canonical Trust Registry is made available through
 * runtime composition without granting runtime composition
 * authority to register, recover, or allocate a Trust.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_TRUST_REGISTRY_RULE =
  'CANONICAL_TRUST_REGISTRY_IS_COMPOSED_WITHOUT_AUTOMATIC_EXECUTION' as const;

/**
 * Trust-ID authority rule.
 *
 * Runtime composition does not allocate or derive canonical
 * Trust IDs.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_TRUST_ID_RULE =
  'RUNTIME_COMPOSITION_DOES_NOT_ALLOCATE_CANONICAL_TRUST_IDS' as const;

/**
 * Lifecycle-authority rule.
 *
 * Runtime composition constructs persistence dependencies
 * but does not control Trust Club Action lifecycle state.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_LIFECYCLE_RULE =
  'RUNTIME_COMPOSITION_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Outcome-boundary rule.
 *
 * Runtime composition does not create or modify Action
 * Outcomes.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_OUTCOME_RULE =
  'RUNTIME_COMPOSITION_DOES_NOT_CREATE_ACTION_OUTCOMES' as const;

/**
 * Resource-ownership rule.
 *
 * The runtime composition owns controlled shutdown of the
 * concrete Prisma adapters that it creates.
 */
export const TRUST_CLUB_PERSISTENCE_RUNTIME_RESOURCE_RULE =
  'RUNTIME_COMPOSITION_OWNS_ADAPTER_RESOURCE_SHUTDOWN' as const;