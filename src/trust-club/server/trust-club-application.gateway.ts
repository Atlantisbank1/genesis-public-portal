import type {
  TrustClubActionRequestIntakeInput,
} from '../domain/trust-club-action-request-intake.contracts';

import type {
  CreateTrustClubActionResult,
} from './trust-club-action-create.operation';

import {
  createTrustClubAction,
} from './trust-club-action-create.operation';

import type {
  ReadTrustClubActionInput,
} from './trust-club-action-read.operation';

import {
  readTrustClubAction,
} from './trust-club-action-read.operation';

import type {
  TransitionTrustClubActionInput,
  TransitionTrustClubActionResult,
} from './trust-club-action-transition.operation';

import {
  transitionTrustClubAction,
} from './trust-club-action-transition.operation';

import type {
  RecordTrustClubActionOutcomeInput,
  RecordTrustClubActionOutcomeResult,
} from './trust-club-action-outcome-record.operation';

import {
  recordTrustClubActionOutcome,
} from './trust-club-action-outcome-record.operation';

import type {
  ReadTrustClubActionOutcomesInput,
} from './trust-club-action-outcome-read.operation';

import {
  readTrustClubActionOutcomes,
} from './trust-club-action-outcome-read.operation';

import type {
  ReadTrustClubActionAggregateInput,
} from './trust-club-action-aggregate-read.operation';

import {
  readTrustClubActionAggregate,
} from './trust-club-action-aggregate-read.operation';

/**
 * TRUST-CLUB-V1
 * PHASE 5.15
 *
 * Server Application Gateway
 *
 * Purpose:
 *
 * Provides one controlled server-side application entry boundary
 * for the six certified Trust Club application operations defined
 * by the Phase 5.14 application exposure contract.
 *
 * This gateway delegates directly to existing certified operations.
 *
 * It does NOT:
 * - create an HTTP endpoint;
 * - create a Next.js Route Handler;
 * - create a Server Action;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - replace certified authorization authority;
 * - access Prisma directly;
 * - access persistence directly;
 * - access repositories directly;
 * - redefine Action lifecycle authority;
 * - redefine Action or Outcome domains;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services;
 * - establish proof of external completion.
 */

export async function executeTrustClubCreateAction(
  input:
    TrustClubActionRequestIntakeInput,
): Promise<CreateTrustClubActionResult> {
  return createTrustClubAction(
    input,
  );
}

export async function executeTrustClubReadAction(
  input:
    ReadTrustClubActionInput,
) {
  return readTrustClubAction(
    input,
  );
}

export async function executeTrustClubTransitionAction(
  input:
    TransitionTrustClubActionInput,
): Promise<TransitionTrustClubActionResult> {
  return transitionTrustClubAction(
    input,
  );
}

export async function executeTrustClubRecordOutcome(
  input:
    RecordTrustClubActionOutcomeInput,
): Promise<RecordTrustClubActionOutcomeResult> {
  return recordTrustClubActionOutcome(
    input,
  );
}

export async function executeTrustClubReadOutcomes(
  input:
    ReadTrustClubActionOutcomesInput,
) {
  return readTrustClubActionOutcomes(
    input,
  );
}

export async function executeTrustClubReadActionAggregate(
  input:
    ReadTrustClubActionAggregateInput,
) {
  return readTrustClubActionAggregate(
    input,
  );
}

/**
 * Delegation rule.
 *
 * The application gateway is orchestration-free.
 * Each gateway operation delegates to its existing certified
 * Trust Club server operation.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_DELEGATION_RULE =
  'APPLICATION_GATEWAY_DELEGATES_TO_CERTIFIED_SERVER_OPERATIONS' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_EXPOSURE_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Server Action rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_SERVER_ACTION_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_CREATE_NEXT_SERVER_ACTION' as const;

/**
 * Authentication rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_AUTHENTICATION_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_OWN_AUTHENTICATION' as const;

/**
 * Authorization rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_AUTHORIZATION_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_REPLACE_CERTIFIED_AUTHORIZATION_AUTHORITY' as const;

/**
 * Persistence rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_PERSISTENCE_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_ACCESS_PERSISTENCE_DIRECTLY' as const;

/**
 * Lifecycle rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_LIFECYCLE_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_OWN_ACTION_LIFECYCLE' as const;

/**
 * Domain rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_DOMAIN_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_REDEFINE_CERTIFIED_DOMAIN_CONTRACTS' as const;

/**
 * External-completion rule.
 */
export const TRUST_CLUB_APPLICATION_GATEWAY_EXTERNAL_RULE =
  'APPLICATION_GATEWAY_DOES_NOT_ESTABLISH_EXTERNAL_COMPLETION' as const;