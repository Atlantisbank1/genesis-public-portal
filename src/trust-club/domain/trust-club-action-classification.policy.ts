import type {
  TrustClubActionClassification,
  TrustClubActionType,
} from './trust-club-domain.contracts';

const ACTION_CLASSIFICATIONS:
  Readonly<
    Record<
      TrustClubActionType,
      TrustClubActionClassification
    >
  > = {
  CREATE_STANDARD_TRUST: {
    actionType: 'CREATE_STANDARD_TRUST',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  VIEW_TRUST: {
    actionType: 'VIEW_TRUST',
    actionClass: 'CLASS_A_INTERNAL',
    consentRequired: false,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  UPDATE_STANDARD_RECORD: {
    actionType: 'UPDATE_STANDARD_RECORD',
    actionClass: 'CLASS_A_INTERNAL',
    consentRequired: false,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  ADD_ASSET: {
    actionType: 'ADD_ASSET',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  REMOVE_ASSET: {
    actionType: 'REMOVE_ASSET',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  ACCEPT_CONTRIBUTION: {
    actionType: 'ACCEPT_CONTRIBUTION',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  RECORD_INCOME: {
    actionType: 'RECORD_INCOME',
    actionClass: 'CLASS_A_INTERNAL',
    consentRequired: false,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  RECORD_EXPENSE: {
    actionType: 'RECORD_EXPENSE',
    actionClass: 'CLASS_A_INTERNAL',
    consentRequired: false,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  MAKE_DISTRIBUTION: {
    actionType: 'MAKE_DISTRIBUTION',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  CREATE_TRUSTEE_RESOLUTION: {
    actionType: 'CREATE_TRUSTEE_RESOLUTION',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: false,
    externalCompletionMayBeRequired: false,
  },

  ADD_BENEFICIARY: {
    actionType: 'ADD_BENEFICIARY',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: false,
  },

  CHANGE_BENEFICIARY: {
    actionType: 'CHANGE_BENEFICIARY',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: false,
  },

  CHANGE_TRUSTEE: {
    actionType: 'CHANGE_TRUSTEE',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  CHANGE_PROTECTOR: {
    actionType: 'CHANGE_PROTECTOR',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  ENTER_CONTRACT: {
    actionType: 'ENTER_CONTRACT',
    actionClass: 'CLASS_B_FORMAL_TRUST_ACTION',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  MAKE_INVESTMENT: {
    actionType: 'MAKE_INVESTMENT',
    actionClass: 'CLASS_D_PROFESSIONAL_REVIEW',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  AMEND_TRUST: {
    actionType: 'AMEND_TRUST',
    actionClass: 'CLASS_D_PROFESSIONAL_REVIEW',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  REQUEST_BANKING_ACTIVATION: {
    actionType: 'REQUEST_BANKING_ACTIVATION',
    actionClass: 'CLASS_C_EXTERNAL_INTERFACE',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  REQUEST_EXTERNAL_IDENTIFICATION: {
    actionType: 'REQUEST_EXTERNAL_IDENTIFICATION',
    actionClass: 'CLASS_C_EXTERNAL_INTERFACE',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },

  REQUEST_PROFESSIONAL_REVIEW: {
    actionType: 'REQUEST_PROFESSIONAL_REVIEW',
    actionClass: 'CLASS_D_PROFESSIONAL_REVIEW',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: false,
  },

  REQUEST_TRUST_TERMINATION: {
    actionType: 'REQUEST_TRUST_TERMINATION',
    actionClass: 'CLASS_D_PROFESSIONAL_REVIEW',
    consentRequired: true,
    professionalReviewMayBeRequired: true,
    externalCompletionMayBeRequired: true,
  },
};

export function classifyTrustClubAction(
  actionType:
    TrustClubActionType,
): TrustClubActionClassification {
  return ACTION_CLASSIFICATIONS[
    actionType
  ];
}

export function trustClubActionMayRequireExternalCompletion(
  actionType:
    TrustClubActionType,
): boolean {
  return classifyTrustClubAction(
    actionType
  ).externalCompletionMayBeRequired;
}

export function trustClubActionRequiresConsent(
  actionType:
    TrustClubActionType,
): boolean {
  return classifyTrustClubAction(
    actionType
  ).consentRequired;
}

export function trustClubActionMayRequireProfessionalReview(
  actionType:
    TrustClubActionType,
): boolean {
  return classifyTrustClubAction(
    actionType
  ).professionalReviewMayBeRequired;
}