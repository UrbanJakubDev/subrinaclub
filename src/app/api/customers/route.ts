import { customerAPI } from "@/lib/services/customer"
import { NextResponse } from "next/server"


// Get customers belonging to the sales manager
export async function GET(request: Request) {
   const { searchParams } = new URL(request.url)
   const salesManagerId = searchParams.get('salesManagerId')
   if (!salesManagerId) {
      return NextResponse.json({ error: 'Sales Manager ID is required' }, { status: 400 })
   }

   const customers = await customerAPI.getCustomersWithAccounts(Number(salesManagerId))
   return NextResponse.json(customers)
}