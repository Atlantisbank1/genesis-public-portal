import type {
  TrustClubStandardTrustPrintableFormationRecord,
  TrustClubStandardTrustPrintableMembershipRecord,
  TrustClubStandardTrustPrintableRecord,
} from './trust-club-standard-trust-printable-record.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 8.2
 *
 * Printable Standard Trust Record Service
 *
 * Pure read-only projection operation.
 *
 * This service receives already-authoritative formation
 * and membership records and projects them into the
 * printable Standard Trust record contract.
 *
 * It does not:
 *
 * - read from Prisma;
 * - write to Prisma;
 * - create database state;
 * - mutate formation state;
 * - mutate membership state;
 * - transition Action lifecycle state;
 * - process or verify payment;
 * - infer service validity;
 * - call external services;
 * - access Atlantis.
 */
export class TrustClubStandardTrustPrintableRecordService {
  project(
    formation:
      TrustClubStandardTrustPrintableFormationRecord,

    membership:
      TrustClubStandardTrustPrintableMembershipRecord,

    generatedAt:
      Date = new Date(),
  ): TrustClubStandardTrustPrintableRecord {
    if (formation.formationStatus !== 'COMPLETE') {
      throw new Error(
        'Printable Standard Trust record requires COMPLETE formation.',
      );
    }

    return {
      documentType:
        'STANDARD_TRUST_FORMATION_RECORD',

      documentVersion:
        '1.0',

      generatedAt,

      formation:
        {
          ...formation,
        },

      membership:
        {
          ...membership,
        },

      serviceValidity:
        {
          status:
            'NOT_YET_ESTABLISHED',

          validFrom:
            null,

          validUntil:
            null,

          paymentStatus:
            null,

          paymentReference:
            null,

          paidAt:
            null,
        },
    };
  }
}

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_PROJECTION_RULE =
  'PURE_READ_ONLY_PROJECTION' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_COMPLETION_GATE =
  'FORMATION_STATUS_MUST_BE_COMPLETE' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_VALIDITY_PROJECTION_RULE =
  'NO_SERVICE_VALIDITY_INFERENCE' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_PROJECTION_WRITE_RULE =
  'NO_DATABASE_OR_LIFECYCLE_WRITE' as const;