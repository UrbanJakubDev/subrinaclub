-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_savingPeriodId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "savingPeriodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingPeriodId_fkey" FOREIGN KEY ("savingPeriodId") REFERENCES "SavingPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
