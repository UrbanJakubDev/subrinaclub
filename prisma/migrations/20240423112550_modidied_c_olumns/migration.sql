/*
  Warnings:

  - You are about to drop the column `bonusId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `periodId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Bonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quarter` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_periodId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bonusId",
DROP COLUMN "periodId",
ADD COLUMN     "quarter" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "acceptedBonusOrder" SET DATA TYPE TEXT,
ALTER COLUMN "sentBonusOrder" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Bonus";

-- DropTable
DROP TABLE "Period";
