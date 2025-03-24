import { accountService } from "@/lib/services/account";
import { NextRequest, NextResponse } from "next/server";

// Get account by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const account = await accountService.getAccountWithSavingPeriods(accountId);
    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// Update account by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Update only the two editable fields
    const updateData = {
      averagePointsBeforeSalesManager: data.averagePointsBeforeSalesManager,
      lifetimePointsCorrection: data.lifetimePointsCorrection,
      // We need to include customerId for the update operation
      customerId: data.customerId,
    };

    // Update the account
    await accountService.update(accountId, updateData);
    
    // Fetch the complete updated account with customer data and saving periods
    const updatedAccount = await accountService.getAccountWithSavingPeriods(accountId);
    
    if (!updatedAccount) {
      return NextResponse.json(
        { error: "Failed to retrieve updated account" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
} 