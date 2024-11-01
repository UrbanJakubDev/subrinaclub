import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Transaction } from "@/types/transaction";
import { TransactionResponseDTO } from "../services/transaction/types";


export class TransactionRepository extends BaseRepository<
   Transaction,
   Prisma.TransactionCreateInput,
   Prisma.TransactionUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'transaction');
   }

   // Get Transactions by Customer ID
   async getByAccountId(accountId: number): Promise<Transaction[]> {
      const transactions = await this.prisma.transaction.findMany({
         where: {
            accountId
         }
      });
   
      return transactions;
   }

}