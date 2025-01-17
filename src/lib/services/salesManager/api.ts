import { SalesManagerRepository } from "@/lib/repositories/SalesManagerRepository";

export class SalesManagerAPI {
    constructor(private repository: SalesManagerRepository) {}

    async getTransactionsForCustomerAccounts(salesManagerId: number, year: number) {
        return await this.repository.getTransactionsForCustomerAccounts(salesManagerId, year);
    }

    async getCustomersWithAccounts(salesManagerId: number) {
        return await this.repository.getCustomersWithAccounts(salesManagerId);
    }

    async getCustomersCountsInfo(salesManagerId: number, year: number) {
        return await this.repository.getCustomersCountsInfo(salesManagerId, year);
    }
}
