import {
  executeTrustClubCreateAction,
  executeTrustClubReadAction,
  executeTrustClubTransitionAction,
  executeTrustClubRecordOutcome,
  executeTrustClubReadOutcomes,
  executeTrustClubReadActionAggregate,
} from './trust-club-application.gateway';

import type {
  TrustClubCertifiedGatewayExecutionInput,
  TrustClubCertifiedGatewayExecutionResult,
} from './trust-club-certified-gateway-execution.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.23
 *
 * Certified Gateway Execution Service
 *
 * Purpose:
 *
 * Executes exactly one certified Trust Club Server Application
 * Gateway operation after the Phase 5.22 preparation boundary
 * has established EXECUTION_READY.
 *
 * This service performs no independent authorization.
 *
 * It does NOT:
 * - authenticate users;
 * - verify credentials;
 * - assemble Authentication Context;
 * - assemble Authorization Context;
 * - authorize Trust actions;
 * - replace authorization orchestration;
 * - duplicate the CREATE_ACTION authorization gate;
 * - redefine Action lifecycle authority;
 * - access Prisma directly;
 * - access repositories directly;
 * - modify the certified Application Gateway;
 * - create a Next.js Route Handler;
 * - create a Server Action;
 * - create a public API;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - establish external completion.
 */

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_PREPARATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_REQUIRES_EXECUTION_READY' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_OPERATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_REQUIRES_OPERATION_IDENTIFIER_MATCH' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_DISPATCH_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_DISPATCHES_ONLY_TO_CERTIFIED_APPLICATION_GATEWAY' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_AUTHORIZATION_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_DOES_NOT_CREATE_AUTHORIZATION_AUTHORITY' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_PERSISTENCE_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_CERTIFIED_GATEWAY_EXECUTION_SERVICE_EXPOSURE_RULE =
  'CERTIFIED_GATEWAY_EXECUTION_SERVICE_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;

/**
 * Executes one certified Application Gateway operation.
 *
 * Fail-closed conditions:
 *
 * 1. preparation status is not EXECUTION_READY;
 * 2. preparation operation does not match requested operation.
 */
export async function executeTrustClubCertifiedGatewayOperation(
  input:
    TrustClubCertifiedGatewayExecutionInput,
): Promise<TrustClubCertifiedGatewayExecutionResult> {
  if (
    input.preparation.status !==
      'EXECUTION_READY'
  ) {
    return {
      status:
        'EXECUTION_NOT_READY',

      operation:
        input.operation,

      value:
        null,
    };
  }

  if (
    input.preparation.operation !==
      input.operation
  ) {
    return {
      status:
        'EXECUTION_NOT_READY',

      operation:
        input.operation,

      value:
        null,
    };
  }

  switch (input.operation) {
    case 'CREATE_ACTION': {
      const value =
        await executeTrustClubCreateAction(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'CREATE_ACTION',

        value,
      };
    }

    case 'READ_ACTION': {
      const value =
        await executeTrustClubReadAction(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'READ_ACTION',

        value,
      };
    }

    case 'TRANSITION_ACTION': {
      const value =
        await executeTrustClubTransitionAction(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'TRANSITION_ACTION',

        value,
      };
    }

    case 'RECORD_OUTCOME': {
      const value =
        await executeTrustClubRecordOutcome(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'RECORD_OUTCOME',

        value,
      };
    }

    case 'READ_OUTCOMES': {
      const value =
        await executeTrustClubReadOutcomes(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'READ_OUTCOMES',

        value,
      };
    }

    case 'READ_ACTION_AGGREGATE': {
      const value =
        await executeTrustClubReadActionAggregate(
          input.input,
        );

      return {
        status:
          'EXECUTED',

        operation:
          'READ_ACTION_AGGREGATE',

        value,
      };
    }
  }
}