/*
  Warnings:

  - A unique constraint covering the columns `[dealerId]` on the table `SalesManager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dealerId` to the `SalesManager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesManager" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "dealerId" INTEGER NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "psc" VARCHAR(255),
ADD COLUMN     "town" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "SalesManager_dealerId_key" ON "SalesManager"("dealerId");

-- AddForeignKey
ALTER TABLE "SalesManager" ADD CONSTRAINT "SalesManager_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
