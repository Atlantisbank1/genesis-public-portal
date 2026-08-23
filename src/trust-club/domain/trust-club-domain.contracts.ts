/**
 * TRUST-CLUB-V1
 *
 * Domain Contract Baseline
 *
 * Purpose:
 * Defines the controlled vocabulary and state boundaries used by
 * Genesis Trust Club.
 *
 * This file contains domain contracts only.
 *
 * It does NOT:
 * - access a database;
 * - perform authentication;
 * - perform authorization;
 * - execute payments;
 * - access Atlantis;
 * - create or modify a Trust;
 * - perform banking activity;
 * - perform external registration;
 * - provide legal, tax, accounting, or investment services.
 */

export type TrustClubMemberStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'GRACE'
  | 'SUSPENDED'
  | 'CANCELLED';

export type TrustClubSubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'GRACE'
  | 'SUSPENDED'
  | 'CANCELLED';

export type TrustClubTrustStatus =
  | 'DRAFT'
  | 'FORMATION_PENDING'
  | 'ACTIVE'
  | 'SUSPENDED_ADMINISTRATION'
  | 'TERMINATION_PENDING'
  | 'TERMINATED';

export type TrustClubRole =
  | 'SETTLOR'
  | 'TRUSTEE'
  | 'BENEFICIARY'
  | 'PROTECTOR'
  | 'AUTHORIZED_REPRESENTATIVE';

export type TrustClubSystemRole =
  | 'TRUST_CLUB_ADMIN';

export type TrustClubAssetStatus =
  | 'DECLARED'
  | 'INTERNAL_RECORDED'
  | 'EXTERNAL_TRANSFER_PENDING'
  | 'EXTERNAL_TRANSFER_CONFIRMED'
  | 'REMOVED'
  | 'DISTRIBUTED';

export type TrustClubDocumentStatus =
  | 'DRAFT'
  | 'PENDING_ACCEPTANCE'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'REVOKED'
  | 'ARCHIVED';

export type TrustClubConsentStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'SUPERSEDED';

export type TrustClubActionClass =
  | 'CLASS_A_INTERNAL'
  | 'CLASS_B_FORMAL_TRUST_ACTION'
  | 'CLASS_C_EXTERNAL_INTERFACE'
  | 'CLASS_D_PROFESSIONAL_REVIEW';

export type TrustClubActionType =
  | 'CREATE_STANDARD_TRUST'
  | 'VIEW_TRUST'
  | 'UPDATE_STANDARD_RECORD'
  | 'ADD_ASSET'
  | 'REMOVE_ASSET'
  | 'ACCEPT_CONTRIBUTION'
  | 'RECORD_INCOME'
  | 'RECORD_EXPENSE'
  | 'MAKE_DISTRIBUTION'
  | 'CREATE_TRUSTEE_RESOLUTION'
  | 'ADD_BENEFICIARY'
  | 'CHANGE_BENEFICIARY'
  | 'CHANGE_TRUSTEE'
  | 'CHANGE_PROTECTOR'
  | 'ENTER_CONTRACT'
  | 'MAKE_INVESTMENT'
  | 'AMEND_TRUST'
  | 'REQUEST_BANKING_ACTIVATION'
  | 'REQUEST_EXTERNAL_IDENTIFICATION'
  | 'REQUEST_PROFESSIONAL_REVIEW'
  | 'REQUEST_TRUST_TERMINATION';

export type TrustClubActionStatus =
  | 'DRAFT'
  | 'DISCLOSURE_REQUIRED'
  | 'CONSENT_REQUIRED'
  | 'READY'
  | 'PENDING_REVIEW'
  | 'AUTHORIZED'
  | 'IN_PROGRESS'
  | 'INTERNAL_COMPLETE'
  | 'EXTERNAL_PENDING'
  | 'COMPLETE'
  | 'REJECTED'
  | 'CANCELLED';

export type TrustClubPaymentMethod =
  | 'CASH'
  | 'FIAT_TRANSFER'
  | 'CARD'
  | 'CRYPTO'
  | 'SUSDC';

export type TrustClubPaymentStatus =
  | 'PENDING'
  | 'EVIDENCE_RECEIVED'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'PAID'
  | 'REJECTED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type TrustClubReviewReason =
  | 'IDENTITY_CONFLICT'
  | 'TRUST_AUTHORITY_CONFLICT'
  | 'CUSTOM_AMENDMENT'
  | 'BANK_REJECTION'
  | 'PROFESSIONAL_TRIGGER'
  | 'UNUSUAL_ASSET'
  | 'PAYMENT_EXCEPTION'
  | 'DOCUMENT_INCONSISTENCY'
  | 'EXTERNAL_REQUIREMENT_UNCLEAR';

