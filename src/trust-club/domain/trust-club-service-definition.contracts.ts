import type {
  TrustClubActionType,
  TrustClubEntitlement,
} from './trust-club-domain.contracts';

export type TrustClubServiceDependency =
  | 'NONE'
  | 'MEMBER_INFORMATION'
  | 'MEMBER_SIGNATURE'
  | 'TRUSTEE_AUTHORITY'
  | 'BANK'
  | 'TAX_AUTHORITY'
  | 'GOVERNMENT_REGISTRY'
  | 'NOTARY'
  | 'TRANSLATOR'
  | 'ACCOUNTANT'
  | 'TAX_ADVISER'
  | 'LAWYER'
  | 'VALUER'
  | 'CUSTODIAN'
  | 'PAYMENT_NETWORK'
  | 'OTHER_EXTERNAL_PARTY';

export interface TrustClubPlainLanguageDefinition {
  term: string;

  meaning: string;

  purpose: string;

  whatTrustClubDoes:
    readonly string[];

  whatMemberReceives:
    readonly string[];

  memberResponsibilities:
    readonly string[];

  includedInBaseMembership:
    boolean;

  requiredEntitlement?:
    TrustClubEntitlement;

  serviceEndsWhen:
    string;

  notIncluded:
    readonly string[];

  optionalAddOns:
    readonly string[];

  thirdPartyDependencies:
    readonly TrustClubServiceDependency[];

  externalOutcomeNotGuaranteed:
    boolean;

  externalOutcomeExplanation?:
    string;

  plainLanguageExample:
    string;
}

export interface TrustClubActionDisclosure {
  actionType:
    TrustClubActionType;

  title: string;

  shortExplanation: string;

  whatThisActionDoes:
    readonly string[];

  whatThisActionDoesNotDo:
    readonly string[];

  memberMustConfirm:
    readonly string[];

  additionalCostMayApply:
    boolean;

  thirdPartyMayBeRequired:
    boolean;

  professionalReviewMayBeRequired:
    boolean;

  externalCompletionMayBeRequired:
    boolean;
}

/**
 * Definition standard.
 *
 * Every Trust Club service must explain:
 *
 * 1. what the term means;
 * 2. why the service exists;
 * 3. exactly what Trust Club performs;
 * 4. exactly what the Member receives;
 * 5. what the Member must provide or perform;
 * 6. whether the service is included in the base membership;
 * 7. exactly where the service ends;
 * 8. what is not included;
 * 9. what may be purchased separately;
 * 10. which third parties may be involved;
 * 11. which external result is outside Trust Club control;
 * 12. a plain-language example.
 *
 * No service may be represented as included merely because
 * it may be useful, customary, or necessary for a Trust.
 */
export const TRUST_CLUB_SERVICE_DEFINITION_RULE =
  'ONLY_EXPRESSLY_LISTED_SERVICES_ARE_INCLUDED' as const;

/**
 * Third-party outcome rule.
 *
 * Trust Club may provide preparation, documentation,
 * administrative support, workflow assistance, or
 * application assistance when expressly included.
 *
 * A third party remains responsible for decisions and
 * outcomes controlled by that third party.
 */
export const TRUST_CLUB_THIRD_PARTY_OUTCOME_RULE =
  'ASSISTANCE_IS_NOT_THIRD_PARTY_APPROVAL' as const;

/**
 * Plain-language disclosure rule.
 *
 * Before a Member authorizes a material action, the system
 * must present an understandable explanation of:
 *
 * - what is about to happen;
 * - what the action does;
 * - what it does not do;
 * - what the Member must provide or confirm;
 * - whether additional cost may apply;
 * - whether professional review may be required;
 * - whether external completion may remain outstanding.
 */
export const TRUST_CLUB_CONTEXTUAL_DISCLOSURE_RULE =
  'MATERIAL_ACTIONS_REQUIRE_PLAIN_LANGUAGE_CONTEXTUAL_DISCLOSURE' as const;