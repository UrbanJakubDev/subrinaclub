import { prisma } from "@/lib/db/pgDBClient";
import { CustomerRepository } from "@/lib/repositories/CustomerRepository";
import { CustomerService } from "./service";

export const customerService = new CustomerService(new CustomerRepository(prisma));