import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { CreateTransactionDTO, UpdateTransactionDTO } from "./validation";
import { Transaction } from "@/types/transaction";

export class TransactionService {
   constructor(private transactionRepository: TransactionRepository) { }

   async create(data: CreateTransactionDTO): Promise<Transaction> {
      return this.transactionRepository.create({ data });
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
      return this.transactionRepository.getByAccountId(accountId);
   }


}