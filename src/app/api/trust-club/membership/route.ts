import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  ensureTrustClubEligibilityForUser,
  trustClubEligibilityIsRestricted,
  trustClubEligibilityRequiresReview,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  ensureTrustClubMemberForUser,
} from '@/trust-club/server/trust-club-production-membership.service';

export async function POST(
  request:
    Request,
): Promise<Response> {
  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const authentication =
    await authenticationAdapter
      .resolveAuthenticatedIdentity({
        sourceReference:
          'trust-club-membership-route',
      });

  if (
    authentication.status !==
      'AUTHENTICATED' ||
    authentication.identity ===
      null
  ) {
    return Response.json(
      {
        status:
          'AUTHENTICATION_REQUIRED',
      },
      {
        status:
          401,
      },
    );
  }

  const authenticatedUserId =
    authentication.identity
      .authenticatedUserId;

  const eligibility =
    await ensureTrustClubEligibilityForUser(
      authenticatedUserId,
    );

  if (
    trustClubEligibilityIsRestricted(
      eligibility,
    )
  ) {
    return Response.json(
      {
        status:
          'ACCESS_RESTRICTED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    trustClubEligibilityRequiresReview(
      eligibility,
    )
  ) {
    return Response.json(
      {
        status:
          'ELIGIBILITY_REVIEW_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  const membership =
    await ensureTrustClubMemberForUser(
      authenticatedUserId,
    );

  return Response.json({
    memberId:
      membership.memberId,

    status:
      membership.status,

    subscriptionStatus:
      membership.subscriptionStatus,

    planCode:
      membership.planCode,

    eligibilityStatus:
      eligibility.status,
  });
}