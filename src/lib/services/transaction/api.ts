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
        const acountId = parseInt(accountId)
        return this.transactionRepository.getByAccountId(accountId);
    }
}
