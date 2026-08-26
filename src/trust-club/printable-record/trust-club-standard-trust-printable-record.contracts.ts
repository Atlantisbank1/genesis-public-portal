/**
 * TRUST-CLUB-V1
 * PHASE 8.2
 *
 * Printable Standard Trust Record Contracts
 *
 * Purpose:
 *
 * Defines the read-only document projection boundary for a
 * completed Standard Trust formation.
 *
 * This contract does NOT:
 *
 * - create a Trust;
 * - complete a Trust formation;
 * - transition Action lifecycle state;
 * - write formation data;
 * - mutate Membership;
 * - process payment;
 * - verify payment;
 * - create billing records;
 * - create subscription periods;
 * - infer payment validity;
 * - infer legal validity from Membership status;
 * - create database state;
 * - access Atlantis;
 * - perform external execution.
 *
 * Formation authority:
 *
 * TrustClubStandardTrustFormation
 * +
 * certified CREATE_STANDARD_TRUST Action status COMPLETE.
 *
 * Membership authority:
 *
 * TrustClubMember.
 *
 * Payment/service-period authority:
 *
 * NOT YET ESTABLISHED.
 *
 * No expiry, paid-through, billing-period, payment-reference,
 * or payment-verification source currently exists in the
 * certified Trust Club schema.
 */

export type TrustClubPrintableRecordFormationStatus =
  | 'COMPLETE';

export type TrustClubPrintableRecordMembershipStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'GRACE'
  | 'SUSPENDED'
  | 'TERMINATED'
  | 'UNKNOWN';

export type TrustClubPrintableRecordSubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'GRACE'
  | 'SUSPENDED'
  | 'TERMINATED'
  | 'UNKNOWN';

export type TrustClubPrintableRecordServiceValidityStatus =
  | 'NOT_YET_ESTABLISHED';

export interface TrustClubStandardTrustPrintableFormationRecord {
  actionId:
    string;

  formationStatus:
    TrustClubPrintableRecordFormationStatus;

  trustName:
    string | null;

  trustPurpose:
    string | null;

  settlorName:
    string | null;

  trusteeName:
    string | null;

  beneficiaryName:
    string | null;

  protectorName:
    string | null;

  initialPropertyDescription:
    string | null;

  formationCreatedAt:
    Date;

  formationUpdatedAt:
    Date;
}

export interface TrustClubStandardTrustPrintableMembershipRecord {
  memberId:
    string;

  status:
    TrustClubPrintableRecordMembershipStatus;

  subscriptionStatus:
    TrustClubPrintableRecordSubscriptionStatus;

  planCode:
    string;

  activatedAt:
    Date | null;
}

export interface TrustClubStandardTrustPrintableServiceValidity {
  status:
    TrustClubPrintableRecordServiceValidityStatus;

  validFrom:
    null;

  validUntil:
    null;

  paymentStatus:
    null;

  paymentReference:
    null;

  paidAt:
    null;
}

export interface TrustClubStandardTrustPrintableRecord {
  documentType:
    'STANDARD_TRUST_FORMATION_RECORD';

  documentVersion:
    '1.0';

  generatedAt:
    Date;

  formation:
    TrustClubStandardTrustPrintableFormationRecord;

  membership:
    TrustClubStandardTrustPrintableMembershipRecord;

  serviceValidity:
    TrustClubStandardTrustPrintableServiceValidity;
}

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_BOUNDARY =
  'READ_ONLY_CERTIFIED_FORMATION_PROJECTION' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_FORMATION_RULE =
  'CREATE_STANDARD_TRUST_ACTION_MUST_BE_COMPLETE' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_FORMATION_AUTHORITY =
  'TRUST_CLUB_STANDARD_TRUST_FORMATION_PLUS_CERTIFIED_ACTION_STATUS' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_MEMBERSHIP_AUTHORITY =
  'TRUST_CLUB_MEMBER' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_SERVICE_VALIDITY_RULE =
  'SERVICE_VALIDITY_NOT_YET_ESTABLISHED' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_PAYMENT_RULE =
  'NO_PAYMENT_PROCESSING_OR_PAYMENT_VERIFICATION' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_WRITE_RULE =
  'NO_DATABASE_OR_LIFECYCLE_WRITE' as const;

export const
TRUST_CLUB_STANDARD_TRUST_PRINTABLE_RECORD_EXTERNAL_EXECUTION_RULE =
  'NO_EXTERNAL_EXECUTION' as const;