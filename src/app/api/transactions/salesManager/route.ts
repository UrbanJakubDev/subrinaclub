import { transactionAPI } from "@/lib/services/transaction"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url)

   const salesManagerId = searchParams.get('salesManagerId')
   const year = searchParams.get('year')
   const quarter = searchParams.get('quarter')
   const transactions = await transactionAPI.getTransactionsForSalesManager(Number(salesManagerId), Number(year), Number(quarter))
   return NextResponse.json(transactions)
}