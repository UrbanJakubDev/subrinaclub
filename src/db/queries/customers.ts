import { Customer } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "../pgDBClient";



// basic CRUD operations for customers

// Create a new customer
export async function createCustomer(customer: Customer): Promise<Customer> {
  const newCustomer = await prisma.customer.create({
    data: customer,
  });
  return newCustomer;
}

// Read all customers
export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany();
  return customers;
}

// Read a customer by ID
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

// Update a customer by ID
export async function updateCustomerById(
  id: number,
  customer: Customer
): Promise<Customer> {
  const { dealerId, salesManagerId, ...customerData } = customer;
  
  try {
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        ...customerData,
        dealer: {
          connect: {
            id: dealerId,
          },
        },
        salesManager: {
          connect: {
            id: salesManagerId,
          },
        },
      },
    });
    return updatedCustomer;
  } catch (error) {
    // Handle error
    console.error('Error updating customer:', error);
    throw error;
  }
}

// Soft delete a customer by ID (set the active flag to false)
export async function deleteCustomerById(id: number): Promise<Customer> {
  const deletedCustomer = await prisma.customer.update({
    where: {
      id: id,
    },
    data: {
      active: 0,
    },
  });
  return deletedCustomer;
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

