import { CustomerRepository } from '@/lib/repositories/CustomerRepository'
import { CreateCustomerDTO, UpdateCustomerDTO } from './validation'
import { Customer } from '@/types/customer'
import {
    CustomerResponseDTO,
    CustomerSelectDTO,
    CustomerWithAccountDataAndActiveSavingPeriodDTO,
    SeznamObratuDTO,
} from './types'
import { Prisma } from '@prisma/client'
import { act } from 'react-dom/test-utils'
import { QuarterDateUtils } from '@/lib/utils/quarterDateUtils'

export class CustomerService {
    prisma: any
    constructor(private customerRepository: CustomerRepository) {}

    async create(data: CreateCustomerDTO): Promise<Customer> {
        const maxRegNumber = await this.customerRepository.getMaxRegistrationNumber()
        const nextNumber = maxRegNumber + 1

        // Prepare relations object
        const relations = {
            ...(data.dealerId && { dealer: { connect: { id: data.dealerId } } }),
            ...(data.salesManagerId && { salesManager: { connect: { id: data.salesManagerId } } }),
        }

        // Remove relation IDs from main data
        const { dealerId, salesManagerId, ...customerData } = data

        // Get current date for saving period
        const today = new Date()
        const currentYear = today.getFullYear()
        const currentQuarter = Math.floor(today.getMonth() / 3) + 1

        const quartersToAdd = 7 // We add 7 because current quarter is the first one
        const totalQuarters = currentQuarter + quartersToAdd
        const endYear = currentYear + Math.floor(totalQuarters / 4)
        const endQuarter = totalQuarters % 4 || 4 // Convert 0 to 4 for Q4

        try {
            // Create customer with nested account creation
            const customer = await this.customerRepository.create({
                data: {
                    ...customerData,
                    registrationNumber: nextNumber,
                    publicId: `C${nextNumber.toString().padStart(4, '0')}`,
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ...relations,
                    account: {
                        create: {
                            active: true,
                            lifetimePoints: 0,
                            currentYearPoints: 0,
                            totalDepositedPoints: 0,
                            totalWithdrawnPonits: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            // Add saving period creation
                            savingPeriods: {
                                create: {
                                    startYear: currentYear,
                                    startQuarter: currentQuarter,
                                    endYear: endYear,
                                    endQuarter: endQuarter,
                                    status: 'ACTIVE',
                                    availablePoints: 0,
                                    startDateTime: new Date(),
                                    endDateTime: QuarterDateUtils.getQuarterEndDate(
                                        endYear,
                                        endQuarter,
                                    ),
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            },
                        },
                    },
                },
                include: {
                    dealer: true,
                    salesManager: true,
                    account: {
                        include: {
                            savingPeriods: true,
                        },
                    },
                },
            })

            return customer
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Customer with this ID already exists')
            }
            throw error
        }
    }

    async update(id: number, data: UpdateCustomerDTO): Promise<Customer> {
        try {
            // Check if customer exists
            await this.get(id)

            // Handle relations
            const relations = {}

            // Handle dealer relation
            if ('dealerId' in data) {
                relations.dealer =
                    data.dealerId === null
                        ? { disconnect: true }
                        : { connect: { id: data.dealerId } }
            }

            // Handle sales manager relation
            if ('salesManagerId' in data) {
                relations.salesManager =
                    data.salesManagerId === null
                        ? { disconnect: true }
                        : { connect: { id: data.salesManagerId } }
            }

            // Clean up the data object
            const {
                id: _id,
                dealerId,
                salesManagerId,
                account, // Remove account from update data
                ...cleanData
            } = data

            // Create repository input
            const updateInput = {
                where: { id },
                data: {
                    ...cleanData,
                    ...relations,
                    updatedAt: new Date(),
                },
                include: {
                    dealer: true,
                    salesManager: true,
                    account: true,
                },
            }

            return await this.customerRepository.update(id, updateInput)
        } catch (error) {
            if (error?.code === 'P2025') {
                throw new Error(`Customer with ID ${id} not found`)
            }
            throw error
        }
    }

    async delete(id: number): Promise<Customer> {
        // Optional: Validate customer exists
        await this.get(id)
        return this.customerRepository.delete(id)
    }

