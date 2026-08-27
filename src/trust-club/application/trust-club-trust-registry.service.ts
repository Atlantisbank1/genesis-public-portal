import type {
  TrustClubTrustRecord,
} from '../domain/trust-club-trust-record.contracts';

import type {
  TrustClubPersistenceResult,
} from '../persistence/trust-club-action.repository';

import type {
  TrustClubTrustRecordRepository,
} from '../persistence/trust-club-trust-record.repository';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R28
 * Canonical Trust Member Read Application Service
 *
 * Purpose:
 * Defines application-layer persistence orchestration for
 * established Canonical Trust Records.
 *
 * This service:
 * - depends only on the Canonical Trust Registry repository boundary;
 * - persists an already-established Canonical Trust Record;
 * - reads an existing Canonical Trust Record by trustId;
 * - reads an existing Canonical Trust Record by formationActionId;
 * - reads Canonical Trust Records belonging to one Trust Club Member;
 * - preserves the certified Canonical Trust Record domain representation.
 *
 * Member lookup consumes an already-resolved memberId.
 *
 * This service does NOT:
 * - authenticate users;
 * - resolve authenticated User identity;
 * - resolve User ID to Member ID;
 * - determine whether a Trust has been established;
 * - infer Action completion;
 * - control Action lifecycle;
 * - transition Action state;
 * - create Action Outcomes;
 * - allocate Canonical Trust IDs;
 * - authorize Trust formation;
 * - verify external completion;
 * - select a database technology;
 * - access Prisma directly;
 * - create database schemas;
 * - create migrations;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export class TrustClubTrustRegistryService {
  constructor(
    private readonly repository:
      TrustClubTrustRecordRepository,
  ) {}

  async saveTrustRecord(
    record:
      TrustClubTrustRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubTrustRecord
    >
  > {
    return this.repository.saveTrustRecord(
      record,
    );
  }

  async findTrustRecord(
    trustId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  > {
    return this.repository.findByTrustId(
      trustId,
    );
  }

  async findTrustRecordByFormationActionId(
    formationActionId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  > {
    return this.repository.findByFormationActionId(
      formationActionId,
    );
  }

  async findTrustRecordsByMemberId(
    memberId:
      string,
  ): Promise<
    TrustClubTrustRecord[]
  > {
    return this.repository.findByMemberId(
      memberId,
    );
  }
}

/**
 * Repository-boundary rule.
 *
 * Canonical Trust Registry application persistence accesses
 * persistence only through the certified Trust Record repository.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_PERSISTENCE_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_USES_TRUST_RECORD_REPOSITORY_BOUNDARY' as const;

/**
 * Domain-preservation rule.
 *
 * Application persistence consumes and returns the certified
 * Canonical Trust Record domain representation without redefining it.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_DOMAIN_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_PRESERVES_TRUST_RECORD_DOMAIN' as const;

/**
 * Member-read rule.
 *
 * Application-level member lookup uses the memberId already
 * stored on Canonical Trust Records.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_MEMBER_READ_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_READS_TRUSTS_BY_EXISTING_MEMBER_ID' as const;

/**
 * Member-cardinality rule.
 *
 * The application service returns a collection because the
 * Canonical Trust domain does not impose one Trust per Member.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_MEMBER_CARDINALITY_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_SUPPORTS_MULTIPLE_TRUSTS_PER_MEMBER' as const;

/**
 * Authentication-boundary rule.
 *
 * Member lookup consumes an already-resolved memberId and does
 * not authenticate users or resolve User identity.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_MEMBER_AUTHENTICATION_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_DOES_NOT_RESOLVE_AUTHENTICATED_USER_IDENTITY' as const;

/**
 * Lifecycle-authority rule.
 *
 * Canonical Trust Registry persistence does not determine or control
 * the lifecycle state of the formation Action.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_LIFECYCLE_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;

/**
 * Establishment-authority rule.
 *
 * Receiving a Trust Record for persistence does not authorize,
 * infer, or establish Trust formation.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_ESTABLISHMENT_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_DOES_NOT_ESTABLISH_TRUST' as const;

/**
 * Identity-authority rule.
 *
 * Canonical Trust IDs must already have been allocated by the
 * certified formation completion authority before persistence.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_IDENTITY_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_DOES_NOT_ALLOCATE_TRUST_ID' as const;

/**
 * Technology-neutrality rule.
 *
 * Application persistence remains unaware of the concrete adapter
 * and database technology implementing the repository.
 */
export const TRUST_CLUB_TRUST_REGISTRY_APPLICATION_TECHNOLOGY_RULE =
  'CANONICAL_TRUST_REGISTRY_APPLICATION_IS_ADAPTER_NEUTRAL' as const;