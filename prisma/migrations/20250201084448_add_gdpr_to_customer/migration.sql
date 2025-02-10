/*
  Warnings:

  - You are about to drop the column `gdpr` on the `Dealer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "gdpr" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "gdpr";
