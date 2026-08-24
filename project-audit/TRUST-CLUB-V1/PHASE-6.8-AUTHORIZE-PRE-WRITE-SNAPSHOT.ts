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
      "AUTHORIZE_TARGET_ACTION_NOT_FOUND",
    );
  }

  if (
    action.actionType !==
      "CREATE_STANDARD_TRUST"
  ) {
    throw new Error(
      "AUTHORIZE_TARGET_ACTION_TYPE_MISMATCH",
    );
  }

  if (
    action.status !==
      "PENDING_REVIEW"
  ) {
    throw new Error(
      "AUTHORIZE_TARGET_ACTION_NOT_PENDING_REVIEW",
    );
  }

  const outcomes =
    await prisma.trustClubActionOutcome.findMany({
      where: {
        actionId,
      },

      select: {
        actionId:
          true,

        actionType:
          true,

        actionStatus:
          true,

        outcomeType:
          true,

        recordedAt:
          true,

        outcomeCode:
          true,

        outcomeReason:
          true,

        externalReference:
          true,
      },

      orderBy: {
        recordedAt:
          "asc",
      },
    });

  console.log(
    JSON.stringify(
      {
        snapshotType:
          "AUTHORIZE_PRE_WRITE",

        action,

        outcomeCount:
          outcomes.length,

        outcomes,
      },
      null,
      2,
    ),
  );

  console.log("");

  console.log(
    "AUTHORIZE PRE-WRITE DATABASE SNAPSHOT: PASS",
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
