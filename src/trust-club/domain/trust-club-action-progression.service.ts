import {
  transitionTrustClubActionRecord,
} from './trust-club-action-record.service';

import type {
  TrustClubActionProgressionInput,
  TrustClubActionProgressionResult,
} from './trust-club-action-progression.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.3
 * Action Progression Orchestration Service
 *
 * Purpose:
 * Coordinates controlled lifecycle progression of an existing
 * Trust Club Action record.
 *
 * This service:
 * - preserves the previous Action record;
 * - delegates transition validation and transformation to
 *   the Phase 4.1 Action Record Domain Model;
 * - returns the previous and progressed domain records.
 *
 * Phase 4.1 itself delegates lifecycle permission decisions
 * to the certified Phase 4.0 Action Workflow Policy.
 *
 * It does NOT:
 * - create a new Action lifecycle vocabulary;
 * - authorize the underlying Trust action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - persist Action records;
 * - access a database;
 * - access Prisma;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - prove external completion.
 */

export function progressTrustClubAction(
  input:
    TrustClubActionProgressionInput,
): TrustClubActionProgressionResult {
  const previousRecord =
    input.record;

  const progressedRecord =
    transitionTrustClubActionRecord({
      record:
        previousRecord,

      requestedStatus:
        input.requestedStatus,

      updatedAt:
        input.updatedAt,
    });

  return {
    previousRecord,

    progressedRecord,
  };
}