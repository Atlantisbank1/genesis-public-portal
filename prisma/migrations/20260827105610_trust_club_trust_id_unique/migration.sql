/*
  Warnings:

  - A unique constraint covering the columns `[trustId]` on the table `trust_club_action_records` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "trust_club_action_records_trustId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_action_records_trustId_key" ON "trust_club_action_records"("trustId");
