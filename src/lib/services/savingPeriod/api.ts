import { SavingPeriod } from "@prisma/client";
import { SavingPeriodRepository } from "@/lib/repositories/SavingPeriodRepository";

export class SavingPeriodAPI {
    constructor(private savingPeriodRepository: SavingPeriodRepository) {}

    async createSavingPeriod(id: number, data: any): Promise<SavingPeriod> {
        return this.savingPeriodRepository.createSavingPeriod(id, data);
    }
}