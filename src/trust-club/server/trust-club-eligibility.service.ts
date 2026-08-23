import {
  prisma,
} from '@/lib/prisma';

export async function ensureTrustClubEligibilityForUser(
  userId:
    string,
) {
  return prisma.trustClubEligibilityRecord.upsert({
    where: {
      userId,
    },

    update: {},

    create: {
      userId,

      status:
        'REVIEW_REQUIRED',
    },
  });
}

export async function getTrustClubEligibilityForUser(
  userId:
    string,
) {
  return prisma.trustClubEligibilityRecord.findUnique({
    where: {
      userId,
    },
  });
}

export function trustClubEligibilityAllowsServiceAccess(
  eligibility: {
    status:
      string;
  } | null,
): boolean {
  return (
    eligibility !==
      null &&
    eligibility.status ===
      'ELIGIBLE'
  );
}

export function trustClubEligibilityRequiresReview(
  eligibility: {
    status:
      string;
  } | null,
): boolean {
  return (
    eligibility ===
      null ||
    eligibility.status ===
      'REVIEW_REQUIRED'
  );
}

export function trustClubEligibilityIsRestricted(
  eligibility: {
    status:
      string;
  } | null,
): boolean {
  return (
    eligibility !==
      null &&
    eligibility.status ===
      'RESTRICTED'
  );
}