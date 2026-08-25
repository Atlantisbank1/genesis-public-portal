import {
  prisma,
} from '@/lib/prisma';

import {
  authorizeTrustClubAdminReview,
} from './trust-club-admin-review-authorization.service';

import {
  getTrustClubEligibilityForUser,
} from './trust-club-eligibility.service';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from './trust-club-server-application-entry.contracts';

import type {
  TrustClubMembershipActivationResult,
} from './trust-club-membership-activation.contracts';

export interface TrustClubMembershipActivationCommand {
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource;

  targetUserId:
    string;
}

function requireTargetUserId(
  value:
    string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_TARGET_USER_ID_REQUIRED',
    );
  }

  return normalized;
}

export async function activateTrustClubMembershipAsAdmin(
  input:
    TrustClubMembershipActivationCommand,
): Promise<
  TrustClubMembershipActivationResult
> {
  const adminAuthorization =
    await authorizeTrustClubAdminReview(
      input.authenticationSource,
    );

  if (
    adminAuthorization.status !==
      'AUTHORIZED'
  ) {
    throw new Error(
      adminAuthorization.status ===
        'UNAUTHENTICATED'
        ? 'TRUST_CLUB_MEMBERSHIP_ACTIVATION_AUTHENTICATION_REQUIRED'
        : 'TRUST_CLUB_MEMBERSHIP_ACTIVATION_ADMIN_SYSTEM_ROLE_REQUIRED',
    );
  }

  const targetUserId =
    requireTargetUserId(
      input.targetUserId,
    );

  const eligibility =
    await getTrustClubEligibilityForUser(
      targetUserId,
    );

  if (
    eligibility ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_ELIGIBILITY_NOT_FOUND',
    );
  }

  if (
    eligibility.status !==
      'ELIGIBLE'
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_REQUIRES_ELIGIBLE_STATUS',
    );
  }

  const existingMembership =
    await prisma
      .trustClubMember
      .findUnique({
        where: {
          userId:
            targetUserId,
        },
      });

  if (
    existingMembership ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_MEMBERSHIP_NOT_FOUND',
    );
  }

  if (
    existingMembership.status !==
      'PENDING' ||
    existingMembership.subscriptionStatus !==
      'PENDING'
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_REQUIRES_PENDING_STATE',
    );
  }

  const activatedAt =
    new Date();

  const updateResult =
    await prisma
      .trustClubMember
      .updateMany({
        where: {
          memberId:
            existingMembership.memberId,

          userId:
            targetUserId,

          status:
            'PENDING',

          subscriptionStatus:
            'PENDING',
        },

        data: {
          status:
            'ACTIVE',

          subscriptionStatus:
            'ACTIVE',

          activatedAt,
        },
      });

  if (
    updateResult.count !==
      1
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_PRECONDITION_FAILED',
    );
  }

  const activatedMembership =
    await prisma
      .trustClubMember
      .findUnique({
        where: {
          memberId:
            existingMembership.memberId,
        },
      });

  if (
    activatedMembership ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_RESULT_NOT_FOUND',
    );
  }

  if (
    activatedMembership.status !==
      'ACTIVE' ||
    activatedMembership.subscriptionStatus !==
      'ACTIVE' ||
    activatedMembership.activatedAt ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_MEMBERSHIP_ACTIVATION_NOT_PERSISTED',
    );
  }

  return {
    memberId:
      activatedMembership.memberId,

    userId:
      activatedMembership.userId,

    status:
      'ACTIVE',

    subscriptionStatus:
      'ACTIVE',

    planCode:
      activatedMembership.planCode,

    activatedAt:
      activatedMembership.activatedAt,
  };
}

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_ADMIN_RULE =
  'MEMBERSHIP_ACTIVATION_REQUIRES_AUTHENTICATED_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_SOURCE_STATE_RULE =
  'MEMBERSHIP_ACTIVATION_REQUIRES_PENDING_MEMBERSHIP_AND_PENDING_SUBSCRIPTION' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_ELIGIBILITY_STATE_RULE =
  'MEMBERSHIP_ACTIVATION_REQUIRES_ELIGIBLE_TARGET_USER' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_ATOMIC_RULE =
  'MEMBERSHIP_ACTIVATION_ATOMICALLY_TRANSITIONS_PENDING_PENDING_TO_ACTIVE_ACTIVE' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_REPLAY_RULE =
  'MEMBERSHIP_ACTIVATION_CANNOT_REPLAY_AFTER_PENDING_STATE_EXIT' as const;

export const TRUST_CLUB_MEMBERSHIP_ACTIVATION_TIME_RULE =
  'MEMBERSHIP_ACTIVATION_TIMESTAMP_IS_SERVER_GENERATED' as const;