export type TrustClubEntitlement =
  | 'TRUST_CREATE_STANDARD'
  | 'TRUST_VIEW'
  | 'TRUST_DOCUMENTS_STANDARD'
  | 'TRUST_REGISTRY_RECORD'
  | 'TRUST_SELF_MANAGEMENT_TOOLBOX'
  | 'TRUST_STANDARD_MAINTENANCE'
  | 'TRUST_ASSET_REGISTER_VIEW'
  | 'TRUST_ASSET_REGISTER_UPDATE'
  | 'TRUST_STANDARD_RESOLUTIONS'
  | 'TRUST_STANDARD_ROLE_RECORDS'
  | 'TRUST_STANDARD_CHANGE_REQUESTS'
  | 'BANKING_DIY_PACK'
  | 'BANKING_ASSISTED'
  | 'EXTERNAL_IDENTIFICATION_ASSISTED'
  | 'PROFESSIONAL_REVIEW'
  | 'ADDITIONAL_MEMBER'
  | 'ADDITIONAL_TRUST';

export interface TrustClubAuthorizationContext {
  authenticatedUserId: string;

  memberId: string;

  trustId?: string;

  trustRoles: readonly TrustClubRole[];

  systemRoles: readonly TrustClubSystemRole[];

  entitlements: readonly TrustClubEntitlement[];

  subscriptionStatus:
    TrustClubSubscriptionStatus;
}

export interface TrustClubPermissionDecision {
  allowed: boolean;

  reason:
    | 'ALLOWED'
    | 'AUTHENTICATION_REQUIRED'
    | 'MEMBERSHIP_REQUIRED'
    | 'TRUST_RELATIONSHIP_REQUIRED'
    | 'ROLE_NOT_AUTHORIZED'
    | 'ENTITLEMENT_REQUIRED'
    | 'SUBSCRIPTION_NOT_ACTIVE'
    | 'CONSENT_REQUIRED'
    | 'PROFESSIONAL_REVIEW_REQUIRED'
    | 'EXTERNAL_REQUIREMENT_PENDING';
}

export interface TrustClubActionClassification {
  actionType:
    TrustClubActionType;

  actionClass:
    TrustClubActionClass;

  consentRequired:
    boolean;

  professionalReviewMayBeRequired:
    boolean;

  externalCompletionMayBeRequired:
    boolean;
}

/**
 * Fundamental Trust Club boundary.
 *
 * Authentication proves identity only.
 *
 * Authentication does not, by itself, authorize access
 * to a Trust or authorize a Trust action.
 *
 * Authorization must consider:
 *
 * 1. authenticated identity;
 * 2. Trust Club membership;
 * 3. relationship to the relevant Trust;
 * 4. role within that Trust;
 * 5. subscription status;
 * 6. purchased entitlement;
 * 7. action-specific requirements;
 * 8. required disclosure / consent;
 * 9. professional or external requirements where applicable.
 */
export const TRUST_CLUB_AUTHORIZATION_RULE =
  'IDENTITY_PLUS_RELATIONSHIP_PLUS_ROLE_PLUS_ENTITLEMENT_PLUS_ACTION_REQUIREMENTS' as const;

/**
 * Fundamental financial boundary.
 *
 * Trust Club membership billing and Trust financial activity
 * are separate domains.
 *
 * A membership payment:
 * - pays for Trust Club services;
 * - may activate subscription entitlements after verification;
 * - is not automatically a Trust contribution;
 * - is not automatically Trust property;
 * - does not authorize financial execution.
 */
export const TRUST_CLUB_MEMBERSHIP_PAYMENT_RULE =
  'MEMBERSHIP_PAYMENT_IS_NOT_TRUST_FINANCIAL_ACTIVITY' as const;

/**
 * Fundamental asset boundary.
 *
 * Recording an asset in the Trust Club Asset Register
 * does not, by itself, prove that any external legal-title
 * transfer or registration requirement has been completed.
 */
export const TRUST_CLUB_ASSET_RECORDING_RULE =
  'INTERNAL_ASSET_RECORDING_IS_NOT_EXTERNAL_TITLE_TRANSFER' as const;

/**
 * Fundamental external-action boundary.
 *
 * Trust Club may prepare, document, support, or record an
 * external action when included in an applicable service.
 *
 * Approval or completion controlled by a bank, government
 * authority, registry, professional, counterparty, payment
 * network, or other third party is not created merely by an
 * internal Trust Club action.
 */
export const TRUST_CLUB_EXTERNAL_ACTION_RULE =
  'INTERNAL_COMPLETION_IS_NOT_EXTERNAL_COMPLETION' as const;

/**
 * Fundamental administration boundary.
 *
 * Trust Club administration / maintenance means controlled
 * administrative record maintenance and the services
 * expressly included in the applicable Membership Plan.
 *
 * It does not automatically mean:
 * - trustee decision-making;
 * - investment management;
 * - accounting;
 * - tax filing;
 * - legal representation;
 * - asset custody;
 * - banking execution;
 * - payment execution;
 * - external registration.
 */
export const TRUST_CLUB_MAINTENANCE_RULE =
  'MAINTENANCE_IS_LIMITED_TO_EXPRESSLY_INCLUDED_ADMINISTRATIVE_SERVICES' as const;