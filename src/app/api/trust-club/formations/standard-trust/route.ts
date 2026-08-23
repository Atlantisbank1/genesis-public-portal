import {
  z,
} from 'zod';

import {
  readStandardTrustFormation,
} from '@/trust-club/formation/trust-club-standard-trust-formation-read.operation';

import {
  saveStandardTrustFormation,
} from '@/trust-club/formation/trust-club-standard-trust-formation-save.operation';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  getTrustClubEligibilityForUser,
  trustClubEligibilityIsRestricted,
  trustClubEligibilityRequiresReview,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  getTrustClubMemberForUser,
  trustClubMembershipAllowsServiceAccess,
} from '@/trust-club/server/trust-club-production-membership.service';

import {
  readTrustClubAction,
} from '@/trust-club/server/trust-club-action-read.operation';

const actionIdSchema =
  z.string()
    .trim()
    .min(
      1,
    )
    .max(
      160,
    );

const optionalTextSchema =
  z.string()
    .trim()
    .max(
      4000,
    )
    .nullable()
    .optional();

const saveRequestSchema =
  z.object({
    actionId:
      actionIdSchema,

    trustName:
      optionalTextSchema,

    trustPurpose:
      optionalTextSchema,

    settlorName:
      optionalTextSchema,

    trusteeName:
      optionalTextSchema,

    beneficiaryName:
      optionalTextSchema,

    protectorName:
      optionalTextSchema,

    initialPropertyDescription:
      optionalTextSchema,
  })
    .strict();

async function resolveAuthorizedFormationContext(
  request:
    Request,
  actionId:
    string,
) {
  const authenticationAdapter =
    new TrustClubBetterAuthSessionAdapter(
      request.headers,
    );

  const authentication =
    await authenticationAdapter
      .resolveAuthenticatedIdentity({
        sourceReference:
          'standard-trust-formation-data-route',
      });

  if (
    authentication.status !==
      'AUTHENTICATED' ||
    authentication.identity ===
      null
  ) {
    return {
      status:
        'AUTHENTICATION_REQUIRED' as const,
    };
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
    return {
      status:
        'ACCESS_RESTRICTED' as const,
    };
  }

  if (
    trustClubEligibilityRequiresReview(
      eligibility,
    )
  ) {
    return {
      status:
        'ELIGIBILITY_REVIEW_REQUIRED' as const,
    };
  }

  const membership =
    await getTrustClubMemberForUser(
      authenticatedUserId,
    );

  if (
    membership ===
      null
  ) {
    return {
      status:
        'MEMBERSHIP_REQUIRED' as const,
    };
  }

  if (
    !trustClubMembershipAllowsServiceAccess(
      membership,
    )
  ) {
    return {
      status:
        'MEMBERSHIP_NOT_ACTIVE' as const,
    };
  }

  const action =
    await readTrustClubAction({
      actionId,
    });

  if (
    action ===
      null
  ) {
    return {
      status:
        'ACTION_NOT_FOUND' as const,
    };
  }

  if (
    action.actionType !==
      'CREATE_STANDARD_TRUST'
  ) {
    return {
      status:
        'ACTION_TYPE_NOT_ALLOWED' as const,
    };
  }

  if (
    action.requestedByUserId !==
      authenticatedUserId
  ) {
    return {
      status:
        'ACTION_OWNERSHIP_REQUIRED' as const,
    };
  }

  if (
    action.memberId !==
      membership.memberId
  ) {
    return {
      status:
        'MEMBER_OWNERSHIP_REQUIRED' as const,
    };
  }

  return {
    status:
      'AUTHORIZED' as const,

    authenticatedUserId,

    membership,

    action,
  };
}

function authorizationFailureResponse(
  status:
    Exclude<
      Awaited<
        ReturnType<
          typeof resolveAuthorizedFormationContext
        >
      >['status'],
      'AUTHORIZED'
    >,
): Response {
  switch (
    status
  ) {
    case 'AUTHENTICATION_REQUIRED':
      return Response.json(
        {
          status,
        },
        {
          status:
            401,
        },
      );

    case 'ACTION_NOT_FOUND':
      return Response.json(
        {
          status,
        },
        {
          status:
            404,
        },
      );

    default:
      return Response.json(
        {
          status,
        },
        {
          status:
            403,
        },
      );
  }
}

