import type {
  TrustClubTrustRecord,
} from '../domain/trust-club-trust-record.contracts';

import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

import {
  TrustClubBetterAuthSessionAdapter,
} from './trust-club-better-auth-session.adapter';

import {
  resolveTrustClubAuthenticationSource,
} from './trust-club-authentication-source.service';

import {
  getTrustClubMemberForUser,
  trustClubMembershipAllowsServiceAccess,
} from './trust-club-production-membership.service';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R29
 * Authenticated Member Canonical Trust Read Operation
 *
 * Purpose:
 *
 * Resolves the currently authenticated Trust Club Member and
 * returns the Canonical Trust Records that belong to that
 * Member.
 *
 * Identity chain:
 *
 * Better Auth validated session
 *          ↓
 * TrustClubBetterAuthSessionAdapter
 *          ↓
 * resolveTrustClubAuthenticationSource
 *          ↓
 * authenticatedUserId
 *          ↓
 * getTrustClubMemberForUser
 *          ↓
 * memberId
 *          ↓
 * Canonical Trust Registry
 *          ↓
 * findTrustRecordsByMemberId
 *
 * This operation is READ ONLY.
 *
 * It does NOT:
 * - accept caller-supplied userId;
 * - accept caller-supplied memberId;
 * - authenticate passwords itself;
 * - create a Membership;
 * - activate a Membership;
 * - modify Membership state;
 * - establish a Trust;
 * - create a Trust;
 * - allocate a Trust ID;
 * - recover a Trust ID;
 * - transition Action lifecycle;
 * - create Action Outcomes;
 * - access Prisma directly;
 * - write database state;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export interface ReadAuthenticatedMemberCanonicalTrustsInput {
  requestHeaders:
    Headers;
}

export interface ReadAuthenticatedMemberCanonicalTrustsResult {
  authenticatedUserId:
    string;

  memberId:
    string;

  membershipStatus:
    string;

  subscriptionStatus:
    string;

  trusts:
    TrustClubTrustRecord[];
}

export async function readAuthenticatedMemberCanonicalTrusts(
  input:
    ReadAuthenticatedMemberCanonicalTrustsInput,
): Promise<ReadAuthenticatedMemberCanonicalTrustsResult> {
  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      input.requestHeaders,
    );

  const authenticationSource =
    await resolveTrustClubAuthenticationSource(
      authenticationAdapter,
      {
        sourceReference:
          'authenticated-member-canonical-trust-read',
      },
    );

  if (
    authenticationSource.status !==
      'AUTHENTICATED' ||
    authenticationSource.identity ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_AUTHENTICATION_REQUIRED',
    );
  }

  const authenticatedUserId =
    authenticationSource
      .identity
      .authenticatedUserId;

  if (
    typeof authenticatedUserId !==
      'string' ||
    authenticatedUserId.trim().length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_AUTHENTICATED_USER_ID_INVALID',
    );
  }

  const membership =
    await getTrustClubMemberForUser(
      authenticatedUserId,
    );

  if (
    membership ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBERSHIP_NOT_FOUND',
    );
  }

  if (
    trustClubMembershipAllowsServiceAccess(
      membership,
    ) !==
      true
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBERSHIP_ACCESS_NOT_ALLOWED',
    );
  }

  const memberId =
    membership.memberId;

  if (
    typeof memberId !==
      'string' ||
    memberId.trim().length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBER_ID_INVALID',
    );
  }

  return withTrustClubPersistence(
    async (
      _persistence,
      trustRegistry,
    ) => {
      const trusts =
        await trustRegistry
          .findTrustRecordsByMemberId(
            memberId,
          );

      for (
        const trust of
        trusts
      ) {
        if (
          trust.memberId !==
            memberId
        ) {
          throw new Error(
            'TRUST_CLUB_CANONICAL_TRUST_READ_MEMBER_BOUNDARY_VIOLATION',
          );
        }
      }

      return {
        authenticatedUserId,

        memberId,

        membershipStatus:
          membership.status,

        subscriptionStatus:
          membership.subscriptionStatus,

        trusts,
      };
    },
  );
}

/**
 * Authentication-source rule.
 *
 * Canonical Trust member reads derive User identity only from
 * the certified authentication-source boundary.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_AUTHENTICATION_RULE =
  'CANONICAL_TRUST_MEMBER_READ_DERIVES_USER_IDENTITY_FROM_AUTHENTICATION_SOURCE' as const;

/**
 * Caller-identity rule.
 *
 * Neither userId nor memberId may be supplied by the caller.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_CALLER_IDENTITY_RULE =
  'CANONICAL_TRUST_MEMBER_READ_DOES_NOT_ACCEPT_CALLER_SUPPLIED_USER_OR_MEMBER_ID' as const;

/**
 * Membership-resolution rule.
 *
 * The authenticated User is resolved to an existing Trust Club
 * Membership without creating or modifying Membership state.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_MEMBERSHIP_RULE =
  'CANONICAL_TRUST_MEMBER_READ_USES_EXISTING_MEMBERSHIP_ONLY' as const;

/**
 * Membership-access rule.
 *
 * Canonical Trust service access requires the existing
 * Membership access policy to allow service access.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_ACCESS_RULE =
  'CANONICAL_TRUST_MEMBER_READ_REQUIRES_MEMBERSHIP_SERVICE_ACCESS' as const;

/**
 * Canonical-member rule.
 *
 * Trust Records are selected only by the memberId resolved from
 * the authenticated User's existing Membership.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_MEMBER_RULE =
  'CANONICAL_TRUST_MEMBER_READ_USES_AUTHENTICATED_MEMBER_ID_ONLY' as const;

/**
 * Read-only rule.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_ONLY_RULE =
  'CANONICAL_TRUST_MEMBER_READ_PERFORMS_NO_DATABASE_WRITE' as const;

/**
 * Establishment boundary.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_ESTABLISHMENT_RULE =
  'CANONICAL_TRUST_MEMBER_READ_DOES_NOT_ESTABLISH_OR_CREATE_TRUST' as const;

/**
 * Lifecycle boundary.
 */
export const TRUST_CLUB_MEMBER_CANONICAL_TRUST_READ_LIFECYCLE_RULE =
  'CANONICAL_TRUST_MEMBER_READ_DOES_NOT_CONTROL_ACTION_LIFECYCLE' as const;