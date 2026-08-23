/**
 * TRUST-CLUB-V1
 * PHASE 5.14
 *
 * Server Application Exposure Boundary Contract
 *
 * This file defines the permitted application exposure model
 * for certified Trust Club server operations.
 *
 * It does not create:
 * - an HTTP endpoint,
 * - a Next.js Route Handler,
 * - a Server Action,
 * - a public API,
 * - an authentication mechanism,
 * - an authorization mechanism,
 * - a persistence mechanism,
 * - or a lifecycle authority.
 */

export type TrustClubApplicationOperation =
  | 'CREATE_ACTION'
  | 'READ_ACTION'
  | 'TRANSITION_ACTION'
  | 'RECORD_OUTCOME'
  | 'READ_OUTCOMES'
  | 'READ_ACTION_AGGREGATE';

export type TrustClubApplicationOperationMode =
  | 'COMMAND'
  | 'QUERY';

export interface TrustClubApplicationOperationDefinition {
  operation:
    TrustClubApplicationOperation;

  mode:
    TrustClubApplicationOperationMode;

  publicEndpointCreated:
    false;

  serverActionCreated:
    false;

  authenticationOwned:
    false;

  authorizationOwned:
    false;

  persistenceOwned:
    false;

  lifecycleOwned:
    false;
}

export const TRUST_CLUB_APPLICATION_OPERATION_DEFINITIONS:
  readonly TrustClubApplicationOperationDefinition[] = [
    {
      operation:
        'CREATE_ACTION',

      mode:
        'COMMAND',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },

    {
      operation:
        'READ_ACTION',

      mode:
        'QUERY',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },

    {
      operation:
        'TRANSITION_ACTION',

      mode:
        'COMMAND',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },

    {
      operation:
        'RECORD_OUTCOME',

      mode:
        'COMMAND',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },

    {
      operation:
        'READ_OUTCOMES',

      mode:
        'QUERY',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },

    {
      operation:
        'READ_ACTION_AGGREGATE',

      mode:
        'QUERY',

      publicEndpointCreated:
        false,

      serverActionCreated:
        false,

      authenticationOwned:
        false,

      authorizationOwned:
        false,

      persistenceOwned:
        false,

      lifecycleOwned:
        false,
    },
  ] as const;

/**
 * Boundary rule.
 *
 * Phase 5.14 defines an application exposure contract only.
 * It does not expose Trust Club operations publicly.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_BOUNDARY_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_CREATE_PUBLIC_ENDPOINT' as const;

/**
 * Server Action rule.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_SERVER_ACTION_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_CREATE_NEXT_SERVER_ACTION' as const;

/**
 * Authentication rule.
 *
 * Authentication remains outside this contract.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_AUTHENTICATION_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_OWN_AUTHENTICATION' as const;

/**
 * Authorization rule.
 *
 * Existing certified Trust Club authorization authority
 * is not replaced by the application exposure boundary.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_AUTHORIZATION_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_REPLACE_CERTIFIED_AUTHORIZATION_AUTHORITY' as const;

/**
 * Persistence rule.
 *
 * Existing certified persistence boundaries remain authoritative.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_PERSISTENCE_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_OWN_PERSISTENCE' as const;

/**
 * Lifecycle rule.
 *
 * Existing certified lifecycle and workflow authorities
 * remain authoritative.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_LIFECYCLE_RULE =
  'APPLICATION_EXPOSURE_CONTRACT_DOES_NOT_OWN_ACTION_LIFECYCLE' as const;

/**
 * External-completion rule.
 *
 * Exposure of an internal operation, if authorized in a later phase,
 * must never be interpreted as proof of external completion.
 */
export const TRUST_CLUB_APPLICATION_EXPOSURE_EXTERNAL_RULE =
  'APPLICATION_EXPOSURE_DOES_NOT_ESTABLISH_EXTERNAL_COMPLETION' as const;