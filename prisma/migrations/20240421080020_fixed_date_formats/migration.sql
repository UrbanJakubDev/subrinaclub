-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "birthDate" SET DATA TYPE DATE,
ALTER COLUMN "registratedSince" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Dealer" ALTER COLUMN "registratedSince" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "SalesManager" ALTER COLUMN "birthDate" SET DATA TYPE DATE,
ALTER COLUMN "registratedSince" SET DATA TYPE DATE;
