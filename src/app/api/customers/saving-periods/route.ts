import { NextRequest, NextResponse } from "next/server";
import { customerAPI } from "@/lib/services/customer";
export async function GET(request: NextRequest) {
    const customers = await customerAPI.getCustomersWithAccountAndActiveSavingPeriod();
    return NextResponse.json(customers);
}
