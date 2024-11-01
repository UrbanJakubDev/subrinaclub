/*
  Warnings:

  - You are about to drop the column `birthDateD` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `registratedSinceD` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `totalDeposits` on the `SavingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `totalWithdrawn` on the `SavingPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "birthDateD",
DROP COLUMN "registratedSinceD",
ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "registratedSince" DATE;

-- AlterTable
ALTER TABLE "SavingPeriod" DROP COLUMN "totalDeposits",
DROP COLUMN "totalWithdrawn",
ADD COLUMN     "totalDepositedPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithdrawnPonits" INTEGER NOT NULL DEFAULT 0;
