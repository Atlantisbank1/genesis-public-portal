import {
  z,
} from 'zod';

import {
  resolveTrustClubEntitlements,
} from '@/trust-club/domain/trust-club-entitlement-resolution.service';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  getTrustClubEligibilityForUser,
  trustClubEligibilityIsRestricted,
  trustClubEligibilityRequiresReview,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  executeTrustClubServerApplicationEntry,
} from '@/trust-club/server/trust-club-server-application-entry.service';

import {
  getTrustClubMemberForUser,
  trustClubMembershipAllowsServiceAccess,
} from '@/trust-club/server/trust-club-production-membership.service';

const requestSchema =
  z.object({
    consentAccepted:
      z.literal(
        true,
      ),
  });

export async function POST(
  request:
    Request,
): Promise<Response> {
  const parsedBody =
    requestSchema.safeParse(
      await request.json(),
    );

  if (
    !parsedBody.success
  ) {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'CONSENT_REQUIRED',
      },
      {
        status:
          400,
      },
    );
  }

  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const authentication =
    await authenticationAdapter
      .resolveAuthenticatedIdentity({
        sourceReference:
          'standard-trust-formation-route',
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
    await getTrustClubEligibilityForUser(
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
    await getTrustClubMemberForUser(
      authenticatedUserId,
    );

  if (
    membership ===
      null
  ) {
    return Response.json(
      {
        status:
          'MEMBERSHIP_REQUIRED',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    !trustClubMembershipAllowsServiceAccess(
      membership,
    )
  ) {
    return Response.json(
      {
        status:
          'MEMBERSHIP_NOT_ACTIVE',

        memberStatus:
          membership.status,

        subscriptionStatus:
          membership.subscriptionStatus,
      },
      {
        status:
          403,
      },
    );
  }

  const entitlementResolution =
    resolveTrustClubEntitlements({
      planCode:
        'STANDARD_MEMBERSHIP',

      subscriptionStatus:
        membership.subscriptionStatus,

      purchasedEntitlements:
        [],
    });

  const actionId =
    `trust-action-${crypto.randomUUID()}`;

  const createdAt =
    new Date()
      .toISOString();

  const result =
    await executeTrustClubServerApplicationEntry({
      authenticationSource: {
        adapter:
          authenticationAdapter,

        request: {
          sourceReference:
            'standard-trust-formation-route',
        },
      },

      authorizationDomainState: {
        membership: {
          memberId:
            membership.memberId,

          subscriptionStatus:
            membership.subscriptionStatus,
        },

        trustRelationship: {
          trustRoles:
            [],
        },

        systemRoleContext: {
          systemRoles:
            [],
        },

        entitlementResolution,
      },

      operation:
        'CREATE_ACTION',

      input: {
        authorization: {
          context: {
            authenticatedUserId,

            memberId:
              membership.memberId,

            trustRoles:
              [],

            systemRoles:
              [],

            entitlements:
              entitlementResolution
                .effectiveEntitlements,

            subscriptionStatus:
              membership.subscriptionStatus,
          },

          actionType:
            'CREATE_STANDARD_TRUST',

          serviceCode:
            'STANDARD_TRUST_FORMATION',

          trustRelationshipRequired:
            false,

          consentStatus:
            'ACCEPTED',

          professionalReviewRequired:
            false,

          professionalReviewCompleted:
            false,

          externalRequirementPending:
            false,
        },

        actionRecord: {
          actionId,

          actionType:
            'CREATE_STANDARD_TRUST',

          requestedByUserId:
            authenticatedUserId,

          memberId:
            membership.memberId,

          createdAt,
        },
      },
    });

  if (
    result.status !==
      'EXECUTED'
  ) {
    return Response.json(
      {
        status:
          'ENTRY_NOT_READY',
      },
      {
        status:
          403,
      },
    );
  }

  if (
    result.value.operation !==
      'CREATE_ACTION'
  ) {
    return Response.json(
      {
        status:
          'OPERATION_MISMATCH',
      },
      {
        status:
          500,
      },
    );
  }

  const executionValue =
    result.value.value;

  if (
    executionValue ===
      null
  ) {
    return Response.json(
      {
        status:
          'EXECUTION_VALUE_NOT_AVAILABLE',
      },
      {
        status:
          500,
      },
    );
  }

  if (
    !executionValue
      .intake
      .authorization
      .decision
      .allowed
  ) {
    return Response.json(
      {
        status:
          'AUTHORIZATION_DENIED',

        reason:
          executionValue
            .intake
            .authorization
            .decision
            .reason,
      },
      {
        status:
          403,
      },
    );
  }

  const actionRecord =
    executionValue
      .intake
      .actionRecord;

  if (
    actionRecord ===
      null
  ) {
    return Response.json(
      {
        status:
          'ACTION_NOT_CREATED',
      },
      {
        status:
          500,
      },
    );
  }

  return Response.json(
    {
      status:
        'CREATED',

      actionId:
        actionRecord.actionId,

      actionStatus:
        actionRecord.status,

      actionType:
        actionRecord.actionType,

      memberId:
        actionRecord.memberId,
    },
    {
      status:
        201,
    },
  );
}