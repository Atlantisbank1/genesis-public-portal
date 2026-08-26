import type {
  TrustClubActionRecord,
} from '../../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../../domain/trust-club-action-outcome.contracts';

import type {
  TrustClubActionPersistenceRepository,
  TrustClubPersistenceResult,
} from '../trust-club-action.repository';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.3
 * Action Persistence Adapter Boundary
 *
 * Purpose:
 * Defines the adapter-side implementation boundary for the
 * certified Phase 5.1 Action Persistence Repository contract.
 *
 * Phase 5.3 establishes the shape that a future concrete
 * persistence adapter must satisfy.
 *
 * It does NOT:
 * - select Prisma;
 * - select PostgreSQL;
 * - select another database technology;
 * - implement database access;
 * - create database schemas;
 * - create migrations;
 * - persist Action Records;
 * - persist Action Outcomes;
 * - redefine Action domain models;
 * - modify Action lifecycle state;
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

/**
 * Adapter identity.
 *
 * A concrete persistence implementation must expose a stable
 * adapter identity without coupling the application layer to
 * a specific database technology.
 */
export interface TrustClubActionPersistenceAdapterIdentity {
  adapterName:
    string;

  adapterVersion:
    string;
}

/**
 * Adapter capability descriptor.
 *
 * The capability descriptor states what the adapter supports.
 * It does not prove that any persistence operation has been
 * executed.
 */
export interface TrustClubActionPersistenceAdapterCapabilities {
  supportsActionRecordSave:
    boolean;

  supportsActionRecordLookup:
    boolean;

  supportsActionOutcomeSave:
    boolean;

  supportsActionOutcomeLookup:
    boolean;
}

/**
 * Persistence Adapter Boundary.
 *
 * A concrete persistence adapter must:
 *
 * - satisfy the certified Phase 5.1 repository contract;
 * - expose adapter identity;
 * - expose declared persistence capabilities;
 * - preserve certified Trust Club domain representations.
 */
export interface TrustClubActionPersistenceAdapter
  extends TrustClubActionPersistenceRepository {
  readonly identity:
    TrustClubActionPersistenceAdapterIdentity;

  readonly capabilities:
    TrustClubActionPersistenceAdapterCapabilities;
}

/**
 * Adapter contract verification helper.
 *
 * This function performs structural capability checks only.
 *
 * It does not perform persistence and does not prove database
 * connectivity or database write capability.
 */
export function validateTrustClubActionPersistenceAdapter(
  adapter:
    TrustClubActionPersistenceAdapter,
): boolean {
  return (
    adapter.identity.adapterName.trim().length >
      0 &&
    adapter.identity.adapterVersion.trim().length >
      0 &&
    adapter.capabilities.supportsActionRecordSave ===
      true &&
    adapter.capabilities.supportsActionRecordLookup ===
      true &&
    adapter.capabilities.supportsActionOutcomeSave ===
      true &&
    adapter.capabilities.supportsActionOutcomeLookup ===
      true
  );
}

/**
 * Type-level compatibility checks.
 *
 * These aliases intentionally reference the certified domain
 * and repository contracts so that future adapter
 * implementations remain aligned with them.
 */
export type TrustClubActionPersistenceAdapterRecord =
  TrustClubActionRecord;

export type TrustClubActionPersistenceAdapterOutcome =
  TrustClubActionOutcome;

export type TrustClubActionPersistenceAdapterResult<T> =
  TrustClubPersistenceResult<T>;

/**
 * Repository-boundary rule.
 */
export const TRUST_CLUB_ACTION_ADAPTER_REPOSITORY_RULE =
  'PERSISTENCE_ADAPTER_IMPLEMENTS_PHASE_5_1_REPOSITORY_BOUNDARY' as const;

/**
 * Domain-preservation rule.
 */
export const TRUST_CLUB_ACTION_ADAPTER_DOMAIN_RULE =
  'PERSISTENCE_ADAPTER_PRESERVES_CERTIFIED_ACTION_DOMAIN' as const;

/**
 * Technology-neutrality rule.
 */
export const TRUST_CLUB_ACTION_ADAPTER_TECHNOLOGY_RULE =
  'PERSISTENCE_ADAPTER_BOUNDARY_DOES_NOT_SELECT_DATABASE_TECHNOLOGY' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_ADAPTER_LIFECYCLE_RULE =
  'PERSISTENCE_ADAPTER_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Capability-proof rule.
 *
 * Declaring adapter capability is not proof that a persistence
 * operation occurred.
 */
export const TRUST_CLUB_ACTION_ADAPTER_CAPABILITY_PROOF_RULE =
  'ADAPTER_CAPABILITY_DECLARATION_IS_NOT_PERSISTENCE_PROOF' as const;