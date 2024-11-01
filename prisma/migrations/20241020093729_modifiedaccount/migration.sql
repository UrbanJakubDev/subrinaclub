/*
  Warnings:

  - The values [WITHDRAW] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `balance` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `balancePointsCorrection` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `SavingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `SavingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `savingEndDate` on the `SavingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `savingStartDate` on the `SavingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `bonusName` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SavingPeriodStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('DEPOSIT', 'WITHDRAWAL');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- DropIndex
DROP INDEX "idx_saving_period_account_id";

-- DropIndex
DROP INDEX "idx_saving_period_id";

-- DropIndex
DROP INDEX "idx_transaction_account_id";

-- DropIndex
DROP INDEX "idx_transaction_id";

-- DropIndex
DROP INDEX "idx_transaction_quarter";

-- DropIndex
DROP INDEX "idx_transaction_year";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "balance",
DROP COLUMN "balancePointsCorrection",
ADD COLUMN     "currentYearPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalDeposits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithdrawn" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SavingPeriod" DROP COLUMN "active",
DROP COLUMN "balance",
DROP COLUMN "savingEndDate",
DROP COLUMN "savingStartDate",
ADD COLUMN     "availablePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "closeReason" TEXT,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "endQuarter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startQuarter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "SavingPeriodStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalDeposits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithdrawn" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bonusName",
ADD COLUMN     "savingPeriodId" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "points" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_customerId_key" ON "Account"("customerId");

-- CreateIndex
CREATE INDEX "SavingPeriod_accountId_status_idx" ON "SavingPeriod"("accountId", "status");

-- CreateIndex
CREATE INDEX "SavingPeriod_startYear_startQuarter_idx" ON "SavingPeriod"("startYear", "startQuarter");

-- CreateIndex
CREATE INDEX "SavingPeriod_endYear_endQuarter_idx" ON "SavingPeriod"("endYear", "endQuarter");

-- CreateIndex
CREATE INDEX "Transaction_accountId_year_quarter_idx" ON "Transaction"("accountId", "year", "quarter");

-- CreateIndex
CREATE INDEX "Transaction_savingPeriodId_idx" ON "Transaction"("savingPeriodId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingPeriodId_fkey" FOREIGN KEY ("savingPeriodId") REFERENCES "SavingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_account_customer_id" RENAME TO "Account_customerId_idx";

-- RenameIndex
ALTER INDEX "idx_account_id" RENAME TO "Account_id_idx";
