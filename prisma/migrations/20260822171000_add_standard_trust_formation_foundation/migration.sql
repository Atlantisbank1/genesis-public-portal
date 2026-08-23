-- CreateTable
CREATE TABLE "trust_club_standard_trust_formations" (
    "actionId" TEXT NOT NULL,
    "trustName" TEXT,
    "trustPurpose" TEXT,
    "settlorName" TEXT,
    "trusteeName" TEXT,
    "beneficiaryName" TEXT,
    "protectorName" TEXT,
    "initialPropertyDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_standard_trust_formations_pkey" PRIMARY KEY ("actionId")
);

-- AddForeignKey
ALTER TABLE "trust_club_standard_trust_formations" ADD CONSTRAINT "trust_club_standard_trust_formations_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "trust_club_action_records"("actionId") ON DELETE RESTRICT ON UPDATE CASCADE;
