import type {
  TrustClubActionRecord,
} from '../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionType,
} from '../domain/trust-club-domain.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

/**
 * TRUST-CLUB-V1
 *
 * Phase 8.4
 * Server Application Member Action Discovery Operation
 *
 * Purpose:
 * Defines a controlled server-side application operation for
 * discovering persisted Trust Club Action Records belonging
 * to one existing member and matching one existing certified
 * Action type.
 *
 * Persistence access is performed only through the existing
 * certified controlled persistence-consumption boundary.
 *
 * This operation composes the Phase 8.4 member-scoped Action
 * discovery read primitive without introducing a new
 * persistence authority.
 *
 * The operation:
 * - reads existing persisted Action Records only;
 * - scopes discovery by existing memberId;
 * - scopes discovery by existing certified ActionType;
 * - delegates persistence access through
 *   withTrustClubPersistence;
 * - preserves the certified Action Record domain;
 * - remains read only.
 *
 * It does NOT:
 * - create Action Records;
 * - modify Action Records;
 * - modify Action lifecycle state;
 * - perform lifecycle transitions;
 * - create or record Action Outcomes;
 * - perform persistence writes;
 * - access Prisma directly;
 * - access the repository directly;
 * - expose the concrete persistence adapter;
 * - establish member ownership;
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

export interface ReadTrustClubMemberActionsInput {
  memberId:
    string;

  actionType:
    TrustClubActionType;
}

/**
 * Reads persisted Trust Club Action Records belonging to the
 * supplied member and matching the supplied certified Action
 * type.
 *
 * Membership ownership and authorization are intentionally
 * outside this operation.
 *
 * Persistence access is performed only through the certified
 * controlled persistence-consumption boundary.
 *
 * Ordering remains owned by the certified persistence
 * implementation and is not redefined by this operation.
 */
export async function readTrustClubMemberActions(
  input:
    ReadTrustClubMemberActionsInput,
): Promise<
  readonly TrustClubActionRecord[]
> {
  return withTrustClubPersistence(
    async (
      persistence,
    ) => {
      return persistence.findActionRecordsByMemberAndType(
        input.memberId,
        input.actionType,
      );
    },
  );
}

/**
 * Server-boundary rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_SERVER_BOUNDARY_RULE =
  'SERVER_MEMBER_ACTION_DISCOVERY_USES_CERTIFIED_PERSISTENCE_CONSUMPTION_BOUNDARY' as const;

/**
 * Read-only rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_READ_ONLY_RULE =
  'SERVER_MEMBER_ACTION_DISCOVERY_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Member-scope rule.
 *
 * The member identifier scopes persistence discovery only.
 * Its presence does not establish ownership or authorization.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_SCOPE_RULE =
  'MEMBER_ACTION_DISCOVERY_SCOPE_IS_NOT_OWNERSHIP_OR_AUTHORIZATION_PROOF' as const;

/**
 * Existing-domain rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_DOMAIN_RULE =
  'SERVER_MEMBER_ACTION_DISCOVERY_PRESERVES_CERTIFIED_ACTION_DOMAIN' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_EXPOSURE_RULE =
  'SERVER_MEMBER_ACTION_DISCOVERY_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Lifecycle-authority rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_LIFECYCLE_RULE =
  'SERVER_MEMBER_ACTION_DISCOVERY_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Entitlement rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_ENTITLEMENT_RULE =
  'READING_MEMBER_ACTIONS_IS_NOT_ENTITLEMENT_PROOF' as const;

/**
 * External-completion rule.
 */
export const TRUST_CLUB_MEMBER_ACTION_DISCOVERY_EXTERNAL_RULE =
  'READING_MEMBER_ACTIONS_IS_NOT_PROOF_OF_EXTERNAL_COMPLETION' as const;