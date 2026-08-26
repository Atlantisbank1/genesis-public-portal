import {
  PrismaPg,
} from '@prisma/adapter-pg';

import {
  PrismaClient,
} from '../../../generated/prisma/client';

import type {
  TrustClubActionRecord,
} from '../../domain/trust-club-action-record.contracts';

import type {
  TrustClubActionOutcome,
} from '../../domain/trust-club-action-outcome.contracts';

import type {
  TrustClubActionType,
} from '../../domain/trust-club-domain.contracts';

import type {
  TrustClubPersistenceResult,
} from '../trust-club-action.repository';

import type {
  TrustClubActionPersistenceAdapter,
} from './trust-club-action-persistence.adapter';

/**
 * TRUST-CLUB-V1
 *
 * Phase 5.5
 * Concrete Prisma Persistence Adapter
 *
 * Phase 8.4 controlled extension:
 * Member Action Discovery Read Primitive
 *
 * Purpose:
 * Implements the certified Phase 5.3 persistence adapter
 * boundary using Prisma 7 and PostgreSQL.
 *
 * Persistence ownership:
 * - Trust Club Action Records
 * - Trust Club Action Outcomes
 *
 * Phase 8.4 extends the existing read capability with
 * member-scoped Action discovery using already persisted
 * Action Record fields.
 *
 * The Phase 8.4 primitive:
 * - reads existing Action Records only;
 * - filters by existing memberId;
 * - filters by existing certified actionType;
 * - does not create or modify Action Records;
 * - does not perform lifecycle transitions;
 * - does not establish authorization;
 * - does not establish authentication;
 * - does not establish entitlement;
 * - does not prove external completion.
 *
 * This adapter does NOT:
 * - control Action lifecycle authority;
 * - perform lifecycle transitions;
 * - authorize Trust actions;
 * - authenticate users;
 * - verify identity;
 * - resolve entitlements;
 * - execute payments;
 * - execute banking activity;
 * - access Atlantis;
 * - execute external services.
 */

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL;

  if (
    typeof connectionString !==
      'string' ||
    connectionString.trim().length ===
      0
  ) {
    throw new Error(
      'DATABASE_URL is required for Trust Club Prisma persistence.',
    );
  }

  const adapter =
    new PrismaPg({
      connectionString,
    });

  return new PrismaClient({
    adapter,
  });
}

/**
 * Concrete Prisma implementation of the certified
 * Trust Club Action Persistence Adapter boundary.
 */
