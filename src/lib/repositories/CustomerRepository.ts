import { Prisma, PrismaClient } from '@prisma/client'
import { BaseRepository } from './base/BaseRepository'
import { Customer } from '@/types/customer'
import {
    CustomerWithAccountDataAndActiveSavingPeriodDTO,
    SeznamObratuDTO,
} from '../services/customer/types'

export class CustomerRepository extends BaseRepository<
    Customer,
    Prisma.CustomerCreateInput,
    Prisma.CustomerUpdateInput
> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'customer')
    }

    async getMaxRegistrationNumber(): Promise<number> {
        const result = await this.prisma.customer.aggregate({
            _max: {
                registrationNumber: true,
            },
        })
        return result._max.registrationNumber || 0
    }

    async findByIco(ico: string): Promise<any> {
        // Try to find customer by ICO
        const customer = await this.prisma.customer.findFirst({
            where: {
                ico,
            },
        })

        return customer
    }

    // Find customers Account with active saving period
    async getAccountDataWithActiveSavingPeriod(
        id: number,
    ): Promise<CustomerWithAccountDataAndActiveSavingPeriodDTO> {
        const accountData = await this.prisma.customer.findUnique({
            where: { id: id },
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
        })

        return accountData
    }

    // Get all customers with their associated accounts belonging to the sales manager
    async getCustomersWithAccounts(salesManagerId: number): Promise<Customer[]> {
        const result = await this.prisma.customer.findMany({
            where: {
                salesManagerId: salesManagerId,
            },
            include: {
                dealer: true,
                account: true,
            },
        })

        return result
    }

    // Deactivate customer
    async deactivateCustomer(id: number): Promise<Customer> {
        return this.prisma.customer.update({
            where: { id },
            data: { active: false },
        })
    }

    // Activate customer
    async activateCustomer(id: number): Promise<Customer> {
        return this.prisma.customer.update({
            where: { id },
            data: { active: true },
        })
    }

    async getCustomersForReportSeznamObratu(
        year_from: number = new Date().getFullYear(),
        year_to: number = 2010,
    ): Promise<SeznamObratuDTO[]> {
        // Get current year for quarterly data
        const currentYear = new Date().getFullYear()

        // Build dynamic year columns for the query
        let yearColumns = ''
        let years: number[] = []

        for (let year = year_from; year >= year_to; year--) {
            yearColumns += `sum(case when t."year" = ${year} then t.points else 0 end) as "${year}", `
            years.push(year)
        }

        const result = await this.prisma.$queryRaw<SeznamObratuDTO[]>`
         SELECT
            c."registrationNumber",
            max(c.id) as "id",
            max(c."fullName") as "fullName",
            max(c."address") as "address",
            max(c."town") as "town",
            max(c."psc") as "zip",
            max(c."phone") as "phone",
            max(d."fullName") as "dealer",
            max(c."salonName") as "salonName",
            max(sm."id") as "salesManagerId",
            max(sm."fullName") as "salesManager",
            max(a."lifetimePoints") + max(a."lifetimePointsCorrection") as "lifetimePointsCorrected",
            sum(case when (t."year" = ${currentYear} and t."quarter" = 1) then t.points else 0 end) as "Q1",
            sum(case when (t."year" = ${currentYear} and t."quarter" = 2) then t.points else 0 end) as "Q2",
            sum(case when (t."year" = ${currentYear} and t."quarter" = 3) then t.points else 0 end) as "Q3",
            sum(case when (t."year" = ${currentYear} and t."quarter" = 4) then t.points else 0 end) as "Q4",
            ${Prisma.raw(yearColumns.trim().slice(0, -1))}
         FROM
            "Customer" c
         JOIN
            "Account" a ON c.id = a."customerId"
         JOIN
            "Transaction" t ON t."accountId" = a.id
         LEFT OUTER JOIN 
            "SalesManager" sm ON c."salesManagerId" = sm.id
         LEFT OUTER JOIN 
            "Dealer" d ON c."dealerId" = d.id
         WHERE
            t."type" = 'DEPOSIT'
            and c."active" = true
         GROUP BY
            c."registrationNumber"`

        // Dynamically format the result based on the years
        const formattedResult = result.map(row => {
            const formattedRow: any = {
                ...row,
                clubScore: Number(row.clubScore),
                Q1: Number((row as any).Q1 ?? 0),
                Q2: Number((row as any).Q2 ?? 0),
                Q3: Number((row as any).Q3 ?? 0),
                Q4: Number((row as any).Q4 ?? 0),
            }

            // Add dynamic year properties
            years.forEach(year => {
                const yearStr = year.toString()
                formattedRow[yearStr] = Number(row[yearStr as keyof SeznamObratuDTO] ?? 0)
            })

            return formattedRow
        })

        return formattedResult
    }
}
