import {
  withTrustClubPersistence,
} from '../runtime/trust-club-persistence.consumer';

export interface EstablishCanonicalStandardTrustInput {
  actionId:
    string;
}

export interface EstablishCanonicalStandardTrustResult {
  actionId:
    string;

  trustId:
    string;

  memberId:
    string;

  trustType:
    'STANDARD_TRUST';

  actionStatus:
    'COMPLETE';

  establishedAt:
    string;

  persisted:
    boolean;
}

function normalizeRequiredString(
  value:
    string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

/**
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R24
 * Canonical Standard Trust Establishment Operation
 *
 * Purpose:
 * Creates the canonical Trust Registry record for an already
 * completed Standard Trust formation.
 *
 * Establishment authority is derived only from persisted,
 * certified formation evidence:
 *
 * - Action exists;
 * - Action type is CREATE_STANDARD_TRUST;
 * - Action status is COMPLETE;
 * - Action already has a canonical trustId;
 * - exactly one COMPLETED Action Outcome exists;
 * - that Outcome belongs to the same Action;
 * - that Outcome has Action status COMPLETE;
 * - its recordedAt value becomes canonical establishedAt.
 *
 * This operation does NOT:
 * - allocate a Trust ID;
 * - transition Action lifecycle;
 * - replay COMPLETE;
 * - create an Action Outcome;
 * - verify external completion;
 * - authenticate or authorize a caller;
 * - access Prisma directly;
 * - access PostgreSQL directly;
 * - execute external services;
 * - access Atlantis.
 */
export async function establishCanonicalStandardTrust(
  input:
    EstablishCanonicalStandardTrustInput,
): Promise<EstablishCanonicalStandardTrustResult> {
  const actionId =
    normalizeRequiredString(
      input.actionId,
    );

  if (
    actionId ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_ID_REQUIRED',
    );
  }

  return withTrustClubPersistence(
    async (
      persistence,
      trustRegistry,
    ) => {
      const action =
        await persistence.findActionRecord(
          actionId,
        );

      if (
        action ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_ACTION_NOT_FOUND',
        );
      }

      if (
        action.actionType !==
          'CREATE_STANDARD_TRUST'
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_TYPE_INVALID',
        );
      }

      if (
        action.status !==
          'COMPLETE'
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUIRES_COMPLETE',
        );
      }

      const trustId =
        action.trustId ===
          undefined
          ? null
          : normalizeRequiredString(
              action.trustId,
            );

      if (
        trustId ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_ID_REQUIRED',
        );
      }

      const memberId =
        normalizeRequiredString(
          action.memberId,
        );

      if (
        memberId ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_MEMBER_ID_REQUIRED',
        );
      }

      const outcomes =
        await persistence.findActionOutcomes(
          actionId,
        );

      const completedOutcomes =
        outcomes.filter(
          (
            outcome,
          ) =>
            outcome.actionId ===
              actionId &&
            outcome.actionType ===
              'CREATE_STANDARD_TRUST' &&
            outcome.actionStatus ===
              'COMPLETE' &&
            outcome.outcomeType ===
              'COMPLETED',
        );

      if (
        completedOutcomes.length !==
          1
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_COMPLETED_OUTCOME_INVALID',
        );
      }

      const completedOutcome =
        completedOutcomes[0];

      const establishedAtRaw =
        normalizeRequiredString(
          completedOutcome.recordedAt,
        );

      if (
        establishedAtRaw ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_REQUIRED',
        );
      }

      const establishedAt =
        new Date(
          establishedAtRaw,
        );

      if (
        Number.isNaN(
          establishedAt.getTime(),
        )
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_INVALID',
        );
      }

      const existingByTrustId =
        await trustRegistry.findTrustRecord(
          trustId,
        );

      if (
        existingByTrustId !==
          null
      ) {
        if (
          existingByTrustId.formationActionId !==
            actionId ||
          existingByTrustId.memberId !==
            memberId ||
          existingByTrustId.trustType !==
            'STANDARD_TRUST'
        ) {
          throw new Error(
            'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_EXISTING_TRUST_ID_CONFLICT',
          );
        }

        return {
          actionId,

          trustId,

          memberId,

          trustType:
            'STANDARD_TRUST',

          actionStatus:
            'COMPLETE',

          establishedAt:
            existingByTrustId.establishedAt
              .toISOString(),

          persisted:
            true,
        };
      }

      const existingByFormationAction =
        await trustRegistry
          .findTrustRecordByFormationActionId(
            actionId,
          );

      if (
        existingByFormationAction !==
          null
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_FORMATION_ACTION_CONFLICT',
        );
      }

      const now =
        new Date();

      const saved =
        await trustRegistry.saveTrustRecord({
          trustId,

          formationActionId:
            actionId,

          memberId,

          trustType:
            'STANDARD_TRUST',

          establishedAt,

          createdAt:
            now,

          updatedAt:
            now,
        });

      if (
        saved.persisted !==
          true
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_NOT_PERSISTED',
        );
      }

      if (
        saved.value.trustId !==
          trustId
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_ID_MISMATCH',
        );
      }

      if (
        saved.value.formationActionId !==
          actionId
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_ID_MISMATCH',
        );
      }

      if (
        saved.value.memberId !==
          memberId
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_MEMBER_ID_MISMATCH',
        );
      }

      if (
        saved.value.trustType !==
          'STANDARD_TRUST'
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_TYPE_MISMATCH',
        );
      }

      if (
        saved.value.establishedAt
          .getTime() !==
        establishedAt.getTime()
      ) {
        throw new Error(
          'TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ESTABLISHED_AT_MISMATCH',
        );
      }

      return {
        actionId,

        trustId,

        memberId,

        trustType:
          'STANDARD_TRUST',

        actionStatus:
          'COMPLETE',

        establishedAt:
          saved.value.establishedAt
            .toISOString(),

        persisted:
          saved.persisted,
      };
    },
  );
}

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_ACTION_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUIRES_COMPLETE_CREATE_STANDARD_TRUST_ACTION' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_IDENTITY_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUIRES_EXISTING_CANONICAL_TRUST_ID' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_OUTCOME_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_REQUIRES_EXACTLY_ONE_COMPLETED_OUTCOME' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TIME_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHED_AT_IS_DERIVED_FROM_COMPLETED_OUTCOME_RECORDED_AT' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_IDEMPOTENCY_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_IS_IDEMPOTENT_FOR_MATCHING_EXISTING_RECORD' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_LIFECYCLE_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_OUTCOME_WRITE_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_DOES_NOT_CREATE_ACTION_OUTCOME' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_TRUST_ID_ALLOCATION_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_DOES_NOT_ALLOCATE_TRUST_ID' as const;

export const TRUST_CLUB_CANONICAL_STANDARD_TRUST_ESTABLISHMENT_PERSISTENCE_RULE =
  'CANONICAL_STANDARD_TRUST_ESTABLISHMENT_USES_CONTROLLED_RUNTIME_PERSISTENCE_BOUNDARY' as const;