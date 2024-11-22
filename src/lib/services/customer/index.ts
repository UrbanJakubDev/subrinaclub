import { prisma } from "@/lib/db/pgDBClient";
import { CustomerRepository } from "@/lib/repositories/CustomerRepository";
import { CustomerService } from "./service";
import { CustomerAPI } from "./api";

export const customerService = new CustomerService(new CustomerRepository(prisma));
export const customerAPI = new CustomerAPI(new CustomerRepository(prisma));