import {
  createTrustClubActionRecord,
} from './trust-club-action-record.service';

import {
  orchestrateTrustClubAuthorization,
} from './trust-club-authorization-orchestration.service';

import type {
  TrustClubActionRequestIntakeInput,
  TrustClubActionRequestIntakeResult,
} from './trust-club-action-request-intake.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.2
 * Action Request Intake Orchestration Service
 *
 * Purpose:
 * Coordinates Trust Club authorization evaluation with
 * controlled Action-record construction.
 *
 * This service:
 * - verifies Action-type consistency;
 * - delegates authorization evaluation to Phase 3.9;
 * - prevents Action-record creation when authorization is denied;
 * - delegates Action-record creation to Phase 4.1 when allowed.
 *
 * It does NOT:
 * - authenticate a user;
 * - verify identity;
 * - create Membership;
 * - create a Trust;
 * - establish Trust ownership;
 * - grant Trust roles;
 * - resolve entitlements;
 * - activate entitlements;
 * - persist Action records;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - bypass the Phase 4.0 Action Workflow Policy;
 * - place a newly created Action directly into AUTHORIZED status.
 */

function assertActionTypeConsistency(
  input:
    TrustClubActionRequestIntakeInput,
): void {
  if (
    input.authorization.actionType !==
    input.actionRecord.actionType
  ) {
    throw new Error(
      'TRUST_CLUB_ACTION_REQUEST_ACTION_TYPE_MISMATCH',
    );
  }
}

export function intakeTrustClubActionRequest(
  input:
    TrustClubActionRequestIntakeInput,
): TrustClubActionRequestIntakeResult {
  assertActionTypeConsistency(
    input,
  );

  const authorization =
    orchestrateTrustClubAuthorization(
      input.authorization,
    );

  if (!authorization.decision.allowed) {
    return {
      authorization,

      actionRecord:
        null,
    };
  }

  const actionRecord =
    createTrustClubActionRecord(
      input.actionRecord,
    );

  return {
    authorization,

    actionRecord,
  };
}