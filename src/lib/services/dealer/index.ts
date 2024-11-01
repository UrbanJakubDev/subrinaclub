import { prisma } from "@/lib/db/pgDBClient";
import { DealerRepository } from "@/lib/repositories/DealerRepository";
import { DealerService } from "./service";

export const dealerService = new DealerService(new DealerRepository(prisma));