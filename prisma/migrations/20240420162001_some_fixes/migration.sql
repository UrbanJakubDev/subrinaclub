/*
  Warnings:

  - A unique constraint covering the columns `[sales_manager_id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sales_manager_id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "sales_manager_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_sales_manager_id_key" ON "Customer"("sales_manager_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_sales_manager_id_fkey" FOREIGN KEY ("sales_manager_id") REFERENCES "SalesManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
