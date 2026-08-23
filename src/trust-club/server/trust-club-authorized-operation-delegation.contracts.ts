import type {
  TrustClubAuthorizationContext,
} from '../domain/trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.21
 *
 * Authorized Operation Delegation Contracts
 *
 * Purpose:
 *
 * Defines the controlled delegation boundary between an
 * established Authorization Context and the six certified
 * Server Application Gateway operation categories.
 *
 * This contract does NOT:
 * - authenticate users;
 * - verify credentials;
 * - resolve authentication sources;
 * - assemble Authentication Context;
 * - assemble Authorization Context;
 * - authorize Trust actions;
 * - replace authorization orchestration;
 * - duplicate the CREATE_ACTION authorization gate;
 * - execute Application Gateway operations;
 * - access persistence;
 * - access Prisma;
 * - access repositories;
 * - modify certified Gateway operations;
 * - create public application exposure;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - establish external completion.
 */

export type TrustClubAuthorizedOperation =
  | 'CREATE_ACTION'
  | 'READ_ACTION'
  | 'TRANSITION_ACTION'
  | 'RECORD_OUTCOME'
  | 'READ_OUTCOMES'
  | 'READ_ACTION_AGGREGATE';

export type TrustClubAuthorizedOperationDelegationStatus =
  | 'AUTHORIZATION_CONTEXT_ABSENT'
  | 'DELEGATION_READY';

export interface TrustClubAuthorizedOperationDelegationInput {
  authorizationContext:
    TrustClubAuthorizationContext | null;

  operation:
    TrustClubAuthorizedOperation;
}

export interface TrustClubAuthorizedOperationDelegationResult {
  status:
    TrustClubAuthorizedOperationDelegationStatus;

  operation:
    TrustClubAuthorizedOperation;

  authorizationContext:
    TrustClubAuthorizationContext | null;
}

/**
 * Authentication boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_AUTHENTICATION_RULE =
  'OPERATION_DELEGATION_CONSUMES_ESTABLISHED_AUTHORIZATION_CONTEXT' as const;

/**
 * Fail-closed boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_FAIL_CLOSED_RULE =
  'OPERATION_DELEGATION_FAILS_CLOSED_WITHOUT_AUTHORIZATION_CONTEXT' as const;

/**
 * Operation boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_OPERATION_RULE =
  'OPERATION_DELEGATION_IS_LIMITED_TO_CERTIFIED_APPLICATION_GATEWAY_OPERATIONS' as const;

/**
 * CREATE_ACTION already owns its certified authorization gate.
 *
 * Phase 5.21 must not duplicate or replace that authority.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_CREATE_AUTHORIZATION_RULE =
  'CREATE_ACTION_PRESERVES_EXISTING_CERTIFIED_AUTHORIZATION_GATE' as const;

/**
 * Lifecycle progression remains separate from underlying
 * Action authorization.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_TRANSITION_RULE =
  'TRANSITION_DELEGATION_DOES_NOT_REDEFINE_ACTION_LIFECYCLE_AUTHORITY' as const;

/**
 * Read and outcome operations remain governed by their existing
 * certified operation boundaries.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_EXISTING_OPERATION_RULE =
  'DELEGATION_PRESERVES_EXISTING_CERTIFIED_OPERATION_AUTHORITY' as const;

/**
 * Delegation authority.
 *
 * This phase establishes readiness for controlled delegation.
 * It does not itself execute a Gateway operation.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_EXECUTION_RULE =
  'DELEGATION_CONTRACT_DOES_NOT_EXECUTE_APPLICATION_GATEWAY_OPERATION' as const;

/**
 * Persistence boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_PERSISTENCE_RULE =
  'OPERATION_DELEGATION_DOES_NOT_ACCESS_PERSISTENCE' as const;

/**
 * Mutation boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_MUTATION_RULE =
  'OPERATION_DELEGATION_DOES_NOT_MODIFY_CERTIFIED_GATEWAY_OPERATIONS' as const;

/**
 * Exposure boundary.
 */
export const TRUST_CLUB_AUTHORIZED_OPERATION_DELEGATION_EXPOSURE_RULE =
  'OPERATION_DELEGATION_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;