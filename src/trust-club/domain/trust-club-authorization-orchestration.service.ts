import {
  authorizeTrustClubAction,
} from './trust-club-authorization.policy';

import {
  classifyTrustClubAction,
} from './trust-club-action-classification.policy';

import {
  getTrustClubServiceDefinition,
} from './trust-club-service-catalog';

import type {
  TrustClubAuthorizationOrchestrationInput,
  TrustClubAuthorizationOrchestrationResult,
} from './trust-club-authorization-orchestration.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 3.9
 * Authorization Request Orchestration
 *
 * Purpose:
 * Coordinates existing Trust Club domain policies to assemble
 * and evaluate an authorization request.
 *
 * This service derives:
 *
 * - consent requirement from Action Classification;
 * - required entitlement from the existing Service Catalog.
 *
 * It consumes established:
 *
 * - Authorization Context;
 * - allowed-role requirements;
 * - Trust-relationship requirement;
 * - professional-review state;
 * - external-requirement state.
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

export function orchestrateTrustClubAuthorization(
  input:
    TrustClubAuthorizationOrchestrationInput,
): TrustClubAuthorizationOrchestrationResult {
  const actionClassification =
    classifyTrustClubAction(
      input.actionType,
    );

  const serviceDefinition =
    getTrustClubServiceDefinition(
      input.serviceCode,
    );

  const decision =
    authorizeTrustClubAction({
      context:
        input.context,

      actionType:
        input.actionType,

      requiredEntitlement:
        serviceDefinition.requiredEntitlement,

      allowedRoles:
        input.allowedRoles,

      trustRelationshipRequired:
        input.trustRelationshipRequired,

      consentRequired:
        actionClassification.consentRequired,

      consentStatus:
        input.consentStatus,

      professionalReviewRequired:
        input.professionalReviewRequired,

      professionalReviewCompleted:
        input.professionalReviewCompleted,

      externalRequirementPending:
        input.externalRequirementPending,
    });

  return {
    actionType:
      input.actionType,

    serviceCode:
      input.serviceCode,

    decision,
  };
}