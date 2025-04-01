import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { CreateTransactionDTO } from "./validation";
import { Transaction } from "@/types/transaction";
import { QuarterDateUtils } from "@/lib/utils/quarterDateUtils";
import { TransactionResponseDTO } from "./types";
import { Prisma, TransactionType } from "@prisma/client";
import { SeznamObratuDTO } from "../customer/types";
import { prisma } from "@/lib/db/pgDBClient";


export class TransactionAPI {
    constructor(
        private transactionRepository: TransactionRepository
    ) { }

    async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
        return this.transactionRepository.createTransaction(data);
    }

    async getTransactionsForCustomer(accountId: number): Promise<Transaction[]> {
        return this.transactionRepository.getByAccountId(accountId);
    }

    async updateTransaction(data: CreateTransactionDTO): Promise<Transaction> {
        return this.transactionRepository.updateTransaction(data);
    }

    async deleteTransaction(id: number): Promise<void> {
        return this.transactionRepository.hardDelete(id);
    }

    async getTransactionsForSalesManager(accountId: number, year: number, quarter: number): Promise<TransactionResponseDTO[]> {
        return this.transactionRepository.getTransactionsForSalesManager(accountId, year, quarter);
    }

    // Function to make premuim bonus overview
    async premiumBonusReport(year: number, quarter: number): Promise<any> {
        // Firnd date range fo the quarter
        const startDate = QuarterDateUtils.getQuarterStartDate(year, quarter);
        const endDate = QuarterDateUtils.getQuarterEndDate(year, quarter);



        const transactions = await this.transactionRepository.findAll({
            where: {
                acceptedBonusOrder: {
                    gte: startDate,
                    lte: endDate
                },
                type: TransactionType.WITHDRAWAL
            },
            include: {
                bonus: { select: { name: true } },
                account: {
                    select: {
                        customer: {
                            select: {
                                id: true,
                                fullName: true,
                                registrationNumber: true,
                                salesManager: {
                                    select: {
                                        fullName: true,
                                        id: true
                                    }
                                },
                                dealer: {
                                    select: {
                                        fullName: true
                                    }
                                }
                            },

                        }
                    }
                }
            }
        })

        const flattenedTransactions = transactions.map(transaction => ({
            ...transaction,
            customerName: transaction.account.customer.fullName,
            salesManagerName: transaction.account.customer.salesManager?.fullName,
            salesManagerId: transaction.account.customer.salesManager?.id,
            dealerName: transaction.account.customer.dealer?.fullName,
            bonusName: transaction.bonus?.name,
            customerId: transaction.account.customer.id,
            registrationNumber: transaction.account.customer.registrationNumber?.toString() ?? '',
            account: undefined,
            bonus: undefined
        }));

        return flattenedTransactions;
    }


    async premiumBonusReportFull(): Promise<any> {
        const transactions = await this.transactionRepository.findAll({
            where: {
                type: TransactionType.WITHDRAWAL
            },
            include: {
                bonus: { select: { name: true, id: true } }
            }
        })

        // Group transactions by bonus using an array instead of an object
        const groupedTransactions = transactions.reduce((acc: Array<{
            bonusId: string,
            bonusName: string,
            totalPoints: number,
            count: number  // Added count type
        }>, transaction) => {
            const bonusId = transaction.bonus?.id;
            const bonusName = transaction.bonus?.name;
            if (!bonusId) return acc;

            const existingBonus = acc.find(item => item.bonusId === bonusId);
            if (existingBonus) {
                existingBonus.totalPoints += transaction.points;
                existingBonus.price += transaction.bonusPrice;
                existingBonus.count += 1;  // Increment count for existing bonus
            } else {
                acc.push({
                    bonusId,
                    bonusName,
                    totalPoints: transaction.points,
                    price: transaction.bonusPrice,
                    count: 1  // Initialize count for new bonus
                });
            }
            return acc;
        }, []);

        // Apply Math.abs() to totalPoints after grouping
        const finalGroupedTransactions = groupedTransactions.map(group => ({
            ...group,
            totalPoints: Math.abs(group.totalPoints)
        }));

        // Sort the array by totalPoints
        finalGroupedTransactions.sort((a, b) => b.totalPoints - a.totalPoints);

        return finalGroupedTransactions;
    }

    async getCustomersForReportSeznamObratu(year_from: number = new Date().getFullYear(), year_to: number = 2010): Promise<SeznamObratuDTO[]> {
        // Get current year for quarterly data
        const currentYear = new Date().getFullYear();
        
        // Build dynamic year columns for the query
        let yearColumns = '';
        let years: number[] = [];
        
        for (let year = year_from; year >= year_to; year--) {
           yearColumns += `sum(case when (t."year" = ${year} and t."type" = 'DEPOSIT') then t.points else 0 end) as "${year}", `;
           years.push(year);
        }
        
        const result = await prisma.$queryRaw<SeznamObratuDTO[]>`
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
              sum(case when (t."year" = ${currentYear} and t."quarter" = 1  and t."type" = 'DEPOSIT')) then t.points else 0 end) as "Q1",
              sum(case when (t."year" = ${currentYear} and t."quarter" = 2  and t."type" = 'DEPOSIT')) then t.points else 0 end) as "Q2",
              sum(case when (t."year" = ${currentYear} and t."quarter" = 3  and t."type" = 'DEPOSIT')) then t.points else 0 end) as "Q3",
              sum(case when (t."year" = ${currentYear} and t."quarter" = 4  and t."type" = 'DEPOSIT')) then t.points else 0 end) as "Q4",
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
              c."registrationNumber"`;
  
        // Dynamically format the result based on the years
        const formattedResult = result.map(row => {
           const formattedRow: any = {
              ...row,
              clubScore: Number(row.clubScore),
              Q1: Number((row as any).Q1 ?? 0),
              Q2: Number((row as any).Q2 ?? 0),
              Q3: Number((row as any).Q3 ?? 0), 
              Q4: Number((row as any).Q4 ?? 0),
           };
           
           // Add dynamic year properties
           years.forEach(year => {
              const yearStr = year.toString();
              formattedRow[yearStr] = Number(row[yearStr as keyof SeznamObratuDTO] ?? 0);
           });
           
           return formattedRow;
        });
  
        return formattedResult;
     }
}
