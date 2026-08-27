/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R15
 * Canonical Trust Record Domain Contract
 *
 * Purpose:
 * Defines the technology-neutral representation of one
 * established Trust Club Trust.
 *
 * A Canonical Trust Record:
 * - identifies one established Trust;
 * - references exactly one formation Action;
 * - belongs to one Trust Club Member;
 * - records the certified Trust type;
 * - records when the Trust became established.
 *
 * This contract does NOT:
 * - establish a Trust by itself;
 * - perform Action lifecycle transitions;
 * - authorize Trust formation;
 * - authenticate users;
 * - infer completion;
 * - access Prisma;
 * - write database state;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export type TrustClubTrustType =
  'STANDARD_TRUST';

export interface TrustClubTrustRecord {
  trustId:
    string;

  formationActionId:
    string;

  memberId:
    string;

  trustType:
    TrustClubTrustType;

  establishedAt:
    Date;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export const TRUST_CLUB_TRUST_RECORD_IDENTITY_RULE =
  'CANONICAL_TRUST_ID_IDENTIFIES_ONE_ESTABLISHED_TRUST' as const;

export const TRUST_CLUB_TRUST_RECORD_FORMATION_RULE =
  'CANONICAL_TRUST_REFERENCES_ONE_FORMATION_ACTION' as const;

export const TRUST_CLUB_TRUST_RECORD_MEMBER_RULE =
  'CANONICAL_TRUST_BELONGS_TO_ONE_TRUST_CLUB_MEMBER' as const;

export const TRUST_CLUB_TRUST_RECORD_PERSISTENCE_RULE =
  'DOMAIN_RECORD_EXISTENCE_IS_NOT_PERSISTENCE_PROOF' as const;
