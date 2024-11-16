import { prisma } from "@/lib/db/pgDBClient";
import { AccountRepository } from "@/lib/repositories/AccountRepository";
import { AccountService } from "./service";

export const accountService = new AccountService(new AccountRepository(prisma));