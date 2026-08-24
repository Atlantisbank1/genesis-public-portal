import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from './trust-club-server-application-entry.contracts';

import {
  getTrustClubSystemRolesForUser,
} from './trust-club-system-role.service';

/**
 * TRUST-CLUB-V1
 * PHASE 6.8
 *
 * Admin Review Authorization Boundary
 *
 * Purpose:
 *
 * Establishes whether the authenticated server-side identity
 * is authorized to perform a Trust Club administrative review.
 *
 * Administrative authority is derived exclusively from the
 * persisted TRUST_CLUB_ADMIN System Role assignment.
 *
 * This boundary:
 * 1. consumes the existing Authentication Source;
 * 2. requires an authenticated identity;
 * 3. resolves persisted System Roles for that identity;
 * 4. requires TRUST_CLUB_ADMIN;
 * 5. fails closed otherwise.
 *
 * It does NOT:
 * - authenticate credentials independently;
 * - accept caller-supplied System Roles as authority;
 * - grant or revoke System Roles;
 * - create or update role assignments;
 * - authorize ordinary Member actions;
 * - redefine Trust roles;
 * - redefine the Action lifecycle;
 * - transition an Action;
 * - directly write persistence;
 * - create an HTTP endpoint;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity.
 */

export type TrustClubAdminReviewAuthorizationResult =
  | {
      status:
        'AUTHORIZED';

      authenticatedUserId:
        string;
    }
  | {
      status:
        'UNAUTHENTICATED';

      authenticatedUserId:
        null;
    }
  | {
      status:
        'ADMIN_SYSTEM_ROLE_REQUIRED';

      authenticatedUserId:
        string;
    };

export async function authorizeTrustClubAdminReview(
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource,
): Promise<TrustClubAdminReviewAuthorizationResult> {
  const authentication =
    await authenticationSource.adapter
      .resolveAuthenticatedIdentity(
        authenticationSource.request,
      );

  if (
    authentication.status !==
      'AUTHENTICATED' ||
    authentication.identity ===
      null
  ) {
    return {
      status:
        'UNAUTHENTICATED',

      authenticatedUserId:
        null,
    };
  }

  const authenticatedUserId =
    authentication.identity
      .authenticatedUserId;

  const systemRoles =
    await getTrustClubSystemRolesForUser(
      authenticatedUserId,
    );

  if (
    !systemRoles.includes(
      'TRUST_CLUB_ADMIN',
    )
  ) {
    return {
      status:
        'ADMIN_SYSTEM_ROLE_REQUIRED',

      authenticatedUserId,
    };
  }

  return {
    status:
      'AUTHORIZED',

    authenticatedUserId,
  };
}

/**
 * Authentication-source rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_AUTHENTICATION_RULE =
  'ADMIN_REVIEW_CONSUMES_EXISTING_AUTHENTICATION_SOURCE' as const;

/**
 * System-role authority rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_SYSTEM_ROLE_RULE =
  'ADMIN_REVIEW_REQUIRES_PERSISTED_TRUST_CLUB_ADMIN_SYSTEM_ROLE' as const;

/**
 * Caller-authority rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_CALLER_ROLE_RULE =
  'ADMIN_REVIEW_DOES_NOT_ACCEPT_CALLER_SUPPLIED_SYSTEM_ROLE_AUTHORITY' as const;

/**
 * Fail-closed rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_FAIL_CLOSED_RULE =
  'ADMIN_REVIEW_FAILS_CLOSED_WITHOUT_AUTHENTICATED_ADMIN_IDENTITY' as const;

/**
 * Persistence rule.
 *
 * This boundary performs no persistence mutation.
 * Persisted System Role resolution remains delegated to the
 * certified read-only System Role service.
 */
export const TRUST_CLUB_ADMIN_REVIEW_PERSISTENCE_RULE =
  'ADMIN_REVIEW_AUTHORIZATION_DOES_NOT_WRITE_PERSISTENCE' as const;

/**
 * Lifecycle rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_LIFECYCLE_RULE =
  'ADMIN_REVIEW_AUTHORIZATION_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_ADMIN_REVIEW_EXPOSURE_RULE =
  'ADMIN_REVIEW_AUTHORIZATION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;
