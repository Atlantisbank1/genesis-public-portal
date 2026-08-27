import {
  randomUUID,
} from 'node:crypto';

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.0
 * Canonical Trust Identity Service
 *
 * Purpose:
 * Allocates the canonical internal Trust identifier used by
 * Genesis Trust Club after verified standard Trust formation
 * reaches final completion.
 *
 * This service:
 * - creates a new cryptographically generated UUID;
 * - prefixes the UUID with the canonical GTC-TRUST namespace;
 * - returns the resulting internal Trust identifier.
 *
 * This service does NOT:
 * - persist Trust identifiers;
 * - access Prisma;
 * - access a repository;
 * - modify Action lifecycle state;
 * - authorize Action transitions;
 * - authenticate users;
 * - establish external completion;
 * - execute external services;
 * - access Atlantis.
 */

export const TRUST_CLUB_TRUST_ID_PREFIX =
  'GTC-TRUST-' as const;

export type TrustClubTrustId =
  `${typeof TRUST_CLUB_TRUST_ID_PREFIX}${string}`;

export function allocateTrustClubTrustId():
  TrustClubTrustId {
  return `${TRUST_CLUB_TRUST_ID_PREFIX}${randomUUID()}`;
}

export const TRUST_CLUB_TRUST_ID_ALLOCATION_RULE =
  'TRUST_ID_IS_ALLOCATED_ONLY_FOR_VERIFIED_FINAL_STANDARD_TRUST_COMPLETION' as const;

export const TRUST_CLUB_TRUST_ID_REASSIGNMENT_RULE =
  'EXISTING_TRUST_ID_MUST_NOT_BE_REASSIGNED' as const;

export const TRUST_CLUB_TRUST_ID_PERSISTENCE_RULE =
  'TRUST_IDENTITY_SERVICE_DOES_NOT_ACCESS_PERSISTENCE' as const;