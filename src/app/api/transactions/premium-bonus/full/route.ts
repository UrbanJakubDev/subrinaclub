import { NextResponse } from "next/server";
import { TransactionAPI } from "@/lib/services/transaction/api";
import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { transactionAPI } from "@/lib/services/transaction";

export async function GET() {
    try {
    
        const data = await transactionAPI.premiumBonusReportFull();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in premium bonus full endpoint:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
