import type {
  TrustClubActionType,
  TrustClubAuthorizationContext,
  TrustClubConsentStatus,
  TrustClubPermissionDecision,
  TrustClubRole,
} from './trust-club-domain.contracts';

import type {
  TrustClubServiceCode,
} from './trust-club-service-catalog';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.9
 * Authorization Request Orchestration Contracts
 *
 * Purpose:
 * Defines the controlled input and output contracts used to
 * assemble and evaluate a Trust Club authorization request.
 *
 * Phase 3.9 reuses:
 *
 * - existing Action Classification;
 * - existing Service Catalog entitlement requirements;
 * - existing Authorization Context;
 * - existing Authorization Policy.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify identity;
 * - create Membership;
 * - create a Trust;
 * - establish Trust ownership;
 * - grant Trust roles;
 * - invent role requirements;
 * - resolve entitlements;
 * - activate entitlements;
 * - process payments;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute banking activity;
 * - execute external services.
 */

export interface TrustClubAuthorizationOrchestrationInput {
  context:
    TrustClubAuthorizationContext | null;

  actionType:
    TrustClubActionType;

  serviceCode:
    TrustClubServiceCode;

  allowedRoles?:
    readonly TrustClubRole[];

  trustRelationshipRequired:
    boolean;

  consentStatus?:
    TrustClubConsentStatus;

  professionalReviewRequired?:
    boolean;

  professionalReviewCompleted?:
    boolean;

  externalRequirementPending?:
    boolean;
}

export interface TrustClubAuthorizationOrchestrationResult {
  actionType:
    TrustClubActionType;

  serviceCode:
    TrustClubServiceCode;

  decision:
    TrustClubPermissionDecision;
}

/**
 * Service-entitlement source rule.
 *
 * Phase 3.9 must obtain the required entitlement from the
 * existing Trust Club Service Catalog.
 *
 * It must not duplicate or independently redefine the
 * service entitlement requirement.
 */
export const TRUST_CLUB_AUTHORIZATION_SERVICE_ENTITLEMENT_RULE =
  'AUTHORIZATION_REQUIRED_ENTITLEMENT_IS_DERIVED_FROM_SERVICE_CATALOG' as const;

/**
 * Consent-source rule.
 *
 * Whether consent is required for an action is derived from
 * the existing Action Classification Policy.
 */
export const TRUST_CLUB_AUTHORIZATION_CONSENT_SOURCE_RULE =
  'AUTHORIZATION_CONSENT_REQUIREMENT_IS_DERIVED_FROM_ACTION_CLASSIFICATION' as const;

/**
 * Role-policy boundary.
 *
 * Phase 3.9 may consume an established allowed-role requirement
 * but does not invent or grant Trust roles.
 */
export const TRUST_CLUB_AUTHORIZATION_ROLE_BOUNDARY_RULE =
  'AUTHORIZATION_ORCHESTRATION_CONSUMES_ESTABLISHED_ROLE_REQUIREMENTS' as const;

/**
 * Orchestration boundary.
 *
 * The orchestration layer coordinates existing domain policies.
 *
 * It does not replace Authentication, Membership, Trust,
 * entitlement-resolution or external-completion domains.
 */
export const TRUST_CLUB_AUTHORIZATION_ORCHESTRATION_RULE =
  'AUTHORIZATION_ORCHESTRATION_COORDINATES_EXISTING_DOMAIN_POLICIES' as const;