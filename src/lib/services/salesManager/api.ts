import { SalesManagerRepository } from "@/lib/repositories/SalesManagerRepository";
import { Customer } from "@/types/customer";



export class SalesManagerAPI {
    constructor(private repository: SalesManagerRepository) { }

    async getTransactionsForCustomerAccounts(salesManagerId: number, year: number) {

        const transactions = await this.repository.getTransactionsForCustomerAccounts(salesManagerId, year);
        return transactions;
    }

    async getCustomersWithAccounts(salesManagerId: number) {

        const customers = await this.repository.getCustomersWithAccounts(salesManagerId);

        // Return registration number as string
        return customers.map((customer: Customer) => ({
            ...customer,
            registrationNumber: customer.registrationNumber?.toString() ?? '',
            account: {
                ...customer.account,
                averagePointsBeforeSalesManager: customer.account.averagePointsBeforeSalesManager ? Math.round(customer.account.averagePointsBeforeSalesManager) : 0
            }
        }));

    }

    async getCustomersCountsInfo(salesManagerId: number, year: number) {
        return await this.repository.getCustomersCountsInfo(salesManagerId, year);
    }
}
