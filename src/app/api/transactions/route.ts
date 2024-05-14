import { addTransaction, getTransactionsByAccountId } from "@/db/queries/transactions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const transaction = await getTransactionsByAccountId(Number(accountId));

  return NextResponse.json(transaction);
}


export async function POST(request: Request) {
  const body = await request.json();

  try {
    const transaction = await addTransaction(body);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Error creating transaction" },
      { status: 500 }
    );
  }
}