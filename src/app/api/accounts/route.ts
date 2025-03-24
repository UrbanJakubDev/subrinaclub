import { accountService } from "@/lib/services/account";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get all active accounts
    const accounts = await accountService.getAllActiveAccounts();

    // Transform the data to match the expected client-side structure
    const transformedAccounts = accounts.map(account => ({
      id: account.id.toString(),
      customer: {
        fullName: account.customer.fullName,
        registrationNumber: account.customer.registrationNumber,
      },
      lifetimePoints: account.lifetimePoints,
      currentYearPoints: account.currentYearPoints,
      // Include any other fields needed by the frontend
      savingPeriods: account.savingPeriods?.map(sp => ({
        id: sp.id,
        availablePoints: sp.availablePoints,
        status: sp.status
      })) || []
    }));

    return NextResponse.json(transformedAccounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
