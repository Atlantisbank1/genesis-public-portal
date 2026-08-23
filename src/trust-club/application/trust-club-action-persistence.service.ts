import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../domain/trust-club-action-outcome.contracts';

import type {
  TrustClubActionPersistenceRepository,
  TrustClubPersistenceResult,
} from '../persistence/trust-club-action.repository';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.2
 * Application Persistence Orchestration Service
 *
 * Purpose:
 * Defines the application-layer orchestration used to invoke
 * the certified Phase 5.1 Action Persistence Repository
 * boundary for Trust Club Action Records and Action Outcomes.
 *
 * Phase 5.2 depends on the repository contract only.
 *
 * It does NOT:
 * - implement persistence;
 * - select a database technology;
 * - access Prisma directly;
 * - create database schemas;
 * - create migrations;
 * - redefine Action domain models;
 * - modify Action lifecycle rules;
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

export class TrustClubActionPersistenceService {
  constructor(
    private readonly repository:
      TrustClubActionPersistenceRepository,
  ) {}

  async saveActionRecord(
    record:
      TrustClubActionRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionRecord
    >
  > {
    return this.repository.saveActionRecord(
      record,
    );
  }

  async findActionRecord(
    actionId:
      string,
  ): Promise<
    TrustClubActionRecord | null
  > {
    return this.repository.findByActionId(
      actionId,
    );
  }

  async saveActionOutcome(
    outcome:
      TrustClubActionOutcome,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionOutcome
    >
  > {
    return this.repository.saveActionOutcome(
      outcome,
    );
  }

  async findActionOutcomes(
    actionId:
      string,
  ): Promise<
    readonly TrustClubActionOutcome[]
  > {
    return this.repository.findOutcomesByActionId(
      actionId,
    );
  }
}

/**
 * Repository-boundary rule.
 *
 * Phase 5.2 must access persistence only through the certified
 * Phase 5.1 repository contract.
 */
export const TRUST_CLUB_ACTION_APPLICATION_PERSISTENCE_RULE =
  'APPLICATION_PERSISTENCE_USES_PHASE_5_1_REPOSITORY_BOUNDARY' as const;

/**
 * Domain-preservation rule.
 *
 * Phase 5.2 consumes and returns certified Trust Club Action
 * domain representations without redefining them.
 */
export const TRUST_CLUB_ACTION_APPLICATION_DOMAIN_RULE =
  'APPLICATION_PERSISTENCE_PRESERVES_CERTIFIED_ACTION_DOMAIN' as const;

/**
 * Lifecycle-authority rule.
 *
 * Application persistence orchestration must not become an
 * Action lifecycle authority.
 */
export const TRUST_CLUB_ACTION_APPLICATION_LIFECYCLE_RULE =
  'APPLICATION_PERSISTENCE_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Technology-neutrality rule.
 *
 * Phase 5.2 does not know which persistence adapter or database
 * technology will eventually implement the repository.
 */
export const TRUST_CLUB_ACTION_APPLICATION_TECHNOLOGY_RULE =
  'APPLICATION_PERSISTENCE_IS_ADAPTER_NEUTRAL' as const;