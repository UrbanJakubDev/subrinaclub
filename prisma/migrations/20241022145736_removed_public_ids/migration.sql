/*
  Warnings:

  - You are about to drop the column `totalDeposits` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `totalWithdrawn` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `SalesManager` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Dealer_public_id_key";

-- DropIndex
DROP INDEX "SalesManager_publicId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "totalDeposits",
DROP COLUMN "totalWithdrawn",
ADD COLUMN     "totalDepositedPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithdrawnPonits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "public_id";

-- AlterTable
ALTER TABLE "SalesManager" DROP COLUMN "publicId";
