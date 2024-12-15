import { CustomerRepository } from "@/lib/repositories/CustomerRepository";
import { Customer } from "@/types/customer";
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from "./types";

export class CustomerAPI {
    constructor(
        private customerRepository: CustomerRepository
    ) { }

    async getCustomer(id: number): Promise<CustomerWithAccountDataAndActiveSavingPeriodDTO> {
        const response = await this.customerRepository.getAccountDataWithActiveSavingPeriod(id);
        
        if (!response || !response.account) {
            throw new Error('Invalid customer data');
        }

        // Get the active saving period (assuming it's the first one in the array)
        const activeSavingPeriod = response.account.savingPeriods?.[0] || null;

        return {
            ...response,
            account: {
                id: response.account.id,
                customerId: response.id,
                active: response.active,
                createdAt: response.createdAt,
                currentYearPoints: response.account.currentYearPoints || 0,
                lifetimePoints: response.account.lifetimePoints || 0,
                savingPeriod: activeSavingPeriod ? {
                    id: activeSavingPeriod.id,
                    accountId: response.account.id,
                    status: activeSavingPeriod.status,
                    startDateTime: activeSavingPeriod.startDateTime,
                    endDateTime: activeSavingPeriod.endDateTime,
                    startYear: activeSavingPeriod.startYear,
                    startQuarter: activeSavingPeriod.startQuarter,
                    endYear: activeSavingPeriod.endYear, 
                    endQuarter: activeSavingPeriod.endQuarter,
                    availablePoints: activeSavingPeriod.availablePoints || 0,
                    totalDepositedPoints: activeSavingPeriod.totalDepositedPoints || 0,
                    totalWithdrawnPoints: activeSavingPeriod.totalWithdrawnPoints || 0,
                    createdAt: activeSavingPeriod.createdAt,
                    updatedAt: activeSavingPeriod.updatedAt,
                    closeReason: activeSavingPeriod.closeReason,
                    closedAt: activeSavingPeriod.closedAt
                } : null
            }
        };
    }


    // Get all customers with their associated accounts belonging to the sales manager
    async getCustomersWithAccounts(salesManagerId: number): Promise<Customer[]> {
        return this.customerRepository.getCustomersWithAccounts(salesManagerId);
    }
}
