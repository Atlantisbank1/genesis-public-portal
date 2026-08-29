-- AlterTable
ALTER TABLE "trust_club_invitations"
ADD COLUMN "paymentAccessTokenHash" TEXT,
ADD COLUMN "paymentAccessExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_invitations_paymentAccessTokenHash_key"
ON "trust_club_invitations"("paymentAccessTokenHash");