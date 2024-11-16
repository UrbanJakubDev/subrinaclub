/*
  Warnings:

  - You are about to drop the column `bonusPoints` on the `Transaction` table. All the data in the column will be lost.
  - The `acceptedBonusOrder` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sentBonusOrder` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endDateTime` to the `SavingPeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `SavingPeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarterDateTime` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavingPeriod" ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bonusPoints",
ADD COLUMN     "bonusPrice" INTEGER DEFAULT 0,
ADD COLUMN     "quarterDateTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "acceptedBonusOrder",
ADD COLUMN     "acceptedBonusOrder" TIMESTAMP(3),
DROP COLUMN "sentBonusOrder",
ADD COLUMN     "sentBonusOrder" TIMESTAMP(3);
