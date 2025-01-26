-- Add new columns if they don't exist
DO $$ 
BEGIN
    -- Add averagePointsBeforeSalesManager to Account if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Account' 
        AND column_name = 'averagePointsBeforeSalesManager'
    ) THEN
        ALTER TABLE "Account" 
        ADD COLUMN "averagePointsBeforeSalesManager" DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Add salesManagerSinceQuarter to Customer if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Customer' 
        AND column_name = 'salesManagerSinceQuarter'
    ) THEN
        ALTER TABLE "Customer" 
        ADD COLUMN "salesManagerSinceQuarter" INTEGER;
    END IF;

    -- Add salesManagerSinceYear to Customer if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Customer' 
        AND column_name = 'salesManagerSinceYear'
    ) THEN
        ALTER TABLE "Customer" 
        ADD COLUMN "salesManagerSinceYear" INTEGER;
    END IF;
END $$; 