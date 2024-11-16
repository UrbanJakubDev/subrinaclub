-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bonusId" INTEGER;

-- CreateTable
CREATE TABLE "Bonus" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "points" INTEGER DEFAULT 0,
    "price" INTEGER DEFAULT 0,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_bonus_id" ON "Bonus"("id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
