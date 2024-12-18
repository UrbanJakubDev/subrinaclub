import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { CreateTransactionDTO } from "./validation";
import { Transaction } from "@/types/transaction";
import { QuarterDateUtils } from "@/lib/utils/quarterDateUtils";


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
}