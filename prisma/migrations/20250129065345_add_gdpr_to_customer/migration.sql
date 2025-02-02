-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "averagePointsBeforeSalesManager" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "salesManagerSinceQuarter" INTEGER;

-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN     "gdpr" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "conversion" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tableName" VARCHAR(50) NOT NULL,
    "oldId" INTEGER NOT NULL,
    "newId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "message" TEXT NOT NULL,
    "oldData" TEXT NOT NULL,
    "newData" TEXT NOT NULL,

    CONSTRAINT "conversion_pkey" PRIMARY KEY ("id")
);
