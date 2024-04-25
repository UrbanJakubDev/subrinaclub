import { Customer } from "@prisma/client";
import { notFound } from "next/navigation";
import prisma from "../pgDBClient";

export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany();
  return customers;
}

// Get all customers, join with accounts and transactions to get the total points
export async function getCustomersWithPoints(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    include: {
      accounts: {
        include: {
          transactions: true,
        },
      },
    },
  });
  return customers;
}

export async function getCustomerById(id: number): Promise<Customer> {
  const customer = await prisma.customer.findUnique({
    where: {
      id: id,
    },
  });
  if (!customer) {
    notFound();
  }
  return customer;
}
