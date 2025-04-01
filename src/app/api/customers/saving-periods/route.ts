import { NextRequest, NextResponse } from "next/server";
import { customerAPI } from "@/lib/services/customer";
import { savingPeriodAPI } from "@/lib/services/savingPeriod";

export async function GET(request: NextRequest) {
    const customers = await customerAPI.getCustomersWithAccountAndActiveSavingPeriod();
    return NextResponse.json(customers, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
        },
    });
}

