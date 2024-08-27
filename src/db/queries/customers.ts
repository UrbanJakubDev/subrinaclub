import { Customer } from '@prisma/client'
import { notFound } from 'next/navigation'
import { prisma } from '../pgDBClient'

// basic CRUD operations for customers

export class CustomerService {
    async createCustomer(customer: Customer): Promise<Customer> {
        // Generate a unique publicId for the customer
        customer.publicId = `${customer.registrationNumber}SU${Math.random()
            .toString(36)
            .substr(2, 9)}`

        // If 1 change to true, if 0 change to false
        customer.dealerId = customer.dealerId || null
        customer.salesManagerId = customer.salesManagerId || null

        const currentYear = new Date().getFullYear()
        const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3)
        const savingStartDate = `${currentYear}-${currentQuarter}`
        const savingEndDate = `${currentYear + 2}-${currentQuarter}`

        // Create the customer
        const newCustomer = await prisma.customer.create({
            data: customer,
        })

        // Create the lifetime account for the customer
        const newAccount = await prisma.account.create({
            data: {
                balance: 0,
                createdAt: new Date(),
                customerId: newCustomer.id,
            },
        })

        // Create saving period for the account
        await prisma.savingPeriod.create({
            data: {
                savingStartDate: savingStartDate,
                savingEndDate: savingEndDate,
                balance: 0,
                accountId: newAccount.id,
            },
        })