export class TrustClubActionPrismaAdapter
  implements TrustClubActionPersistenceAdapter {
  readonly identity = {
    adapterName:
      'trust-club-prisma-postgresql',

    adapterVersion:
      '1.0.0',
  } as const;

  readonly capabilities = {
    supportsActionRecordSave:
      true,

    supportsActionRecordLookup:
      true,

    supportsMemberActionDiscovery:
      true,

    supportsActionOutcomeSave:
      true,

    supportsActionOutcomeLookup:
      true,
  } as const;

  private readonly prisma:
    PrismaClient;

  constructor(
    prisma?: PrismaClient,
  ) {
    this.prisma =
      prisma ??
      createPrismaClient();
  }

  async saveActionRecord(
    record:
      TrustClubActionRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionRecord
    >
  > {
    const persisted =
      await this.prisma
        .trustClubActionRecord
        .upsert({
          where: {
            actionId:
              record.actionId,
          },

          create: {
            actionId:
              record.actionId,

            actionType:
              record.actionType,

            status:
              record.status,

            requestedByUserId:
              record.requestedByUserId,

            memberId:
              record.memberId,

            trustId:
              record.trustId,

            createdAt:
              record.createdAt,

            updatedAt:
              record.updatedAt,
          },

          update: {
            actionType:
              record.actionType,

            status:
              record.status,

            requestedByUserId:
              record.requestedByUserId,

            memberId:
              record.memberId,

            trustId:
              record.trustId,

            createdAt:
              record.createdAt,

            updatedAt:
              record.updatedAt,
          },
        });

    return {
      value: {
        actionId:
          persisted.actionId,

        actionType:
          persisted.actionType,

        status:
          persisted.status,

        requestedByUserId:
          persisted.requestedByUserId,

        memberId:
          persisted.memberId,

        trustId:
          persisted.trustId ?? undefined,

        createdAt:
          persisted.createdAt,

        updatedAt:
          persisted.updatedAt,
      },

      persisted:
        true,
    };
  }

  async findByActionId(
    actionId:
      string,
  ): Promise<
    TrustClubActionRecord |
    null
  > {
    const record =
      await this.prisma
        .trustClubActionRecord
        .findUnique({
          where: {
            actionId,
          },
        });

    if (!record) {
      return null;
    }

    return {
      actionId:
        record.actionId,

      actionType:
        record.actionType,

      status:
        record.status,

      requestedByUserId:
        record.requestedByUserId,

      memberId:
        record.memberId,

      trustId:
        record.trustId ?? undefined,

      createdAt:
        record.createdAt,

      updatedAt:
        record.updatedAt,
    };
  }

  /**
   * Phase 8.4
   * Member-scoped Action discovery.
   *
   * Read-only query over existing persisted Action Records.
   *
   * No lifecycle mutation, authorization decision,
   * entitlement decision, or external completion proof
   * occurs within this persistence operation.
   */
  async findByMemberIdAndActionType(
    memberId:
      string,
    actionType:
      TrustClubActionType,
  ): Promise<
    readonly TrustClubActionRecord[]
  > {
    const records =
      await this.prisma
        .trustClubActionRecord
        .findMany({
          where: {
            memberId,
            actionType,
          },

          orderBy: {
            createdAt:
              'desc',
          },
        });

    return records.map(
      (
        record,
      ): TrustClubActionRecord => ({
        actionId:
          record.actionId,

        actionType:
          record.actionType,

        status:
          record.status,

        requestedByUserId:
          record.requestedByUserId,

        memberId:
          record.memberId,

        trustId:
          record.trustId ?? undefined,

        createdAt:
          record.createdAt,

        updatedAt:
          record.updatedAt,
      }),
    );
  }

  async saveActionOutcome(
    outcome:
      TrustClubActionOutcome,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubActionOutcome
    >
  > {
    const persisted =
      await this.prisma
        .trustClubActionOutcome
        .create({
          data: {
            actionId:
              outcome.actionId,

            actionType:
              outcome.actionType,

            actionStatus:
              outcome.actionStatus,

            outcomeType:
              outcome.outcomeType,

            recordedAt:
              outcome.recordedAt,

            outcomeCode:
              outcome.outcomeCode,

            outcomeReason:
              outcome.outcomeReason,

            externalReference:
              outcome.externalReference,
          },
        });

    return {
      value: {
        actionId:
          persisted.actionId,

        actionType:
          persisted.actionType,

        actionStatus:
          persisted.actionStatus,

        outcomeType:
          persisted.outcomeType,

        recordedAt:
          persisted.recordedAt,

        outcomeCode:
          persisted.outcomeCode ?? undefined,

        outcomeReason:
          persisted.outcomeReason ?? undefined,

        externalReference:
          persisted.externalReference ?? undefined,
      },

      persisted:
        true,
    };
  }

  async findOutcomesByActionId(
    actionId:
      string,
  ): Promise<
    readonly TrustClubActionOutcome[]
  > {
    const outcomes =
      await this.prisma
        .trustClubActionOutcome
        .findMany({
          where: {
            actionId,
          },

          orderBy: {
            recordedAt:
              'asc',
          },
        });

    return outcomes.map(
      (
        outcome,
      ): TrustClubActionOutcome => ({
        actionId:
          outcome.actionId,

        actionType:
          outcome.actionType,

        actionStatus:
          outcome.actionStatus,

        outcomeType:
          outcome.outcomeType,

        recordedAt:
          outcome.recordedAt,

        outcomeCode:
          outcome.outcomeCode ?? undefined,

        outcomeReason:
          outcome.outcomeReason ?? undefined,

        externalReference:
          outcome.externalReference ?? undefined,
      }),
    );
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}