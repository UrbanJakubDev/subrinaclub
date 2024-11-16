/*
  Warnings:

  - You are about to drop the column `totalWithdrawnPonits` on the `SavingPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavingPeriod" DROP COLUMN "totalWithdrawnPonits",
ADD COLUMN     "totalWithdrawnPoints" INTEGER NOT NULL DEFAULT 0;
