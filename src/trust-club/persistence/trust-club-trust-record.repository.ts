import type {
  TrustClubTrustRecord,
} from '../domain/trust-club-trust-record.contracts';

import type {
  TrustClubPersistenceResult,
} from './trust-club-action.repository';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R28
 * Canonical Trust Member Read Repository Boundary
 *
 * Purpose:
 * Defines persistence operations for established canonical
 * Trust records independently from Action lifecycle persistence.
 *
 * The repository supports:
 * - persistence of an already-established Canonical Trust Record;
 * - lookup by Canonical Trust ID;
 * - lookup by formation Action ID;
 * - lookup of established Canonical Trust Records belonging
 *   to one Trust Club Member.
 *
 * This repository does NOT:
 * - control Action lifecycle;
 * - determine whether formation is complete;
 * - authorize Trust creation;
 * - authenticate users;
 * - resolve an authenticated User to a Trust Club Member;
 * - establish Trust ownership;
 * - select database technology;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export interface TrustClubTrustRecordRepository {
  saveTrustRecord(
    record:
      TrustClubTrustRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubTrustRecord
    >
  >;

  findByTrustId(
    trustId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  >;

  findByFormationActionId(
    formationActionId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  >;

  findByMemberId(
    memberId:
      string,
  ): Promise<
    TrustClubTrustRecord[]
  >;
}

export const TRUST_CLUB_TRUST_REGISTRY_DOMAIN_RULE =
  'CANONICAL_TRUST_REGISTRY_USES_TRUST_RECORD_DOMAIN' as const;

export const TRUST_CLUB_TRUST_REGISTRY_LIFECYCLE_RULE =
  'CANONICAL_TRUST_REGISTRY_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_TRUST_REGISTRY_TECHNOLOGY_RULE =
  'CANONICAL_TRUST_REGISTRY_REPOSITORY_IS_TECHNOLOGY_NEUTRAL' as const;

export const TRUST_CLUB_TRUST_REGISTRY_FORMATION_UNIQUENESS_RULE =
  'ONE_CANONICAL_TRUST_RECORD_PER_FORMATION_ACTION' as const;

/**
 * Member-read rule.
 *
 * A Canonical Trust Record already carries its Trust Club
 * Member identity through memberId. Member lookup exposes
 * that existing canonical relationship and does not create
 * or infer a new ownership relationship.
 */
export const TRUST_CLUB_TRUST_REGISTRY_MEMBER_READ_RULE =
  'CANONICAL_TRUST_MEMBER_LOOKUP_USES_EXISTING_MEMBER_ID_RELATIONSHIP' as const;

/**
 * Member-cardinality rule.
 *
 * One Canonical Trust belongs to exactly one Trust Club Member.
 * The repository does not impose the inverse restriction that
 * one Member may own only one Canonical Trust.
 */
export const TRUST_CLUB_TRUST_REGISTRY_MEMBER_CARDINALITY_RULE =
  'ONE_CANONICAL_TRUST_HAS_ONE_MEMBER_WITHOUT_IMPOSING_ONE_TRUST_PER_MEMBER' as const;

/**
 * Authentication-boundary rule.
 *
 * Repository member lookup consumes an already-resolved memberId.
 * It does not authenticate a User or resolve User identity.
 */
export const TRUST_CLUB_TRUST_REGISTRY_MEMBER_AUTHENTICATION_RULE =
  'CANONICAL_TRUST_REPOSITORY_DOES_NOT_RESOLVE_AUTHENTICATED_USER_IDENTITY' as const;