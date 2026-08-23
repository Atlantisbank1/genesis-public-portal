import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../domain/trust-club-action-outcome.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.13
 * Server Application Action Aggregate Read Operation
 *
 * Purpose:
 * Defines a controlled server-side application operation for
 * reading one persisted Trust Club Action together with all
 * persisted Action Outcomes associated with that Action.
 *
 * Both reads are performed within one certified Phase 5.7
 * persistence-consumption runtime.
 *
 * This operation composes existing certified read capabilities.
 *
 * It does NOT:
 * - redefine the Action domain;
 * - redefine the Action Outcome domain;
 * - redefine persistence contracts;
 * - modify Action lifecycle state;
 * - perform lifecycle transitions;
 * - create Action records;
 * - create or record Action Outcomes;
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

export interface ReadTrustClubActionAggregateInput {
  actionId:
    string;
}

export interface TrustClubActionAggregate {
  action:
    TrustClubActionRecord;

  outcomes:
    readonly TrustClubActionOutcome[];
}

/**
 * Reads one persisted Trust Club Action together with all
 * persisted Outcomes associated with that Action.
 *
 * Missing Action behavior:
 *
 * A missing Action produces null.
 *
 * Outcomes are not read as an independently valid aggregate
 * when the owning Action does not exist.
 *
 * Persistence access is performed only through the certified
 * Phase 5.7 controlled consumption boundary.
 */
export async function readTrustClubActionAggregate(
  input:
    ReadTrustClubActionAggregateInput,
): Promise<
  TrustClubActionAggregate |
  null
> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      const action =
        await persistence.findActionRecord(
          input.actionId,
        );

      if (action === null) {
        return null;
      }

      const outcomes =
        await persistence.findActionOutcomes(
          input.actionId,
        );

      return {
        action,

        outcomes,
      };
    },
  );
}

/**
 * Server-boundary rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_SERVER_BOUNDARY_RULE =
  'SERVER_APPLICATION_AGGREGATE_READ_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Read-only rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_ONLY_RULE =
  'SERVER_APPLICATION_AGGREGATE_READ_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Aggregate-ownership rule.
 *
 * Outcomes supplement their owning Action and are not treated
 * by this operation as an independently authoritative Action.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_OWNERSHIP_RULE =
  'ACTION_OUTCOMES_ARE_READ_WITH_THEIR_EXISTING_ACTION_OWNER' as const;

/**
 * Existing-domain rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_DOMAIN_RULE =
  'SERVER_APPLICATION_AGGREGATE_READ_PRESERVES_CERTIFIED_ACTION_AND_OUTCOME_DOMAINS' as const;

/**
 * Missing-action rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_MISSING_ACTION_RULE =
  'MISSING_ACTION_PRODUCES_NULL_AGGREGATE' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_EXPOSURE_RULE =
  'SERVER_APPLICATION_AGGREGATE_READ_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_LIFECYCLE_RULE =
  'SERVER_APPLICATION_AGGREGATE_READ_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * External-completion rule.
 */
export const TRUST_CLUB_ACTION_AGGREGATE_READ_EXTERNAL_RULE =
  'READING_ACTION_AGGREGATE_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;