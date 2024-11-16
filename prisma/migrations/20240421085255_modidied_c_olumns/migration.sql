-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_salesManagerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "dealerId" DROP NOT NULL,
ALTER COLUMN "salesManagerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_salesManagerId_fkey" FOREIGN KEY ("salesManagerId") REFERENCES "SalesManager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
