-- CreateIndex
CREATE INDEX "idx_account_id" ON "Account"("id");

-- CreateIndex
CREATE INDEX "idx_account_customer_id" ON "Account"("customerId");

-- CreateIndex
CREATE INDEX "idx_customer_id" ON "Customer"("id");

-- CreateIndex
CREATE INDEX "idx_customer_full_name" ON "Customer"("fullName");

-- CreateIndex
CREATE INDEX "idx_customer_sales_manager_id" ON "Customer"("salesManagerId");

-- CreateIndex
CREATE INDEX "idx_transaction_id" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "idx_transaction_year" ON "Transaction"("year");

-- CreateIndex
CREATE INDEX "idx_transaction_quarter" ON "Transaction"("quarter");

-- CreateIndex
CREATE INDEX "idx_transaction_account_id" ON "Transaction"("accountId");
