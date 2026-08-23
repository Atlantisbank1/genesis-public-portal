import {
  prisma,
} from '@/lib/prisma';

import type {
  TrustClubSystemRole,
} from '../domain/trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 6.7-I.4N
 *
 * Persisted System Role Resolution Service
 *
 * Purpose:
 *
 * Resolves already-established Trust Club System Role assignments
 * for an authenticated user.
 *
 * This service is read-only.
 *
 * It does NOT:
 * - grant system roles;
 * - revoke system roles;
 * - create role assignments;
 * - update role assignments;
 * - delete role assignments;
 * - authenticate users;
 * - authorize Trust actions;
 * - create Membership;
 * - modify Eligibility;
 * - activate entitlements;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity.
 */

export async function getTrustClubSystemRolesForUser(
  userId:
    string,
): Promise<readonly TrustClubSystemRole[]> {
  const assignments =
    await prisma.trustClubSystemRoleAssignment.findMany({
      where: {
        userId,
      },

      select: {
        role:
          true,
      },

      orderBy: {
        createdAt:
          'asc',
      },
    });

  return assignments.map(
    (
      assignment,
    ) =>
      assignment.role,
  );
}
