import { prisma } from "@/lib/db/pgDBClient";
import { BonusRepository } from "@/lib/repositories/BonusRepository";
import { BonusService } from "./service";


export const bonusService = new BonusService(new BonusRepository(prisma));