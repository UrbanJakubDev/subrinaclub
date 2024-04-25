// pages/api/sales-managers.ts

// Import NextResponse
import { getListOfTransactionsBySalesManagerId } from "@/db/queries/salesManagers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Example API route to fetch transactions by sales manager ID and year
export async function GET(request: Request) {

   const { searchParams } = new URL(request.url)
   const id = searchParams.get('id')
   const year = searchParams.get('year')
  

  // Handle missing parameters
  if (!id || !year) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Logic to fetch transactions based on sales manager ID and year
  const transactions = await getListOfTransactionsBySalesManagerId(
    Number(id),
    Number(year)
  );

  // Return transactions with NextResponse
  return NextResponse.json(transactions);
}
