import { prisma } from "@/lib/db/pgDBClient";
import { SalesManagerRepository } from "@/lib/repositories/SalesManagerRepository";
import { SalesManagerService } from "./service";
import { SalesManagerAPI } from "./api";

export const salesManagerService = new SalesManagerService(new SalesManagerRepository(prisma));
export const salesManagerAPI = new SalesManagerAPI(new SalesManagerRepository(prisma));
