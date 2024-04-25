/*
  Warnings:

  - You are about to drop the column `status` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SalesManager` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_salesManagerId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "status",
ADD COLUMN     "active" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SalesManager" DROP COLUMN "status",
ADD COLUMN     "active" INTEGER NOT NULL DEFAULT 1;
