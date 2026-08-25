import type {
  TrustClubEligibilityReasonCode,
  TrustClubEligibilityStatus,
} from '@/generated/prisma/enums';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from './trust-club-server-application-entry.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 7.3
 *
 * Administrative Eligibility Decision Contracts
 *
 * Purpose:
 *
 * Defines the narrow administrative decision boundary used to
 * transition an existing Trust Club Eligibility record from
 * REVIEW_REQUIRED to either:
 *
 * - ELIGIBLE; or
 * - RESTRICTED.
 *
 * Administrative authority is not caller supplied.
 *
 * The authenticated reviewer identity is derived exclusively
 * from the existing certified Trust Club Admin Review
 * Authorization boundary.
 *
 * This contract does NOT:
 * - authenticate credentials independently;
 * - accept caller-supplied admin identity;
 * - grant TRUST_CLUB_ADMIN;
 * - create users;
 * - create Membership;
 * - activate Membership;
 * - activate subscriptions;
 * - grant Trust roles;
 * - authorize Trust actions;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity.
 */

export type TrustClubEligibilityDecisionStatus =
  Extract<
    TrustClubEligibilityStatus,
    'ELIGIBLE' |
    'RESTRICTED'
  >;

export interface TrustClubEligibilityDecisionInput {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  targetUserId:
    string;

  decision:
    TrustClubEligibilityDecisionStatus;

  reasonCode?:
    TrustClubEligibilityReasonCode | null;

  internalCaseReference?:
    string | null;

  internalNotes?:
    string | null;
}

export interface TrustClubEligibilityDecisionResult {
  eligibilityId:
    string;

  userId:
    string;

  status:
    TrustClubEligibilityDecisionStatus;

  reasonCode:
    TrustClubEligibilityReasonCode | null;

  internalCaseReference:
    string | null;

  internalNotes:
    string | null;

  effectiveAt:
    Date;

  reviewedBy:
    string;

  reviewedAt:
    Date;

  liftedAt:
    Date | null;
}

export const TRUST_CLUB_ELIGIBILITY_DECISION_SOURCE_STATUS_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_REQUIRES_REVIEW_REQUIRED_SOURCE_STATUS' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_TARGET_STATUS_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_TARGET_IS_ELIGIBLE_OR_RESTRICTED' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_ADMIN_AUTHORITY_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_REQUIRES_CERTIFIED_TRUST_CLUB_ADMIN_AUTHORIZATION' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_CALLER_AUTHORITY_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_DOES_NOT_ACCEPT_CALLER_SUPPLIED_ADMIN_IDENTITY' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_MEMBERSHIP_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_DOES_NOT_CREATE_OR_ACTIVATE_MEMBERSHIP' as const;

export const TRUST_CLUB_ELIGIBILITY_DECISION_AUTHENTICATION_RULE =
  'ADMINISTRATIVE_ELIGIBILITY_DECISION_DOES_NOT_REPLACE_BETTER_AUTH_AUTHENTICATION_AUTHORITY' as const;