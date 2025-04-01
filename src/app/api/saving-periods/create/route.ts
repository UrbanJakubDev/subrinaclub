import { NextRequest } from "next/server";
import { savingPeriodAPI } from "@/lib/services/savingPeriod";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, startYear, startQuarter } = data;

        if (!id || !startYear || !startQuarter) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Calculate end dates
        const endYear = startYear + (startQuarter === 4 ? 1 : 0);
        const endQuarter = startQuarter === 4 ? 1 : startQuarter + 1;

        const savingPeriod = await savingPeriodAPI.createSavingPeriod(id, {
            startYear,
            startQuarter,
            endYear,
            endQuarter
        });

        if (!savingPeriod) {
            return NextResponse.json(
                { error: "Failed to create saving period" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, savingPeriod });
    } catch (error) {
        console.error('Error creating saving period:', error);
        return NextResponse.json(
            { 
                error: "Failed to create saving period",
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
