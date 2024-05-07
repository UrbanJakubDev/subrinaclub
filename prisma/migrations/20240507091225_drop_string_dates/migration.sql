/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `registratedSince` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "birthDate",
DROP COLUMN "registratedSince";
