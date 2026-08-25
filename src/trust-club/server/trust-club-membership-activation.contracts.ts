export type TrustClubMembershipActivationResult = {
  memberId:
    string;

  userId:
    string;

  status:
    'ACTIVE';

  subscriptionStatus:
    'ACTIVE';

  planCode:
    string;

  activatedAt:
    Date;
};

/**
 * TRUST-CLUB-V1
 * PHASE 7.4
 *
 * Administrative Membership Activation Contracts
 *
 * Purpose:
 *
 * Defines the result and invariant boundary for the explicit
 * administrative activation of an already-established
 * Trust Club Membership.
 *
 * Approved transition:
 *
 * PENDING Membership
 * +
 * PENDING Subscription
 * ->
 * ACTIVE Membership
 * +
 * ACTIVE Subscription
 *
 * Administrative authority is not caller supplied.
 *
 * The authenticated administrator identity is resolved through
 * the existing certified Trust Club Admin Review Authorization
 * boundary.
 *
 * This contract does NOT:
 * - authenticate credentials independently;
 * - accept caller-supplied administrative identity;
 * - grant TRUST_CLUB_ADMIN;
 * - create Membership;
 * - create Eligibility;
 * - decide Eligibility;
 * - process payment;
 * - verify payment;
 * - create an external subscription;
 * - create a Trust;
 * - authorize Trust formation;
 * - access Atlantis;
 * - execute banking activity.
 */

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_BOUNDARY =
  'ADMINISTRATIVE_MEMBERSHIP_ACTIVATION_ONLY' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_ELIGIBILITY_RULE =
  'TARGET_USER_MUST_ALREADY_BE_ELIGIBLE' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_EXISTENCE_RULE =
  'MEMBERSHIP_MUST_ALREADY_EXIST' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_SOURCE_STATE_RULE =
  'MEMBERSHIP_AND_SUBSCRIPTION_MUST_BOTH_BE_PENDING' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_TARGET_STATE_RULE =
  'MEMBERSHIP_AND_SUBSCRIPTION_BECOME_ACTIVE_TOGETHER' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_ADMIN_AUTHORITY_RULE =
  'ADMINISTRATIVE_AUTHORITY_IS_DERIVED_FROM_CERTIFIED_TRUST_CLUB_ADMIN_AUTHORIZATION' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_CALLER_AUTHORITY_RULE =
  'CALLER_SUPPLIED_ADMINISTRATIVE_IDENTITY_IS_NOT_ACCEPTED' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_TIMESTAMP_RULE =
  'ACTIVATED_AT_IS_SERVER_GENERATED' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_PAYMENT_RULE =
  'NO_PAYMENT_PROCESSING_OR_PAYMENT_VERIFICATION' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_TRUST_RULE =
  'ACTIVATION_DOES_NOT_CREATE_OR_AUTHORIZE_A_TRUST' as const;