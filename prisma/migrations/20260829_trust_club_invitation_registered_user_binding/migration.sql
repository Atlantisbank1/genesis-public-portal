-- AlterTable
ALTER TABLE "trust_club_invitations"
ADD COLUMN "registeredUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_invitations_registeredUserId_key"
ON "trust_club_invitations"("registeredUserId");

-- AddForeignKey
ALTER TABLE "trust_club_invitations"
ADD CONSTRAINT "trust_club_invitations_registeredUserId_fkey"
FOREIGN KEY ("registeredUserId")
REFERENCES "user"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;