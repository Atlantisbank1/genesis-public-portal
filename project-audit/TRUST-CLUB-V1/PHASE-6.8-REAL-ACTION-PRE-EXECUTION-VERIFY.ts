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

async function main() {
  const record =
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

  if (!record) {
    throw new Error(
      "TARGET_ACTION_NOT_FOUND",
    );
  }

  if (
    record.actionType !==
    "CREATE_STANDARD_TRUST"
  ) {
    throw new Error(
      "TARGET_ACTION_TYPE_MISMATCH",
    );
  }

  if (
    record.status !==
    "PENDING_REVIEW"
  ) {
    throw new Error(
      "TARGET_ACTION_NOT_PENDING_REVIEW",
    );
  }

  console.log(
    JSON.stringify(
      {
        targetVerified:
          true,

        record,
      },
      null,
      2,
    ),
  );

  console.log("");

  console.log(
    "REAL ACTION PRE-EXECUTION VERIFICATION: PASS",
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
