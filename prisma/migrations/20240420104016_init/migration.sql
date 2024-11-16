-- CreateTable
CREATE TABLE "Dealer" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "registration_number" INTEGER NOT NULL DEFAULT 0,
    "ico" VARCHAR(40) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL DEFAULT '',
    "registrated_since" TIMESTAMP(3),
    "address" VARCHAR(255) NOT NULL,
    "town" VARCHAR(255) NOT NULL,
    "psc" VARCHAR(255) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "full_name" VARCHAR(255) NOT NULL,
    "birth_date" TIMESTAMP(3),
    "registration_number" INTEGER NOT NULL DEFAULT 0,
    "ico" VARCHAR(40) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL DEFAULT '',
    "registrated_since" TIMESTAMP(3),
    "salon_name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "town" VARCHAR(255) NOT NULL,
    "psc" VARCHAR(255) NOT NULL,
    "note" TEXT NOT NULL,
    "boss" INTEGER NOT NULL DEFAULT 0,
    "boss_since_q" INTEGER NOT NULL DEFAULT 0,
    "boss_since_year" INTEGER NOT NULL DEFAULT 0,
    "dealer_id" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "period" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(255) NOT NULL DEFAULT '',
    "date_from" VARCHAR(50) NOT NULL DEFAULT '',
    "date_to" VARCHAR(50) NOT NULL DEFAULT '',
    "voucher" VARCHAR(50) NOT NULL DEFAULT '',
    "value" INTEGER NOT NULL DEFAULT 0,
    "points_current" INTEGER NOT NULL DEFAULT 0,
    "change" INTEGER NOT NULL DEFAULT 0,
    "period_full" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_id_key" ON "Dealer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_public_id_key" ON "Dealer"("public_id");

-- CreateIndex
CREATE INDEX "idx_dealer_id" ON "Dealer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_public_id_key" ON "Customer"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_dealer_id_key" ON "Customer"("dealer_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
