import { SavingPeriodRepository } from "@/lib/repositories/SavingPeriodRepository";
import { prisma } from "@/lib/db/pgDBClient";
import { SavingPeriodAPI } from "./api";

export const savingPeriodAPI = new SavingPeriodAPI(new SavingPeriodRepository(prisma));