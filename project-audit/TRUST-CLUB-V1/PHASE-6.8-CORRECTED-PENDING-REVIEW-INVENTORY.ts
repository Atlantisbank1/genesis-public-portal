import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "../../src/generated/prisma/client";

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

async function main() {
  const records =
    await prisma.trustClubActionRecord.findMany({
      where: {
        status:
          "PENDING_REVIEW",
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

      orderBy: {
        createdAt:
          "asc",
      },
    });

  console.log(
    JSON.stringify(
      {
        pendingReviewCount:
          records.length,

        records,
      },
      null,
      2,
    ),
  );

  console.log("");

  console.log(
    "CORRECTED PENDING REVIEW INVENTORY: PASS",
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
