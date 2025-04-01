import { NextResponse } from "next/server";
import { transactionAPI } from "@/lib/services/transaction";

export const GET = async (req: Request) => {

   const customers = await transactionAPI.getCustomersForReportSeznamObratu()
   return NextResponse.json(customers, {
      headers: {
         'Cache-Control': 'no-store, no-cache, must-revalidate',
         'Pragma': 'no-cache',
      },
   });
}