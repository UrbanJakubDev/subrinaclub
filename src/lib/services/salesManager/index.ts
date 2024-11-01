import { prisma } from "@/lib/db/pgDBClient";
import { SalesManagerRepository } from "@/lib/repositories/SalesManagerRepository";
import { SalesManagerService } from "./service";

export const salesManagerService = new SalesManagerService(new SalesManagerRepository(prisma));