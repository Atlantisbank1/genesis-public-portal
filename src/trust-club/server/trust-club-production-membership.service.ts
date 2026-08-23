import {
  prisma,
} from '@/lib/prisma';

export async function ensureTrustClubMemberForUser(
  userId:
    string,
) {
  return prisma.trustClubMember.upsert({
    where: {
      userId,
    },

    update: {},

    create: {
      userId,

      status:
        'PENDING',

      subscriptionStatus:
        'PENDING',

      planCode:
        'STANDARD_MEMBERSHIP',
    },
  });
}

export async function getTrustClubMemberForUser(
  userId:
    string,
) {
  return prisma.trustClubMember.findUnique({
    where: {
      userId,
    },
  });
}

export function trustClubMembershipAllowsServiceAccess(
  membership: {
    status:
      string;

    subscriptionStatus:
      string;
  },
): boolean {
  const memberAccess =
    membership.status ===
      'ACTIVE' ||
    membership.status ===
      'GRACE';

  const subscriptionAccess =
    membership.subscriptionStatus ===
      'ACTIVE' ||
    membership.subscriptionStatus ===
      'GRACE';

  return (
    memberAccess &&
    subscriptionAccess
  );
}