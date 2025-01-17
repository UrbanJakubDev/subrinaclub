import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { CreateTransactionDTO } from "./validation";
import { Transaction } from "@/types/transaction";
import { QuarterDateUtils } from "@/lib/utils/quarterDateUtils";
import { TransactionResponseDTO } from "./types";
import { TransactionType } from "@prisma/client";


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
        const transactions = await this.transactionRepository.findAll({
            where: {
                year: year,
                quarter: quarter,
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
                                salesManager: {
                                    select: {
                                        fullName: true
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
            dealerName: transaction.account.customer.dealer?.fullName,
            bonusName: transaction.bonus?.name,
            customerId: transaction.account.customer.id,
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
}
