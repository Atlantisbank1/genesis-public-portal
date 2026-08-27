import {
  PrismaPg,
} from '@prisma/adapter-pg';

import {
  PrismaClient,
} from '../../../generated/prisma/client';

import type {
  TrustClubTrustRecord,
} from '../../domain/trust-club-trust-record.contracts';

import type {
  TrustClubTrustRecordRepository,
} from '../trust-club-trust-record.repository';

import type {
  TrustClubPersistenceResult,
} from '../trust-club-action.repository';

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
      'DATABASE_URL is required for Canonical Trust Registry persistence.',
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
 * TRUST-CLUB-V1
 *
 * Phase 9.1-R28
 * Canonical Trust Member Read Prisma Adapter
 *
 * Persistence ownership:
 * - TrustClubTrustRecord only.
 *
 * Read capabilities:
 * - Canonical Trust ID;
 * - formation Action ID;
 * - Trust Club Member ID.
 *
 * Member lookup:
 * - uses the existing memberId stored on the Canonical Trust Record;
 * - returns all Canonical Trust Records belonging to that member;
 * - does not impose one-Trust-per-Member cardinality;
 * - does not establish or infer ownership.
 *
 * This adapter does NOT:
 * - control Action lifecycle;
 * - transition Action state;
 * - create Action Outcomes;
 * - allocate Trust IDs;
 * - establish Trust formation;
 * - establish authorization;
 * - authenticate users;
 * - resolve User identity to Member identity;
 * - execute payments;
 * - access Atlantis;
 * - execute external services.
 */

export class TrustClubTrustRecordPrismaAdapter
  implements TrustClubTrustRecordRepository {
  private readonly prisma:
    PrismaClient;

  constructor(
    prisma?: PrismaClient,
  ) {
    this.prisma =
      prisma ??
      createPrismaClient();
  }

  async saveTrustRecord(
    record:
      TrustClubTrustRecord,
  ): Promise<
    TrustClubPersistenceResult<
      TrustClubTrustRecord
    >
  > {
    const persisted =
      await this.prisma
        .trustClubTrustRecord
        .upsert({
          where: {
            trustId:
              record.trustId,
          },

          create: {
            trustId:
              record.trustId,

            formationActionId:
              record.formationActionId,

            memberId:
              record.memberId,

            trustType:
              record.trustType,

            establishedAt:
              record.establishedAt,

            createdAt:
              record.createdAt,

            updatedAt:
              record.updatedAt,
          },

          update: {
            formationActionId:
              record.formationActionId,

            memberId:
              record.memberId,

            trustType:
              record.trustType,

            establishedAt:
              record.establishedAt,

            updatedAt:
              record.updatedAt,
          },
        });

    return {
      value:
        persisted,

      persisted:
        true,
    };
  }

  async findByTrustId(
    trustId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  > {
    return this.prisma
      .trustClubTrustRecord
      .findUnique({
        where: {
          trustId,
        },
      });
  }

  async findByFormationActionId(
    formationActionId:
      string,
  ): Promise<
    TrustClubTrustRecord | null
  > {
    return this.prisma
      .trustClubTrustRecord
      .findUnique({
        where: {
          formationActionId,
        },
      });
  }

  async findByMemberId(
    memberId:
      string,
  ): Promise<
    TrustClubTrustRecord[]
  > {
    return this.prisma
      .trustClubTrustRecord
      .findMany({
        where: {
          memberId,
        },

        orderBy: [
          {
            establishedAt:
              'asc',
          },
          {
            trustId:
              'asc',
          },
        ],
      });
  }

  async disconnect():
    Promise<void> {
    await this.prisma.$disconnect();
  }
}