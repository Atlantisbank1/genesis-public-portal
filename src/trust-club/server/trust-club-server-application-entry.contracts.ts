import type {
  TrustClubAuthenticationSourceAdapter,
  TrustClubAuthenticationSourceRequest,
} from './trust-club-authentication-source.contracts';

import type {
  TrustClubAuthenticationAuthorizationIntegrationInput,
} from './trust-club-authentication-authorization-integration.contracts';

import type {
  TrustClubCertifiedGatewayExecutionExecutedResult,
  TrustClubCertifiedGatewayExecutionInput,
  TrustClubCertifiedGatewayOperation,
} from './trust-club-certified-gateway-execution.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.24
 *
 * Server Application Entry Orchestration Contracts
 *
 * Purpose:
 *
 * Defines the typed internal server application entry boundary
 * that coordinates the already established and certified
 * Trust Club execution chain.
 *
 * The orchestration boundary consumes:
 *
 * 1. an Authentication Source adapter and request;
 * 2. already established Authorization-domain state;
 * 3. one certified Gateway operation;
 * 4. the exact typed input belonging to that operation.
 *
 * This contract intentionally does NOT:
 * - authenticate users by itself;
 * - verify credentials by itself;
 * - create Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - grant system roles;
 * - resolve entitlements;
 * - activate entitlements;
 * - create independent authorization authority;
 * - redefine Action lifecycle authority;
 * - access persistence directly;
 * - access Prisma directly;
 * - access repositories directly;
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

export interface TrustClubServerApplicationEntryAuthenticationSource {
  adapter:
    TrustClubAuthenticationSourceAdapter;

  request:
    TrustClubAuthenticationSourceRequest;
}

export type TrustClubEstablishedAuthorizationDomainState =
  Omit<
    TrustClubAuthenticationAuthorizationIntegrationInput,
    'authenticationContext'
  >;

/**
 * Distributive omission is required here.
 *
 * A direct:
 *
 * Omit<
 *   TrustClubCertifiedGatewayExecutionInput,
 *   'preparation'
 * >
 *
 * would not safely preserve the discriminated relationship
 * between each operation identifier and its exact input type.
 *
 * This helper distributes over every member of the certified
 * Gateway execution input union.
 */
type TrustClubRemoveExecutionPreparation<T> =
  T extends unknown
    ? Omit<
        T,
        'preparation'
      >
    : never;

export type TrustClubServerApplicationEntryOperationInput =
  TrustClubRemoveExecutionPreparation<
    TrustClubCertifiedGatewayExecutionInput
  >;

export type TrustClubServerApplicationEntryInput =
  TrustClubServerApplicationEntryOperationInput & {
    authenticationSource:
      TrustClubServerApplicationEntryAuthenticationSource;

    authorizationDomainState:
      TrustClubEstablishedAuthorizationDomainState;
  };

export interface TrustClubServerApplicationEntryRejectedResult {
  status:
    'ENTRY_NOT_READY';

  operation:
    TrustClubCertifiedGatewayOperation;

  value:
    null;
}

export interface TrustClubServerApplicationEntryExecutedResult {
  status:
    'EXECUTED';

  operation:
    TrustClubCertifiedGatewayOperation;

  value:
    TrustClubCertifiedGatewayExecutionExecutedResult;
}

export type TrustClubServerApplicationEntryResult =
  | TrustClubServerApplicationEntryRejectedResult
  | TrustClubServerApplicationEntryExecutedResult;

/**
 * Authentication rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_AUTHENTICATION_RULE =
  'SERVER_APPLICATION_ENTRY_CONSUMES_EXISTING_AUTHENTICATION_BOUNDARIES' as const;

/**
 * Domain-state rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_DOMAIN_STATE_RULE =
  'SERVER_APPLICATION_ENTRY_CONSUMES_ESTABLISHED_AUTHORIZATION_DOMAIN_STATE' as const;

/**
 * Authorization rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_AUTHORIZATION_RULE =
  'SERVER_APPLICATION_ENTRY_DOES_NOT_CREATE_AUTHORIZATION_AUTHORITY' as const;

/**
 * Operation rule.
 *
 * The certified discriminated operation/input relationship must
 * remain intact through the application-entry boundary.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_OPERATION_RULE =
  'SERVER_APPLICATION_ENTRY_PRESERVES_CERTIFIED_OPERATION_INPUT_RELATIONSHIP' as const;

/**
 * Execution rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_EXECUTION_RULE =
  'SERVER_APPLICATION_ENTRY_EXECUTES_ONLY_THROUGH_CERTIFIED_EXECUTION_CHAIN' as const;

/**
 * Fail-closed rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_FAIL_CLOSED_RULE =
  'SERVER_APPLICATION_ENTRY_FAILS_CLOSED_WHEN_ANY_EXECUTION_PRECONDITION_IS_NOT_READY' as const;

/**
 * Persistence rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_PERSISTENCE_RULE =
  'SERVER_APPLICATION_ENTRY_DOES_NOT_DIRECTLY_ACCESS_PERSISTENCE' as const;

/**
 * Exposure rule.
 */
export const TRUST_CLUB_SERVER_APPLICATION_ENTRY_EXPOSURE_RULE =
  'SERVER_APPLICATION_ENTRY_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;