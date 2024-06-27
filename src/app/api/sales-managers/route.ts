// pages/api/sales-managers.ts

// Import NextResponse
import { createSalesManager, getListOfTransactionsBySalesManagerId, getSalesManagerById, updateSalesManager } from "@/db/queries/salesManagers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Example API route to fetch sales manager by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const salesManager = await getSalesManagerById(Number(id));

  return NextResponse.json(salesManager);
}
   
// Create new sales manager
export async function POST(request: Request) {
  const body = await request.json();

  try {
    const salesManager = await createSalesManager(body);
    return NextResponse.json(salesManager);
  } catch (error) {
    console.error("Error creating sales manager:", error);
    return NextResponse.json(
      { error: "Error creating sales manager" },
      { status: 500 }
    );
  }
}

// Update sales manager
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Update the sales manager in the database
  try {
    const updatedSalesManager = await updateSalesManager(Number(id), body);
    return NextResponse.json(updatedSalesManager);
  } catch (error) {
    console.error("Error updating sales manager:", error);
    return NextResponse.json(
      { error: "Error updating sales manager" },
      { status: 500 }
    );
  }
}