export async function GET(
  request:
    Request,
): Promise<Response> {
  const requestUrl =
    new URL(
      request.url,
    );

  const parsedActionId =
    actionIdSchema.safeParse(
      requestUrl.searchParams.get(
        'actionId',
      ),
    );

  if (
    !parsedActionId.success
  ) {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'ACTION_ID_REQUIRED',
      },
      {
        status:
          400,
      },
    );
  }

  const actionId =
    parsedActionId.data;

  const authorization =
    await resolveAuthorizedFormationContext(
      request,
      actionId,
    );

  if (
    authorization.status !==
      'AUTHORIZED'
  ) {
    return authorizationFailureResponse(
      authorization.status,
    );
  }

  const result =
    await readStandardTrustFormation({
      actionId,
    });

  return Response.json(
    {
      status:
        'READY',

      actionId:
        result.actionId,

      actionType:
        result.actionType,

      actionStatus:
        result.actionStatus,

      formation:
        result.formation,
    },
    {
      status:
        200,
    },
  );
}

export async function POST(
  request:
    Request,
): Promise<Response> {
  let requestBody:
    unknown;

  try {
    requestBody =
      await request.json();
  }
  catch {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'INVALID_JSON',
      },
      {
        status:
          400,
      },
    );
  }

  const parsedBody =
    saveRequestSchema.safeParse(
      requestBody,
    );

  if (
    !parsedBody.success
  ) {
    return Response.json(
      {
        status:
          'INVALID_REQUEST',

        reason:
          'FORMATION_INPUT_INVALID',
      },
      {
        status:
          400,
      },
    );
  }

  const authorization =
    await resolveAuthorizedFormationContext(
      request,
      parsedBody.data.actionId,
    );

  if (
    authorization.status !==
      'AUTHORIZED'
  ) {
    return authorizationFailureResponse(
      authorization.status,
    );
  }

  if (
    authorization.action.status !==
      'DRAFT'
  ) {
    return Response.json(
      {
        status:
          'FORMATION_NOT_EDITABLE',

        actionStatus:
          authorization.action.status,
      },
      {
        status:
          409,
      },
    );
  }

  try {
    const result =
      await saveStandardTrustFormation({
        actionId:
          parsedBody.data.actionId,

        trustName:
          parsedBody.data.trustName,

        trustPurpose:
          parsedBody.data.trustPurpose,

        settlorName:
          parsedBody.data.settlorName,

        trusteeName:
          parsedBody.data.trusteeName,

        beneficiaryName:
          parsedBody.data.beneficiaryName,

        protectorName:
          parsedBody.data.protectorName,

        initialPropertyDescription:
          parsedBody.data
            .initialPropertyDescription,
      });

    return Response.json(
      {
        status:
          'SAVED',

        actionId:
          result.actionId,

        actionType:
          result.actionType,

        actionStatus:
          result.actionStatus,

        formation:
          result.formation,
      },
      {
        status:
          200,
      },
    );
  }
  catch (
    error
  ) {
    if (
      error instanceof Error
    ) {
      if (
        error.message ===
          'TRUST_CLUB_ACTION_NOT_FOUND'
      ) {
        return Response.json(
          {
            status:
              'ACTION_NOT_FOUND',
          },
          {
            status:
              404,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_ACTION_NOT_STANDARD_TRUST_FORMATION'
      ) {
        return Response.json(
          {
            status:
              'ACTION_TYPE_NOT_ALLOWED',
          },
          {
            status:
              403,
          },
        );
      }

      if (
        error.message ===
          'TRUST_CLUB_STANDARD_TRUST_FORMATION_NOT_EDITABLE'
      ) {
        return Response.json(
          {
            status:
              'FORMATION_NOT_EDITABLE',
          },
          {
            status:
              409,
          },
        );
      }
    }

    return Response.json(
      {
        status:
          'FORMATION_SAVE_FAILED',
      },
      {
        status:
          500,
      },
    );
  }
}