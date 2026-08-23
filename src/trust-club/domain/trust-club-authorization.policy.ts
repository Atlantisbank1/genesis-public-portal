import type {
  TrustClubActionType,
  TrustClubAuthorizationContext,
  TrustClubConsentStatus,
  TrustClubEntitlement,
  TrustClubPermissionDecision,
  TrustClubRole,
} from './trust-club-domain.contracts';

export interface TrustClubAuthorizationRequest {
  context:
    TrustClubAuthorizationContext | null;

  actionType:
    TrustClubActionType;

  requiredEntitlement?:
    TrustClubEntitlement;

  allowedRoles?:
    readonly TrustClubRole[];

  trustRelationshipRequired:
    boolean;

  consentRequired:
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

function denied(
  reason:
    Exclude<
      TrustClubPermissionDecision['reason'],
      'ALLOWED'
    >,
): TrustClubPermissionDecision {
  return {
    allowed: false,
    reason,
  };
}

function allowed():
  TrustClubPermissionDecision {
  return {
    allowed: true,
    reason: 'ALLOWED',
  };
}

function hasAllowedRole(
  actualRoles:
    readonly TrustClubRole[],
  allowedRoles:
    readonly TrustClubRole[],
): boolean {
  return allowedRoles.some(
    (role) =>
      actualRoles.includes(role),
  );
}

export function authorizeTrustClubAction(
  request:
    TrustClubAuthorizationRequest,
): TrustClubPermissionDecision {
  const context =
    request.context;

  if (!context?.authenticatedUserId) {
    return denied(
      'AUTHENTICATION_REQUIRED',
    );
  }

  if (!context.memberId) {
    return denied(
      'MEMBERSHIP_REQUIRED',
    );
  }

  if (
    request.trustRelationshipRequired &&
    !context.trustId
  ) {
    return denied(
      'TRUST_RELATIONSHIP_REQUIRED',
    );
  }

  if (
    request.allowedRoles &&
    request.allowedRoles.length > 0 &&
    !hasAllowedRole(
      context.trustRoles,
      request.allowedRoles,
    )
  ) {
    return denied(
      'ROLE_NOT_AUTHORIZED',
    );
  }

  if (
    context.subscriptionStatus !==
      'ACTIVE' &&
    context.subscriptionStatus !==
      'GRACE'
  ) {
    return denied(
      'SUBSCRIPTION_NOT_ACTIVE',
    );
  }

  if (
    request.requiredEntitlement &&
    !context.entitlements.includes(
      request.requiredEntitlement,
    )
  ) {
    return denied(
      'ENTITLEMENT_REQUIRED',
    );
  }

  if (
    request.consentRequired &&
    request.consentStatus !==
      'ACCEPTED'
  ) {
    return denied(
      'CONSENT_REQUIRED',
    );
  }

  if (
    request.professionalReviewRequired &&
    !request.professionalReviewCompleted
  ) {
    return denied(
      'PROFESSIONAL_REVIEW_REQUIRED',
    );
  }

  if (
    request.externalRequirementPending
  ) {
    return denied(
      'EXTERNAL_REQUIREMENT_PENDING',
    );
  }

  return allowed();
}