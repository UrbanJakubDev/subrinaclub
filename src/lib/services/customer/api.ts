import { CustomerRepository } from "@/lib/repositories/CustomerRepository";
import { Customer, Prisma } from "@prisma/client";
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from "./types";

type PrismaCustomer = Customer & {
    dealer: { fullName: string } | null;
    salesManager: { fullName: string } | null;
    account: {
        id: number;
        currentYearPoints: number;
        lifetimePoints: number;
        averagePointsBeforeSalesManager?: number;
        savingPeriods?: Array<{
            availablePoints: number;
            status: string;
        }>;
    } | null;
};

interface CustomerAccount {
    id: number;
    currentYearPoints: number;
    lifetimePoints: number;
    averagePointsBeforeSalesManager?: number;
    savingPeriods?: Array<{
        availablePoints: number;
        status: string;
    }>;
    savingPeriodAvailablePoints?: number;
}

interface CustomerResponse {
    id: number;
    publicId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    fullName: string;
    birthDate: Date | null;
    registrationNumber: number | null;
    ico: string | null;
    phone: string | null;
    dealer: {
        fullName: string;
    } | null;
    salesManager: {
        fullName: string;
    } | null;
    account: {
        id: number;
        currentYearPoints: number;
        lifetimePoints: number;
        averagePointsBeforeSalesManager?: number;
        savingPeriodAvailablePoints?: number;
    } | null;
}

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
                currentYearPoints: response.account.currentYearPoints,
                lifetimePoints: response.account.lifetimePoints,
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

    // Deactivate customer
    async deactivateCustomer(id: number): Promise<Customer> {
        return this.customerRepository.deactivateCustomer(id);
    }

    // Get all customers with optional active filter
    async getAllCustomers(active?: boolean): Promise<CustomerResponse[]> {
        const include = {
            dealer: {
                select: {
                    fullName: true,
                }
            },
            salesManager: {
                select: {
                    fullName: true,
                }
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
                            status: true
                        },
                        where: {
                            status: 'ACTIVE'
                        }
                    }
                }
            }
        } satisfies Prisma.CustomerInclude;

        const customers = await this.customerRepository.findAll({
            where: {
                active: active ?? undefined
            },
            include: include,
            orderBy: {
                fullName: 'asc'
            }
        });

        // Transform the data to match the service response
        return customers.map(customer => {
            const transformedCustomer: CustomerResponse = {
                ...customer,
                dealer: customer.dealer,
                salesManager: customer.salesManager,
                account: customer.account ? {
                    ...customer.account,
                    lifetimePointsCorrected: customer.account.lifetimePoints + customer.account.lifetimePointsCorrection,
                    savingPeriodAvailablePoints: customer.account.savingPeriods?.[0]?.availablePoints ?? 0,
                    averagePointsBeforeSalesManager: customer.account.averagePointsBeforeSalesManager 
                        ? Math.round(customer.account.averagePointsBeforeSalesManager)
                        : undefined
                } : null
            };

            return transformedCustomer;
        });
    }
}