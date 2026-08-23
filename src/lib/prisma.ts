import {
  PrismaPg,
} from '@prisma/adapter-pg';

import {
  PrismaClient,
} from '@/generated/prisma/client';

const globalForPrisma =
  globalThis as unknown as {
    genesisPrisma?:
      PrismaClient;
  };

function createGenesisPrismaClient():
  PrismaClient {
  const connectionString =
    process.env.DATABASE_URL;

  if (
    typeof connectionString !==
      'string' ||
    connectionString.trim().length ===
      0
  ) {
    throw new Error(
      'DATABASE_URL is required.',
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

export const prisma =
  globalForPrisma.genesisPrisma ??
  createGenesisPrismaClient();

if (
  process.env.NODE_ENV !==
    'production'
) {
  globalForPrisma.genesisPrisma =
    prisma;
}