    async get(id: number): Promise<CustomerResponseDTO> {
        const customer = await this.customerRepository.findById(id, {
            dealer: true,
            salesManager: true,
            account: true,
        })

        if (!customer) {
            throw new Error(`Customer with id ${id} not found`)
        }

        return customer
    }

    async getAll(active?: boolean): Promise<CustomerResponseDTO[]> {
        const customers = await this.customerRepository.findAll({
            where: active !== undefined ? { active } : undefined,
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
                            },
                            where: {
                                status: 'ACTIVE',
                            },
                        },
                    },
                },
            },
        })

        // Flatten the account.savingPeriods array to a attribute of account named savingPeriod.availablePoints
        customers.forEach(customer => {
            if (customer.account?.savingPeriods?.length) {
                customer.account.savingPeriodAvailablePoints =
                    customer.account.savingPeriods[0].availablePoints
                delete customer.account.savingPeriods
            }
        })

        customers.forEach(customer => {
            customer.account.lifetimePointsCorrected =
                customer.account.lifetimePoints + customer.account.lifetimePointsCorrection
        })

        // Round acount.averagePointsBeforeSalesManager to 0 decimals
        customers.forEach(customer => {
            if (customer.account?.averagePointsBeforeSalesManager) {
                customer.account.averagePointsBeforeSalesManager = Math.round(
                    customer.account.averagePointsBeforeSalesManager,
                )
            }
        })

        return customers
    }

    async getCustomersForSelect(): Promise<CustomerSelectDTO[]> {
        const customers = await this.customerRepository.findAll()

        return customers.map(customer => ({
            value: customer.id,
            label: customer.fullName,
        }))
    }

    async findCustomerByIco(ico: string): Promise<Customer> {
        return this.customerRepository.findByIco(ico)
    }

    async getAccountDataWithActiveSavingPeriod(
        id: Number,
    ): Promise<CustomerWithAccountDataAndActiveSavingPeriodDTO> {
        const result = await this.customerRepository.getAccountDataWithActiveSavingPeriod(id)

        // Flatten the account.savingPeriods array to a single saving period
        if (result?.account?.savingPeriods?.length) {
            result.account.savingPeriod = result.account.savingPeriods[0]
            delete result.account.savingPeriods
        }

        // Add lifetimePointsCorrected attribute
        result.account.lifetimePointsCorrected =
            result.account.lifetimePoints + result.account.lifetimePointsCorrection

        return result
    }

    async getNextRegistrationNumber(): Promise<number> {
        const maxRegNumber = await this.customerRepository.getMaxRegistrationNumber()
        return maxRegNumber + 1
    }

    async getCustomersWithAccountAndActiveSavingPeriod(): Promise<
        CustomerWithAccountDataAndActiveSavingPeriodDTO[]
    > {
        const customers = await this.customerRepository.findAll({
            where: {
                active: true,
            },
            include: {
                account: {
                    include: {
                        savingPeriods: {
                            where: {
                                status: 'ACTIVE',
                            },
                            take: 1,
                        },
                    },
                },
                salesManager: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        })

        // Flatten the account.savingPeriods array to a single saving period
        customers.forEach(customer => {
            if (customer.account?.savingPeriods?.length) {
                customer.account.savingPeriod = customer.account.savingPeriods[0]
                delete customer.account.savingPeriods
            }
        })

        // Add daysLeft attribute by calculating days between endDateTime and today
        customers.forEach(customer => {
            if (customer.account?.savingPeriod?.endDateTime) {
                const endDate = new Date(customer.account.savingPeriod.endDateTime)
                const today = new Date()
                customer.account.savingPeriod.daysLeft = Math.ceil(
                    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                )
            }
        })

        // Add endThisQuarter attribute by comparing end dates with current quarter/year
        const today = new Date()
        const currentYear = today.getFullYear()
        const currentQuarter = Math.floor(today.getMonth() / 3) + 1

        customers.forEach(customer => {
            if (customer.account?.savingPeriod) {
                customer.account.savingPeriod.endThisQuarter =
                    customer.account.savingPeriod.endYear === currentYear &&
                    customer.account.savingPeriod.endQuarter === currentQuarter
            }
        })

        return customers
    }

    async getCustomersForReportSeznamObratu(): Promise<SeznamObratuDTO[]> {
        return this.customerRepository.getCustomersForReportSeznamObratu()
    }
}
