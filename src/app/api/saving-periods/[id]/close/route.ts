import { prisma } from "@/lib/db/pgDBClient";
import { NextResponse } from "next/server";

export async function POST(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const savingPeriodId = parseInt(params.id);

      // Parse the request body for optional start dates
      const { startYear, startQuarter, createNewPeriod = true } = await request.json();

      // Get the current saving period
      const currentPeriod = await prisma.savingPeriod.findUnique({
         where: { id: savingPeriodId },
         include: { account: true }
      });

      if (!currentPeriod) {
         return NextResponse.json(
            { error: "Saving period not found" },
            { status: 404 }
         );
      }

      // Log The current period

      // Calculate next quarter and year
      let nextStartQuarter: number;
      let nextStartYear: number;

      if (startYear && startQuarter) {
         // Use provided dates
         nextStartYear = startYear;
         nextStartQuarter = startQuarter;
      } else {
         // Use default calculation based on current period's end
         nextStartQuarter = currentPeriod.endQuarter + 1;
         nextStartYear = currentPeriod.endYear;

         if (nextStartQuarter > 4) {
            nextStartQuarter = 1;
            nextStartYear++;
         }
      }

      // Calculate end date (8 quarters from start)
      let nextEndQuarter = nextStartQuarter;
      let nextEndYear = nextStartYear;

      // Add 7 quarters (as we already moved 1 quarter ahead for start)
      for (let i = 0; i < 7; i++) {
         nextEndQuarter++;
         if (nextEndQuarter > 4) {
            nextEndQuarter = 1;
            nextEndYear++;
         }
      }


      // Close current period
      await prisma.savingPeriod.update({
         where: { id: savingPeriodId },
         data: {
            status: 'CLOSED',
            closedAt: new Date(),
            closeReason: 'Automaticky uzavřeno' + (createNewPeriod ? ' - vytvořeno nové šetřící období' : '')
         }
      });

      if (!createNewPeriod) {
         return NextResponse.json({ success: true });
      }

      // Create new period
      const newPeriod = await prisma.savingPeriod.create({
         data: {
            status: 'ACTIVE',
            startYear: nextStartYear,
            startQuarter: nextStartQuarter,
            endYear: nextEndYear,
            endQuarter: nextEndQuarter,
            startDateTime: new Date(nextStartYear, (nextStartQuarter - 1) * 3, 1),
            endDateTime: new Date(nextEndYear, (nextEndQuarter - 1) * 3 + 2, 31),
            availablePoints: 0,
            totalDepositedPoints: 0,
            totalWithdrawnPoints: 0,
            accountId: currentPeriod.accountId
         }
      });

      return NextResponse.json({ 
         success: true, 
         newPeriod,
         message: 'Saving period closed and new period created successfully'
      });

   } catch (error) {
      console.error('Error handling saving period closure:', error);
      return NextResponse.json(
         { 
            error: "Failed to handle saving period closure", 
            details: error instanceof Error ? error.message : 'Unknown error'
         },
         { status: 500 }
      );
   }
} 