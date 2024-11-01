import { prisma } from "@/lib/db/pgDBClient";
import { TransactionRepository } from "@/lib/repositories/TransactionRepository";
import { TransactionService } from "./service";

export const transactionService = new TransactionService(new TransactionRepository(prisma));