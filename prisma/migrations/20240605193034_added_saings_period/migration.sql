/*
  Warnings:

  - You are about to drop the column `balance` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `openedAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "balance",
DROP COLUMN "closedAt",
DROP COLUMN "openedAt",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "ico" DROP NOT NULL;

-- DropEnum
DROP TYPE "AccountType";

-- CreateTable
CREATE TABLE "SavingPeriod" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "savingStartDate" TIMESTAMP(3),
    "savingEndDate" TIMESTAMP(3),
    "balance" DOUBLE PRECISION NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "SavingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_saving_period_id" ON "SavingPeriod"("id");

-- CreateIndex
CREATE INDEX "idx_saving_period_account_id" ON "SavingPeriod"("accountId");

-- AddForeignKey
ALTER TABLE "SavingPeriod" ADD CONSTRAINT "SavingPeriod_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
