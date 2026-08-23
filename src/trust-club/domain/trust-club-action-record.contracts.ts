import type {
  TrustClubActionStatus,
  TrustClubActionType,
} from './trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 *
 * Phase 4.1
 * Action Record Domain Model Contracts
 *
 * Purpose:
 * Defines the controlled domain representation of a single
 * Trust Club Action instance and its current lifecycle state.
 *
 * This file defines domain contracts only.
 *
 * It does NOT:
 * - persist Action records;
 * - create database entities;
 * - access Prisma;
 * - access Atlantis;
 * - evaluate lifecycle transitions;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - execute payments;
 * - execute banking activity;
 * - execute external services.
 */

export interface TrustClubActionRecord {
  actionId:
    string;

  actionType:
    TrustClubActionType;

  status:
    TrustClubActionStatus;

  requestedByUserId:
    string;

  memberId:
    string;

  trustId?:
    string;

  createdAt:
    string;

  updatedAt:
    string;
}

/**
 * Controlled Action-record creation input.
 *
 * A creation input represents the already established domain
 * information required to construct an Action record.
 *
 * It does not authenticate, authorize or persist anything.
 */
export interface TrustClubActionRecordCreationInput {
  actionId:
    string;

  actionType:
    TrustClubActionType;

  requestedByUserId:
    string;

  memberId:
    string;

  trustId?:
    string;

  createdAt:
    string;
}

/**
 * Controlled Action-record transition input.
 *
 * This structure combines an existing Action record with a
 * requested lifecycle status.
 *
 * Whether the transition is permitted remains the responsibility
 * of the existing Phase 4.0 Action Workflow Policy.
 */
export interface TrustClubActionRecordTransitionInput {
  record:
    TrustClubActionRecord;

  requestedStatus:
    TrustClubActionStatus;

  updatedAt:
    string;
}

/**
 * Action-record source rule.
 *
 * Phase 4.1 defines the domain representation of an Action
 * instance without creating a persistence implementation.
 */
export const TRUST_CLUB_ACTION_RECORD_DOMAIN_RULE =
  'ACTION_RECORD_IS_DOMAIN_STATE_NOT_PERSISTENCE_IMPLEMENTATION' as const;

/**
 * Initial-status rule.
 *
 * A newly constructed Action record begins in DRAFT status.
 */
export const TRUST_CLUB_ACTION_RECORD_INITIAL_STATUS_RULE =
  'NEW_ACTION_RECORD_BEGINS_IN_DRAFT' as const;

/**
 * Lifecycle-policy boundary.
 *
 * Action-record state does not determine whether a requested
 * status transition is valid.
 *
 * Transition validity remains governed by the Phase 4.0
 * Action Workflow Policy.
 */
export const TRUST_CLUB_ACTION_RECORD_WORKFLOW_RULE =
  'ACTION_RECORD_DOES_NOT_REPLACE_ACTION_WORKFLOW_POLICY' as const;

/**
 * Authorization boundary.
 *
 * Possession of an Action record does not itself authorize the
 * underlying Trust action.
 */
export const TRUST_CLUB_ACTION_RECORD_AUTHORIZATION_RULE =
  'ACTION_RECORD_EXISTENCE_IS_NOT_ACTION_AUTHORIZATION' as const;