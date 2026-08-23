import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../domain/trust-club-action-outcome.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.1
 * Action Persistence Repository Contract
 *
 * Purpose:
 * Defines the persistence boundary for certified Trust Club
 * Action Records and Action Outcomes.
 *
 * This contract separates the certified Trust Club domain
 * model from any future persistence implementation.
 *
 * Phase 5.1 defines repository capability only.
 *
 * It does NOT:
 * - implement persistence;
 * - select a database technology;
 * - access a database;
 * - access Prisma;
 * - create database schemas;
 * - create migrations;
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

export interface TrustClubPersistenceResult<T> {
  value:
    T;

  persisted:
    boolean;
}

export interface TrustClubActionRecordRepository {
  saveActionRecord(
    record:
      TrustClubActionRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionRecord
    >
  >;

  findByActionId(
    actionId:
      string,
  ): Promise<
    TrustClubActionRecord | null
  >;
}

export interface TrustClubActionOutcomeRepository {
  saveActionOutcome(
    outcome:
      TrustClubActionOutcome,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionOutcome
    >
  >;

  findOutcomesByActionId(
    actionId:
      string,
  ): Promise<
    readonly TrustClubActionOutcome[]
  >;
}

export interface TrustClubActionPersistenceRepository
  extends
    TrustClubActionRecordRepository,
    TrustClubActionOutcomeRepository {}

/**
 * Domain-boundary rule.
 */
export const TRUST_CLUB_ACTION_PERSISTENCE_DOMAIN_RULE =
  'PERSISTENCE_USES_CERTIFIED_TRUST_CLUB_ACTION_DOMAIN' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_PERSISTENCE_LIFECYCLE_RULE =
  'PERSISTENCE_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Technology-neutrality rule.
 */
export const TRUST_CLUB_ACTION_PERSISTENCE_TECHNOLOGY_RULE =
  'PERSISTENCE_CONTRACT_IS_TECHNOLOGY_NEUTRAL' as const;

/**
 * Persistence-proof rule.
 */
export const TRUST_CLUB_ACTION_PERSISTENCE_PROOF_RULE =
  'DOMAIN_OBJECT_EXISTENCE_IS_NOT_PERSISTENCE_PROOF' as const;