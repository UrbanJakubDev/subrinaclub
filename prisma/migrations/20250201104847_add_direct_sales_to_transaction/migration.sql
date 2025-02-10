/*
  Warnings:

  - You are about to drop the `conversion` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "directSale" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "conversion";

-- CreateTable
CREATE TABLE "conversion_logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tableName" VARCHAR(50) NOT NULL,
    "oldId" INTEGER NOT NULL,
    "newId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "message" TEXT NOT NULL,
    "oldData" TEXT NOT NULL,
    "newData" TEXT NOT NULL,

    CONSTRAINT "conversion_logs_pkey" PRIMARY KEY ("id")
);
