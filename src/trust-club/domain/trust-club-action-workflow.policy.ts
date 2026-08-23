import type {
  TrustClubActionStatus,
} from './trust-club-domain.contracts';

import type {
  TrustClubActionTransitionDecision,
  TrustClubActionTransitionRequest,
} from './trust-club-action-workflow.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.0
 * Action Workflow / Lifecycle Transition Policy
 *
 * Purpose:
 * Evaluates whether a requested Trust Club Action status
 * transition is permitted by the controlled lifecycle.
 *
 * This policy:
 * - uses the existing TrustClubActionStatus vocabulary;
 * - evaluates transition permission only;
 * - does not persist state;
 * - does not authorize the underlying Trust action;
 * - does not execute internal or external work.
 */

const TERMINAL_STATUSES:
  readonly TrustClubActionStatus[] = [
    'COMPLETE',
    'REJECTED',
    'CANCELLED',
  ];

const ALLOWED_TRANSITIONS:
  Readonly<
    Record<
      TrustClubActionStatus,
      readonly TrustClubActionStatus[]
    >
  > = {
  DRAFT: [
    'DISCLOSURE_REQUIRED',
    'CONSENT_REQUIRED',
    'READY',
    'REJECTED',
    'CANCELLED',
  ],

  DISCLOSURE_REQUIRED: [
    'CONSENT_REQUIRED',
    'READY',
    'REJECTED',
    'CANCELLED',
  ],

  CONSENT_REQUIRED: [
    'READY',
    'REJECTED',
    'CANCELLED',
  ],

  READY: [
    'PENDING_REVIEW',
    'AUTHORIZED',
    'REJECTED',
    'CANCELLED',
  ],

  PENDING_REVIEW: [
    'AUTHORIZED',
    'REJECTED',
    'CANCELLED',
  ],

  AUTHORIZED: [
    'IN_PROGRESS',
    'REJECTED',
    'CANCELLED',
  ],

  IN_PROGRESS: [
    'INTERNAL_COMPLETE',
    'REJECTED',
    'CANCELLED',
  ],

  INTERNAL_COMPLETE: [
    'EXTERNAL_PENDING',
    'COMPLETE',
    'CANCELLED',
  ],

  EXTERNAL_PENDING: [
    'COMPLETE',
    'CANCELLED',
  ],

  COMPLETE: [],

  REJECTED: [],

  CANCELLED: [],
};

function isTerminalStatus(
  status:
    TrustClubActionStatus,
): boolean {
  return TERMINAL_STATUSES.includes(
    status,
  );
}

export function evaluateTrustClubActionTransition(
  request:
    TrustClubActionTransitionRequest,
): TrustClubActionTransitionDecision {
  if (
    request.currentStatus ===
    request.requestedStatus
  ) {
    return {
      allowed:
        false,

      currentStatus:
        request.currentStatus,

      requestedStatus:
        request.requestedStatus,

      reason:
        'SAME_STATUS',
    };
  }

  if (
    isTerminalStatus(
      request.currentStatus,
    )
  ) {
    return {
      allowed:
        false,

      currentStatus:
        request.currentStatus,

      requestedStatus:
        request.requestedStatus,

      reason:
        'TERMINAL_STATUS',
    };
  }

  const allowedStatuses =
    ALLOWED_TRANSITIONS[
      request.currentStatus
    ];

  if (
    !allowedStatuses.includes(
      request.requestedStatus,
    )
  ) {
    return {
      allowed:
        false,

      currentStatus:
        request.currentStatus,

      requestedStatus:
        request.requestedStatus,

      reason:
        'TRANSITION_NOT_ALLOWED',
    };
  }

  return {
    allowed:
      true,

    currentStatus:
      request.currentStatus,

    requestedStatus:
      request.requestedStatus,

    reason:
      'ALLOWED',
  };
}