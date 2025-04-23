import { Prisma, PrismaClient, TransactionType } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Transaction } from "@/types/transaction";
import { TransactionResponseDTO } from "../services/transaction/types";
import { QuarterDateUtils } from "../utils/quarterDateUtils";

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
   directSale?: boolean;
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
            accountId: parseInt(accountId.toString())
         },
         include: {
            bonus: { select: { name: true } }
         },
         orderBy: {
            createdAt: 'desc'
         }
      });

      return transactions;
   }

   private normalizeToNoonUTC(dateInput?: Date | string): Date | undefined {
      if (!dateInput) return undefined;
      
      // Convert string to Date if necessary
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      
      return new Date(Date.UTC(
         date.getFullYear(),
         date.getMonth(),
         date.getDate(),
         12, 0, 0, 0
      ));
   }

   private prepareTransactionData(input: CreateTransactionInput) {
      const quarterDateTime = QuarterDateUtils.getQuarterStartDate(input.year, input.quarter);
      const type = input.points > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL;

      // Normalize dates to noon UTC
      const sentBonusOrder = this.normalizeToNoonUTC(input.sentBonusOrder);
      const acceptedBonusOrder = this.normalizeToNoonUTC(input.acceptedBonusOrder);

      return {
         year: input.year,
         quarter: input.quarter,
         quarterDateTime,
         points: input.points,
         type,
         description: input.description,
         accountId: input.accountId,
         savingPeriodId: input.savingPeriodId,
         bonusId: input.bonusId || undefined,
         bonusPrice: input.bonusPrice || undefined,
         sentBonusOrder,
         acceptedBonusOrder,
         directSale: input.directSale || false,
      };
   }

   async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
      const data = this.prepareTransactionData(input);

      const result = await this.prisma.transaction.create({ data });
      return result;
   }

   async updateTransaction(input: CreateTransactionInput): Promise<Transaction> {
      const data = this.prepareTransactionData(input);

      const result = await this.prisma.transaction.update({
         where: { id: input.id },
         data
      });
      return result;
   }

   async getTransactionsForSalesManager(salesManagerId: number, year: number, quarter?: number): Promise<TransactionResponseDTO[]> {
      const whereClause: any = {
         account: {
            customer: {
               salesManagerId: salesManagerId
            }
         }
      };

      // if (year !== 0) {
      //    whereClause.year = year;
      // }

      // if (quarter !== undefined && quarter !== 0) {
      //    whereClause.quarter = quarter;
      // }

      const transactions = await this.prisma.transaction.findMany({
         where: whereClause,
      });

      return transactions;
   }

   async findMany(args: any) {
      return this.prisma.transaction.findMany(args);
   }

}