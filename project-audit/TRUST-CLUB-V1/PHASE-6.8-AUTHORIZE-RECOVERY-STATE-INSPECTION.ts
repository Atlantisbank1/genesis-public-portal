import "dotenv/config";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "../../src/generated/prisma/client";

const actionId =
  "trust-action-b2befa93-4672-48c9-bfa7-9f96c2c41548";

const connectionString =
  process.env.DATABASE_URL;

if (
  typeof connectionString !== "string" ||
  connectionString.trim().length === 0
) {
  throw new Error(
    "DATABASE_URL_REQUIRED",
  );
}

const adapter =
  new PrismaPg({
    connectionString,
  });

const prisma =
  new PrismaClient({
    adapter,
  });

async function main(): Promise<void> {
  const action =
    await prisma.trustClubActionRecord.findUnique({
      where: {
        actionId,
      },

      select: {
        actionId:
          true,

        actionType:
          true,

        status:
          true,

        requestedByUserId:
          true,

        memberId:
          true,

        trustId:
          true,

        createdAt:
          true,

        updatedAt:
          true,
      },
    });

  if (!action) {
    throw new Error(
      "RECOVERY_TARGET_NOT_FOUND",
    );
  }

  const outcomeCount =
    await prisma.trustClubActionOutcome.count({
      where: {
        actionId,
      },
    });

  const updatedAtValue =
    action.updatedAt as unknown;

  const createdAtValue =
    action.createdAt as unknown;

  const inspection = {
    action,

    outcomeCount,

    runtimeInspection: {
      updatedAt: {
        typeof:
          typeof updatedAtValue,

        constructorName:
          updatedAtValue !== null &&
          typeof updatedAtValue === "object"
            ? (
                updatedAtValue as {
                  constructor?: {
                    name?: string;
                  };
                }
              ).constructor?.name ?? null
            : null,

        value:
          updatedAtValue,

        stringValue:
          String(updatedAtValue),

        hasToISOString:
          updatedAtValue !== null &&
          updatedAtValue !== undefined &&
          typeof (
            updatedAtValue as {
              toISOString?: unknown;
            }
          ).toISOString === "function",
      },

      createdAt: {
        typeof:
          typeof createdAtValue,

        constructorName:
          createdAtValue !== null &&
          typeof createdAtValue === "object"
            ? (
                createdAtValue as {
                  constructor?: {
                    name?: string;
                  };
                }
              ).constructor?.name ?? null
            : null,

        value:
          createdAtValue,

        stringValue:
          String(createdAtValue),

        hasToISOString:
          createdAtValue !== null &&
          createdAtValue !== undefined &&
          typeof (
            createdAtValue as {
              toISOString?: unknown;
            }
          ).toISOString === "function",
      },
    },
  };

  console.log(
    JSON.stringify(
      inspection,
      null,
      2,
    ),
  );

  if (
    action.status !==
      "PENDING_REVIEW"
  ) {
    throw new Error(
      "RECOVERY_STATUS_NOT_PENDING_REVIEW",
    );
  }

  if (outcomeCount !== 0) {
    throw new Error(
      "RECOVERY_OUTCOME_COUNT_CHANGED",
    );
  }

  console.log("");

  console.log(
    "FAILED AUTHORIZE RECOVERY STATE: PASS",
  );
}

main()
  .catch(
    (
      error,
    ) => {
      console.error(error);

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
