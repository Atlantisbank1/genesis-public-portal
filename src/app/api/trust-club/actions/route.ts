import type {
  TrustClubActionType,
} from '@/trust-club/domain/trust-club-domain.contracts';

import {
  classifyTrustClubAction,
} from '@/trust-club/domain/trust-club-action-classification.policy';

import {
  TrustClubBetterAuthSessionAdapter,
} from '@/trust-club/server/trust-club-better-auth-session.adapter';

import {
  readTrustClubMemberActions,
} from '@/trust-club/server/trust-club-member-action-discovery.operation';

import {
  getTrustClubMemberForUser,
} from '@/trust-club/server/trust-club-production-membership.service';

function isTrustClubActionType(
  value:
    string,
): value is TrustClubActionType {
  try {
    return (
      classifyTrustClubAction(
        value as TrustClubActionType,
      ) !==
      undefined
    );
  }
  catch {
    return false;
  }
}

export async function GET(
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
          'trust-club-member-actions-route',
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

  const requestUrl =
    new URL(
      request.url,
    );

  const requestedActionType =
    requestUrl.searchParams.get(
      'type',
    );

  if (
    requestedActionType ===
      null ||
    !isTrustClubActionType(
      requestedActionType,
    )
  ) {
    return Response.json(
      {
        status:
          'INVALID_ACTION_TYPE',
      },
      {
        status:
          400,
      },
    );
  }

  const authenticatedUserId =
    authentication.identity
      .authenticatedUserId;

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

  const actions =
    await readTrustClubMemberActions({
      memberId:
        membership.memberId,

      actionType:
        requestedActionType,
    });

  return Response.json({
    status:
      'READY',

    memberId:
      membership.memberId,

    actionType:
      requestedActionType,

    actions,
  });
}
