import { NextResponse } from "next/server";
import { getBonusesForSelect } from "@/lib/services/bonus/api";

export async function GET() {
    try {
        const bonuses = await getBonusesForSelect();
        return NextResponse.json(bonuses);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch bonuses" },
            { status: 500 }
        );
    }
}
