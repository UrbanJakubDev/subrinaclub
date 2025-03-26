import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { CreateTransactionDTO, UpdateTransactionDTO } from "./validation";
import { Transaction } from "@/types/transaction";
import { QuarterDateUtils } from "@/lib/utils/quarterDateUtils";

export class TransactionService {
   constructor(private transactionRepository: TransactionRepository) { }

   async create(data: CreateTransactionDTO): Promise<Transaction> {
      return this.transactionRepository.createTransaction(data);
   }

   async get(id: number): Promise<Transaction> {
      return this.transactionRepository.findById(id);
   }

   async getAll(): Promise<Transaction[]> {
      return this.transactionRepository.findAll();
   }

   async update(id: number, data: UpdateTransactionDTO): Promise<Transaction> {
      return this.transactionRepository.update(id, { data });
   }

   async delete(id: number): Promise<Transaction> {
      return this.transactionRepository.delete(id);
   }

   async getByAccountId(accountId: number): Promise<Transaction[]> {
      const transactions = await this.transactionRepository.getByAccountId(accountId);

      // Flatten the bonus object to bonusName string
      const flattenTransactions = transactions.map(transaction => {
         return {
            ...transaction,
            bonusName: transaction.bonus?.name
         }
      }
      );
      return flattenTransactions;
   }

   
}