        return newCustomer
    }

    // Read all customers and join sum of positive transactions for each customer and add sales manager full name but flatten the data
    async getCustomers(active: boolean = true): Promise<Customer[]> {
        const customers = await prisma.customer.findMany({
            include: {
                accounts: {
                    include: {
                        transactions: {
                            select: {
                                year: true,
                                quarter: true,
                                amount: true,
                            },
                        },
                        savingPeriods: {
                            select: {
                                active: true,
                                savingStartDate: true,
                                savingEndDate: true,
                            },
                        },
                    },
                },
                salesManager: {
                    select: {
                        fullName: true,
                    },
                },
                dealer: {
                    select: {
                        fullName: true,
                    },
                },
            },
            where: {
                active: active,
            },
        })

        // Calculate the total points for each customer if transctions are positive return as string
        customers.forEach(customer => {
            customer.totalPoints = customer.accounts.reduce((total, account) => {
                const sum = account.transactions.reduce((total, transaction) => {
                    return transaction.amount > 0 ? total + transaction.amount : total
                }, 0)
                return total + sum
            }, 0)
        })

        // Calulate the points in this year for each customer
        customers.forEach(customer => {
            customer.currentYearPoints = customer.accounts.reduce((total, account) => {
                const sum = account.transactions.reduce((total, transaction) => {
                    const currentYear = new Date().getFullYear()
                    return transaction.year === currentYear && transaction.amount > 0
                        ? total + transaction.amount
                        : total
                }, 0)
                return total + sum
            }, 0)
        })

        // Check if customer have transactions in the current year and set the flag
        customers.forEach(customer => {
            customer.hasCurrentYearPoints = customer.accounts.some(account =>
                account.transactions.some(transaction => {
                    const currentYear = new Date().getFullYear()
                    return transaction.year === currentYear
                }),
            )
        })

        // Flatten the salesManager object
        customers.forEach(customer => {
            customer.salesManager = customer.salesManager?.fullName
            customer.dealer = customer.dealer?.fullName
        })

        // Find last transaction year for each customer as string
        customers.forEach(customer => {
            customer.lastTransactionYear = customer.accounts
                .reduce((lastYear, account) => {
                    const maxYear = account.transactions.reduce((lastYear, transaction) => {
                        return transaction.year > lastYear ? transaction.year : lastYear
                    }, 0)
                    return maxYear > lastYear ? maxYear : lastYear
                }, 0)
                .toString()
        })

        // Function to parse and compare the dates
        const isTransactionInPeriod = (transaction, startDate, endDate) => {
            let [startYear, startQuarter] = startDate.split('-').map(Number)
            let [endYear, endQuarter] = endDate.split('-').map(Number)

            return (
                (transaction.year === startYear && transaction.quarter >= startQuarter) ||
                (transaction.year === endYear && transaction.quarter <= endQuarter) ||
                (transaction.year > startYear && transaction.year < endYear)
            )
        }

        // Iterate over customers to calculate points in active saving periods
        customers.forEach(customer => {
            customer.pointsInActiveSavingPeriod = customer.accounts
                .flatMap(account => {
                    return account.savingPeriods
                        .filter(savingPeriod => savingPeriod.active) // Only consider active saving periods
                        .map(savingPeriod => {
                            const transactionsInPeriod = account.transactions.filter(transaction =>
                                isTransactionInPeriod(
                                    transaction,
                                    savingPeriod.savingStartDate,
                                    savingPeriod.savingEndDate,
                                ),
                            )
                            const pointsSum = transactionsInPeriod.reduce(
                                (sum, transaction) => sum + transaction.amount,
                                0,
                            )
                            return pointsSum
                        })
                })
                .reduce((sum, points) => sum + points, 0)
        })

        return customers
    }

    // Read a customer by ID
    async getCustomerById(id: number): Promise<Customer> {
        const customer = await prisma.customer.findUnique({
            where: {
                id: id,
            },
            include: {
                accounts: {
                    include: {
                        savingPeriods: {
                            where: {
                                active: true,
                            },
                        },
                    },
                },
            },
        })
        if (!customer) {
            notFound()
        }
        return customer
    }

    // Update a customer by ID
    async updateCustomerById(id: number, customer: Customer): Promise<Customer> {
        const { dealerId, salesManagerId, ...customerData } = customer

        try {
            // Create the data object with customerData
            const data: any = {
                ...customerData,
            }

            // Conditionally add dealer connection to the data object
            if (dealerId !== undefined) {
                data.dealer = {
                    connect: {
                        id: dealerId,
                    },
                }
            }

            // Conditionally add sales manager connection to the data object
            if (salesManagerId !== undefined) {
                data.salesManager = {
                    connect: {
                        id: salesManagerId,
                    },
                }
            }

            // Update the customer
            const updatedCustomer = await prisma.customer.update({
                where: {
                    id: id,
                },
                data: data,
            })

            return updatedCustomer
        } catch (error) {
            // Handle error
            console.error('Error updating customer:', error)
            throw error
        }
    }

    // Restore a customer by ID (set the active flag to true)
    async restoreCustomerById(id: number): Promise<Customer> {
        const restoredCustomer = await prisma.customer.update({
            where: {
                id: id,
            },
            data: {
                active: true,
            },
        })
        return restoredCustomer
    }

    async geetCustomersForReportSeznamObratu() {
        const result = await prisma.$queryRaw`SELECT
            c."registrationNumber",
            max(c.id) as "id",
            max(c."fullName") as "fullName",
            max(c."town") as "town",
            max(c."salonName") as "salonName",
            max(sm."fullName") as "salesManager",
            sum(t.amount) as "clubScore",
            sum(case when t."year" = 2024 then t.amount else 0 end) as "2024",
            sum(case when t."year" = 2023 then t.amount else 0 end) as "2023",
            sum(case when t."year" = 2022 then t.amount else 0 end) as "2022",
            sum(case when t."year" = 2021 then t.amount else 0 end) as "2021",
            sum(case when t."year" = 2020 then t.amount else 0 end) as "2020",
            sum(case when t."year" = 2019 then t.amount else 0 end) as "2019",
            sum(case when t."year" = 2018 then t.amount else 0 end) as "2018",
            sum(case when t."year" = 2017 then t.amount else 0 end) as "2017",
            sum(case when t."year" = 2016 then t.amount else 0 end) as "2016",
            sum(case when t."year" = 2015 then t.amount else 0 end) as "2015",
            sum(case when t."year" = 2014 then t.amount else 0 end) as "2014",
            sum(case when t."year" = 2013 then t.amount else 0 end) as "2013",
            sum(case when t."year" = 2012 then t.amount else 0 end) as "2012",
            sum(case when t."year" = 2011 then t.amount else 0 end) as "2011",
            sum(case when t."year" = 2010 then t.amount else 0 end) as "2010"
        FROM
            "Customer" c
        JOIN
            "Account" a ON c.id = a."customerId"
        JOIN
            "Transaction" t ON t."accountId" = a.id
        JOIN 
            "SalesManager" sm ON c."salesManagerId" = sm.id
        WHERE
            t."type" = 'DEPOSIT'
        GROUP BY
            c."registrationNumber"`

        const formattedResult = result.map(row => ({
            ...row,
            'clubScore': Number(row.clubScore),
            '2024': Number(row['2024']),
            '2023': Number(row['2023']),
            '2022': Number(row['2022']),
            '2021': Number(row['2021']),
            '2020': Number(row['2020']),
            '2019': Number(row['2019']),
            '2018': Number(row['2018']),
            '2017': Number(row['2017']),
            '2016': Number(row['2016']),
            '2015': Number(row['2015']),
            '2014': Number(row['2014']),
            '2013': Number(row['2013']),
            '2012': Number(row['2012']),
            '2011': Number(row['2011']),
            '2010': Number(row['2010']),
        }))

        return formattedResult
    }

    // Get all customers, join with accounts and transactions to get the total points
    async getCustomersWithPoints(): Promise<Customer[]> {
        const customers = await prisma.customer.findMany({
            include: {
                accounts: {
                    include: {
                        transactions: true,
                    },
                },
            },
        })
        return customers
    }

    // Get the max registrationNumber from the customers
    async getMaxRegistrationNumber(): Promise<number> {
        const maxRegistrationNumber = await prisma.customer.findFirst({
            select: {
                registrationNumber: true,
            },
            orderBy: {
                registrationNumber: 'desc',
            },
        })
        return maxRegistrationNumber.registrationNumber
    }

    // Find if user exists by ico or fullName
    async findCustomerByIcoOrFullName(ico: string): Promise<Customer> {
        const customer = await prisma.customer.findFirst({
            where: {
                ico: ico,
            },
        })
        return customer
    }
}
