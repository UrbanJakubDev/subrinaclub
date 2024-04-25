/*
  Warnings:

  - You are about to drop the column `change` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `date_from` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `date_to` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `period_full` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `points_current` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `voucher` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `boss` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `boss_since_q` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `boss_since_year` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `registrated_since` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `registration_number` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `registrated_since` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `registration_number` on the `Dealer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Dealer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('LIFETIME', 'TWO_YEAR_SAVING');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW');

-- DropIndex
DROP INDEX "Customer_public_id_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "change",
DROP COLUMN "date_from",
DROP COLUMN "date_to",
DROP COLUMN "description",
DROP COLUMN "period",
DROP COLUMN "period_full",
DROP COLUMN "points",
DROP COLUMN "points_current",
DROP COLUMN "value",
DROP COLUMN "voucher",
DROP COLUMN "year",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "openedAt" TIMESTAMP(3),
ADD COLUMN     "type" "AccountType" NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "birth_date",
DROP COLUMN "boss",
DROP COLUMN "boss_since_q",
DROP COLUMN "boss_since_year",
DROP COLUMN "full_name",
DROP COLUMN "public_id",
DROP COLUMN "registrated_since",
DROP COLUMN "registration_number",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "bossId" INTEGER DEFAULT 0,
ADD COLUMN     "bossSinceQ" INTEGER DEFAULT 0,
ADD COLUMN     "bossSinceYear" INTEGER DEFAULT 0,
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "registratedSince" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "salon_name" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "town" DROP NOT NULL,
ALTER COLUMN "psc" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "full_name",
DROP COLUMN "registrated_since",
DROP COLUMN "registration_number",
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL,
ADD COLUMN     "registratedSince" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" INTEGER DEFAULT 0,
ALTER COLUMN "ico" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "town" DROP NOT NULL,
ALTER COLUMN "psc" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SalesManager" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "fullName" VARCHAR(255) NOT NULL,
    "birthDate" TIMESTAMP(3),
    "registrationNumber" INTEGER NOT NULL DEFAULT 0,
    "ico" VARCHAR(40) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100) DEFAULT '',
    "registratedSince" TIMESTAMP(3),

    CONSTRAINT "SalesManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT,
    "bonusId" INTEGER,
    "acceptedBonusOrder" TIMESTAMP(3),
    "sentBonusOrder" TIMESTAMP(3),
    "accountId" INTEGER NOT NULL,
    "periodId" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "aditional_price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesManager_id_key" ON "SalesManager"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesManager_publicId_key" ON "SalesManager"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_publicId_key" ON "Customer"("publicId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
