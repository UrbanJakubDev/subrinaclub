import { Prisma, PrismaClient, TransactionType } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Transaction } from "@/types/transaction";
import { TransactionResponseDTO } from "../services/transaction/types";

interface CreateTransactionInput {
   year: number;
   quarter: number;
   points: number;
   type: TransactionType;
   description?: string;
   accountId: number;
   savingPeriodId: number;
   bonusId?: number;
   bonusPrice?: number;
   sentBonusOrder?: Date;
   acceptedBonusOrder?: Date;
}

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
            accountId: parseInt(accountId)
         },
         include: {
            bonus: { select: { name: true } }
         }
      });

      return transactions;
   }

   async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
      // Calculate quarter date time (first day of the quarter)
      const quarterDateTime = new Date(input.year, (input.quarter - 1) * 3, 1);
      const type = input.points > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL;

      const data = {
         year: input.year,
         quarter: input.quarter,
         quarterDateTime,
         points: input.points,
         type: type,
         description: input.description,
         accountId: input.accountId,
         savingPeriodId: input.savingPeriodId,
         bonusId: input.bonusId || undefined,
         bonusPrice: input.bonusPrice || undefined,
         sentBonusOrder: input.sentBonusOrder || undefined,
         acceptedBonusOrder: input.acceptedBonusOrder || undefined,
      };

      console.log(`Creating transaction with data: ${JSON.stringify(data)}`);

      // Create the transaction with all required fields
      const result = await this.prisma.transaction.create({
         data
      });

      return result;
   }

}