import { PrismaClient, SavingPeriod } from "@prisma/client";

export class SavingPeriodRepository {
    constructor(private prisma: PrismaClient) {}
    
    async createSavingPeriod(id: number, data: any): Promise<SavingPeriod> {
        return this.prisma.savingPeriod.create({
            data: {
                status: 'ACTIVE',
                startYear: data.startYear,
                startQuarter: data.startQuarter,
                endYear: data.endYear,
                endQuarter: data.endQuarter,
                startDateTime: new Date(data.startYear, (data.startQuarter - 1) * 3, 1),
                endDateTime: new Date(data.endYear, (data.endQuarter - 1) * 3 + 2, 31),
                availablePoints: 0,
                totalDepositedPoints: 0,
                totalWithdrawnPoints: 0,
                accountId: id
            }
        });
    }
}
