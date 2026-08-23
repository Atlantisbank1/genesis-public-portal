import {
  resolveTrustClubAuthenticationContext,
} from './trust-club-authentication-integration.service';

import {
  integrateTrustClubAuthenticationWithAuthorization,
} from './trust-club-authentication-authorization-integration.service';

import {
  establishTrustClubAuthorizedApplicationGateway,
} from './trust-club-authorized-application-gateway.service';

import {
  establishTrustClubAuthorizedOperationDelegation,
} from './trust-club-authorized-operation-delegation.service';

import {
  prepareTrustClubControlledOperationExecution,
} from './trust-club-controlled-operation-execution.service';

import {
  executeTrustClubCertifiedGatewayOperation,
} from './trust-club-certified-gateway-execution.service';

import {
  getTrustClubSystemRolesForUser,
} from './trust-club-system-role.service';

import type {
  TrustClubServerApplicationEntryInput,
  TrustClubServerApplicationEntryResult,
} from './trust-club-server-application-entry.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 6.7-I.4O.3
 *
 * Server Application Entry Orchestration Service
 *
 * Purpose:
 *
 * Coordinates one internal Trust Club server application request
 * through the already established and certified execution chain.
 *
 * System Role authority is resolved from persisted server-side
 * state for the authenticated user before Authorization Context
 * assembly.
 *
 * This service does NOT grant or revoke System Roles.
 * It consumes the existing read-only persisted role resolver.
 *
 * It does NOT:
 * - authenticate users independently;
 * - verify credentials independently;
 * - create Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - grant system roles;
 * - revoke system roles;
 * - accept caller-supplied System Roles as authority;
 * - resolve entitlements;
 * - activate entitlements;
 * - create independent authorization authority;
 * - duplicate CREATE_ACTION authorization;
 * - redefine Action lifecycle authority;
 * - access persistence directly;
 * - access Prisma directly;
 * - access repositories directly;
 * - execute SQL directly;
 * - modify the certified Application Gateway;
 * - create a Next.js Route Handler;
 * - create a Server Action;
 * - create a public API;
 * - create client-side execution exposure;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - establish external completion.
 */

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_AUTHENTICATION_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_DELEGATES_AUTHENTICATION_TO_EXISTING_CERTIFIED_BOUNDARIES' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_AUTHORIZATION_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_DELEGATES_AUTHORIZATION_CONTEXT_ASSEMBLY_TO_EXISTING_CERTIFIED_BOUNDARY' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_GATEWAY_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_PRESERVES_AUTHORIZED_APPLICATION_GATEWAY_BOUNDARY' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_DELEGATION_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_PRESERVES_AUTHORIZED_OPERATION_DELEGATION_BOUNDARY' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_PREPARATION_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_PRESERVES_CONTROLLED_EXECUTION_PREPARATION_BOUNDARY' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_EXECUTION_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_EXECUTES_ONLY_THROUGH_CERTIFIED_GATEWAY_EXECUTION' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_FAIL_CLOSED_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_FAILS_CLOSED_WHEN_ANY_REQUIRED_BOUNDARY_IS_NOT_READY' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_PERSISTENCE_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_EXPOSURE_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;

export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_SERVICE_SYSTEM_ROLE_RULE =
  'SERVER_APPLICATION_ENTRY_SERVICE_RESOLVES_SYSTEM_ROLES_FROM_PERSISTED_SERVER_SIDE_STATE' as const;

function entryNotReady(
  input:
    TrustClubServerApplicationEntryInput,
): TrustClubServerApplicationEntryResult {
  return {
    status:
      'ENTRY_NOT_READY',

    operation:
      input.operation,

    value:
      null,
  };
}

/**
 * Executes one internal Trust Club application-entry request.
 *
 * Every readiness boundary fails closed.
 *
 * System Roles are resolved from persisted server-side state
 * only after Authentication Context has been established.
 *
 * No certified Gateway execution is attempted unless:
 *
 * 1. Authentication Context has been established;
 * 2. persisted System Roles have been resolved;
 * 3. Authorization Context has been established;
 * 4. Phase 5.20 confirms Authorization Context presence;
 * 5. Phase 5.21 establishes DELEGATION_READY;
 * 6. Phase 5.22 establishes EXECUTION_READY.
 *
 * Phase 5.23 remains the only execution dispatcher to the
 * certified Phase 5.15 Application Gateway.
 */
export async function executeTrustClubServerApplicationEntry(
  input:
    TrustClubServerApplicationEntryInput,
): Promise<TrustClubServerApplicationEntryResult> {
  const authenticationContext =
    await resolveTrustClubAuthenticationContext({
      adapter:
        input.authenticationSource.adapter,

      request:
        input.authenticationSource.request,
    });

  if (
    !authenticationContext.authenticated ||
    authenticationContext.authenticatedUserId ===
      null
  ) {
    return entryNotReady(
      input,
    );
  }

  const systemRoles =
    await getTrustClubSystemRolesForUser(
      authenticationContext.authenticatedUserId,
    );

  const authorizationContext =
    integrateTrustClubAuthenticationWithAuthorization({
      authenticationContext,

      ...input.authorizationDomainState,

      systemRoleContext: {
        systemRoles,
      },
    });

  const authorizedGateway =
    establishTrustClubAuthorizedApplicationGateway({
      authorizationContext,
    });

  if (
    authorizedGateway.status !==
      'AUTHORIZED_CONTEXT_PRESENT' ||
    authorizedGateway.authorizationContext ===
      null
  ) {
    return entryNotReady(
      input,
    );
  }

  const delegation =
    establishTrustClubAuthorizedOperationDelegation({
      authorizationContext:
        authorizedGateway.authorizationContext,

      operation:
        input.operation,
    });

  if (
    delegation.status !==
      'DELEGATION_READY'
  ) {
    return entryNotReady(
      input,
    );
  }

  switch (input.operation) {
    case 'CREATE_ACTION': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'CREATE_ACTION',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'CREATE_ACTION',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'CREATE_ACTION',

        value:
          execution,
      };
    }

    case 'READ_ACTION': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'READ_ACTION',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'READ_ACTION',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'READ_ACTION',

        value:
          execution,
      };
    }

    case 'TRANSITION_ACTION': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'TRANSITION_ACTION',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'TRANSITION_ACTION',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'TRANSITION_ACTION',

        value:
          execution,
      };
    }

    case 'RECORD_OUTCOME': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'RECORD_OUTCOME',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'RECORD_OUTCOME',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'RECORD_OUTCOME',

        value:
          execution,
      };
    }

    case 'READ_OUTCOMES': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'READ_OUTCOMES',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'READ_OUTCOMES',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'READ_OUTCOMES',

        value:
          execution,
      };
    }

    case 'READ_ACTION_AGGREGATE': {
      const preparation =
        prepareTrustClubControlledOperationExecution({
          delegation,

          operation:
            'READ_ACTION_AGGREGATE',

          input:
            input.input,
        });

      if (
        preparation.status !==
          'EXECUTION_READY'
      ) {
        return entryNotReady(
          input,
        );
      }

      const execution =
        await executeTrustClubCertifiedGatewayOperation({
          preparation,

          operation:
            'READ_ACTION_AGGREGATE',

          input:
            input.input,
        });

      if (
        execution.status !==
          'EXECUTED'
      ) {
        return entryNotReady(
          input,
        );
      }

      return {
        status:
          'EXECUTED',

        operation:
          'READ_ACTION_AGGREGATE',

        value:
          execution,
      };
    }
  }
}