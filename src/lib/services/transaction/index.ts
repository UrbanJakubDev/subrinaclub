import { prisma } from "@/lib/db/pgDBClient";
import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { TransactionService } from "./service";
import { TransactionAPI } from "./api";

export const transactionService = new TransactionService(new TransactionRepository(prisma));
export const transactionAPI = new TransactionAPI(new TransactionRepository(prisma))