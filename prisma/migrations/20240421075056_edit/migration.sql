/*
  Warnings:

  - You are about to drop the column `bossId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `bossSinceQ` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `bossSinceYear` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `dealer_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `sales_manager_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `salon_name` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dealerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salesManagerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dealerId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesManagerId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_dealer_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_sales_manager_id_fkey";

-- DropIndex
DROP INDEX "Customer_dealer_id_key";

-- DropIndex
DROP INDEX "Customer_sales_manager_id_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "bossId",
DROP COLUMN "bossSinceQ",
DROP COLUMN "bossSinceYear",
DROP COLUMN "dealer_id",
DROP COLUMN "sales_manager_id",
DROP COLUMN "salon_name",
ADD COLUMN     "dealerId" INTEGER NOT NULL,
ADD COLUMN     "salesManagerId" INTEGER NOT NULL,
ADD COLUMN     "salesManagerSinceQ" INTEGER DEFAULT 0,
ADD COLUMN     "salesManagerSinceYear" INTEGER DEFAULT 0,
ADD COLUMN     "salonName" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_dealerId_key" ON "Customer"("dealerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_salesManagerId_key" ON "Customer"("salesManagerId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_salesManagerId_fkey" FOREIGN KEY ("salesManagerId") REFERENCES "SalesManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
