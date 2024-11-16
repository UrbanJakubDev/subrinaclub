-- DropForeignKey
ALTER TABLE "SalesManager" DROP CONSTRAINT "SalesManager_dealerId_fkey";

-- DropIndex
DROP INDEX "SalesManager_dealerId_key";

-- AlterTable
ALTER TABLE "SalesManager" ALTER COLUMN "dealerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SalesManager" ADD CONSTRAINT "SalesManager_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
