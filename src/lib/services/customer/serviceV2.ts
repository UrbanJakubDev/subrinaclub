import { CustomerRepositoryV2 } from '@/lib/repositories/CustomerRepositoryV2'
import { 
    CustomerWithRelationsV2, 
    CustomerBasicV2, 
    CustomerListResponseV2 
} from './types'

/**
 * Customer Service V2 - Modern service layer
 * @version 2.0.0
 * @description Clean service layer that works with tRPC and specific repository methods
 */
export class CustomerServiceV2 {
    constructor(private customerRepository: CustomerRepositoryV2) {}

    /**
     * Get all customers with filtering
     * Verze 2: Migrated from api.ts with full data transformation
     * 
     * @param active - Filter by active status (optional)
     * @returns Promise<CustomerListResponseV2[]> Formatted customer list
     * 
     * @example
     * ```typescript
     * const activeCustomers = await service.getAllCustomers(true)
     * ```
     */
    async getAllCustomers(active?: boolean): Promise<CustomerListResponseV2[]> {
        // Use CustomerRepositoryV2 method with proper transformation
        const customers = await this.customerRepository.findAllWithRelations({ active })

        // Transform the data to match the service response (migrated logic from api.ts)
        return customers.map(customer => {
            const transformedCustomer: CustomerListResponseV2 = {
                id: customer.id,
                active: customer.active,
                registrationNumber: customer.registrationNumber,
                fullName: customer.fullName,
                salonName: customer.salonName,
                address: customer.address,
                town: customer.town,
                psc: customer.psc,
                phone: customer.phone,
                ico: customer.ico,
                dealer: customer.dealer ? {
                    fullName: customer.dealer.fullName
                } : null,
                salesManager: customer.salesManager ? {
                    fullName: customer.salesManager.fullName
                } : null,
                account: customer.account ? {
                    currentYearPoints: customer.account.currentYearPoints,
                    lifetimePoints: customer.account.lifetimePoints,
                    lifetimePointsCorrection: customer.account.lifetimePointsCorrection || 0,
                    lifetimePointsCorrected: customer.account.lifetimePoints + (customer.account.lifetimePointsCorrection || 0),
                    savingPeriodAvailablePoints: customer.account.savingPeriods?.[0]?.availablePoints ?? 0,
                    averagePointsBeforeSalesManager: customer.account.averagePointsBeforeSalesManager 
                        ? Math.round(customer.account.averagePointsBeforeSalesManager) 
                        : undefined
                } : null,
            }

            return transformedCustomer
        })
    }

    /**
     * Update customer's active status
     * Verze 2: Specific method for status updates with validation
     * 
     * @param id - Customer ID
     * @param active - New active status
     * @returns Promise<CustomerBasicV2> Updated customer info
     * @throws Error if customer not found
     * 
     * @example
     * ```typescript
     * const customer = await service.updateCustomerStatus(123, false)
     * ```
     */
    async updateCustomerStatus(id: number, active: boolean): Promise<CustomerBasicV2> {
        // Check if customer exists first
        const exists = await this.customerRepository.exists(id)
        if (!exists) {
            throw new Error(`Customer with ID ${id} not found`)
        }

        return await this.customerRepository.updateActiveStatus(id, active)
    }
}

// Verze 2: Type moved to types.ts 