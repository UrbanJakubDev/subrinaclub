import { SelectOption } from "@/types/types";
import { Transaction } from "@prisma/client";

export interface TransactionResponseDTO {
   id: number;
   year: number;
   quarter: number;
   amount: number;
   description: string | null;
   acceptedBonusOrder: Date | null;
   sentBonusOrder: Date | null;
   bonusAmount: number | null;
   bonusId: number | null;
   accountId: number | null;
   createdAt: Date;
   updatedAt: Date;
}

export interface TransactionSelectDTO extends SelectOption {
}

export type TransactionFormProps = {
   initialTransactionData?: Transaction;
};