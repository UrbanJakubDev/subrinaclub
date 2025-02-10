import { prisma } from "@/lib/db/pgDBClient";
import { NextResponse } from "next/server";

export async function PUT(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const savingPeriodId = parseInt(params.id);
      const data = await request.json();

      // Validate the data
      if (!data.startYear || !data.startQuarter || !data.endYear || !data.endQuarter) {
         return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
         );
      }

      // Update the saving period
      const updatedPeriod = await prisma.savingPeriod.update({
         where: { id: savingPeriodId },
         data: {
            startYear: data.startYear,
            startQuarter: data.startQuarter,
            endYear: data.endYear,
            endQuarter: data.endQuarter,
            startDateTime: data.startDateTime,
            endDateTime: data.endDateTime,
            status: data.status,
            closedAt: data.closedAt,
            closeReason: data.closeReason,
            updatedAt: new Date(),
         }
      });

      return NextResponse.json(updatedPeriod);
   } catch (error) {
      console.error('Error updating saving period:', error);
      return NextResponse.json(
         { error: "Failed to update saving period" },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const savingPeriodId = parseInt(params.id);

      // Get the current saving period with its account
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

      // Start a transaction to handle all the cleanup
      await prisma.$transaction(async (tx) => {
         // Delete all transactions for this period
         await tx.transaction.deleteMany({
            where: { savingPeriodId }
         });

         // If this was an active period, find and activate the previous period
         if (currentPeriod.status === 'ACTIVE') {
            const previousPeriod = await tx.savingPeriod.findFirst({
               where: {
                  accountId: currentPeriod.accountId,
                  id: { not: savingPeriodId },
                  status: { not: 'ACTIVE' }
               },
               orderBy: {
                  endDateTime: 'desc'
               }
            });

            if (previousPeriod) {
               await tx.savingPeriod.update({
                  where: { id: previousPeriod.id },
                  data: { status: 'ACTIVE' }
               });
            }
         }

         // Finally, delete the saving period
         await tx.savingPeriod.delete({
            where: { id: savingPeriodId }
         });
      });

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error('Error deleting saving period:', error);
      return NextResponse.json(
         { error: "Failed to delete saving period" },
         { status: 500 }
      );
   }
} 