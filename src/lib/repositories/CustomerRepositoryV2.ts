import { Prisma, PrismaClient } from '@prisma/client'
import { 
    CustomerWithRelationsV2, 
    CustomerWithAccountAndSavingPeriodV2, 
    CustomerBasicV2 
} from '@/lib/services/customer/types'

/**
 * Customer Repository V2 - Modern approach without BaseRepository
 * @version 2.0.0
 * @description Clean repository pattern with specific methods for customer operations
 */
export class CustomerRepositoryV2 {
    constructor(private prisma: PrismaClient) {}

    /**
     * Get all customers with their related data (dealer, sales manager, account)
     * Verze 2: Specific method instead of generic findAll with complex includes
     * 
     * @param options - Query options for filtering and sorting
     * @param options.active - Filter by active status (optional)
     * @returns Promise<CustomerWithRelationsV2[]> Array of customers with their relations
     * 
     * @example
     * ```typescript
     * const customers = await repo.findAllWithRelations({ active: true })
     * ```
     */
    async findAllWithRelations(options?: {
        active?: boolean
    }): Promise<CustomerWithRelationsV2[]> {
        return this.prisma.customer.findMany({
            where: {
                active: options?.active ?? undefined,
            },
            include: {
                dealer: {
                    select: {
                        fullName: true,
                    },
                },
                salesManager: {
                    select: {
                        fullName: true,
                    },
                },
                account: {
                    select: {
                        id: true,
                        currentYearPoints: true,
                        lifetimePoints: true,
                        lifetimePointsCorrection: true,
                        averagePointsBeforeSalesManager: true,
                        savingPeriods: {
                            select: {
                                availablePoints: true,
                                status: true,
                            },
                            where: {
                                status: 'ACTIVE',
                            },
                        },
                    },
                },
            },
            orderBy: {
                fullName: 'asc',
            },
        }) as any
    }

    /**
     * Get single customer by ID with account and active saving period
     * Verze 2: Dedicated method for customer detail page
     * 
     * @param id - Customer ID
     * @returns Promise<CustomerWithAccountAndSavingPeriodV2 | null> Customer with account and saving period or null if not found
     * 
     * @example
     * ```typescript
     * const customer = await repo.findByIdWithAccountAndSavingPeriod(123)
     * if (!customer) throw new Error('Customer not found')
     * ```
     */
    async findByIdWithAccountAndSavingPeriod(
        id: number
    ): Promise<CustomerWithAccountAndSavingPeriodV2 | null> {
        return this.prisma.customer.findUnique({
            where: { id },
            include: {
                account: {
                    include: {
                        savingPeriods: {
                            where: {
                                status: 'ACTIVE',
                            },
                        },
                    },
                },
                salesManager: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                dealer: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        }) as any
    }

    /**
     * Update customer's active status
     * Verze 2: Dedicated method for status updates instead of generic update
     * 
     * @param id - Customer ID
     * @param active - New active status
     * @returns Promise<CustomerBasicV2> Updated customer basic info
     * 
     * @example
     * ```typescript
     * const customer = await repo.updateActiveStatus(123, false)
     * console.log(`Customer ${customer.fullName} deactivated`)
     * ```
     */
    async updateActiveStatus(id: number, active: boolean): Promise<CustomerBasicV2> {
        return this.prisma.customer.update({
            where: { id },
            data: { 
                active,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                fullName: true,
                active: true,
                updatedAt: true,
            },
        })
    }

    /**
     * Check if customer exists by ID
     * Verze 2: Utility method for existence checks
     * 
     * @param id - Customer ID
     * @returns Promise<boolean> True if customer exists, false otherwise
     * 
     * @example
     * ```typescript
     * if (!(await repo.exists(123))) {
     *   throw new Error('Customer not found')
     * }
     * ```
     */
    async exists(id: number): Promise<boolean> {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            select: { id: true },
        })
        return customer !== null
    }
}

// Verze 2: Types are now centralized in types.ts 