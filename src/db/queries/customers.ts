import { Customer } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "../pgDBClient";

// basic CRUD operations for customers

export class CustomerService {
  // Create a new customer
  async createCustomer(customer: Customer): Promise<Customer> {

    // Make the unique publicId for the customer from the registrationNumber and UUID 
    const publicId = `${customer.registrationNumber}SU${Math.random().toString(36).substr(2, 9)}`; 
    customer.publicId = publicId;
    const newCustomer = await prisma.customer.create({
      data: customer,
    });

    
    const newAccount = await prisma.account.create({
      data: {
        type: "LIFETIME",
        balance: 0,
        createdAt: new Date(),
        openedAt: new Date(),
        closedAt: null,
        customerId: newCustomer.id,
      },
    });

    return newCustomer;
  }

  // Read all customers
  async getCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany();
    return customers;
  }

  // Read a customer by ID
  async getCustomerById(id: number): Promise<Customer> {
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
  async updateCustomerById(
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
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  // Restore a customer by ID (set the active flag to true)
  async restoreCustomerById(id: number): Promise<Customer> {
    const restoredCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        active: 1,
      },
    });
    return restoredCustomer;
  }

  // Get all customers, join with accounts and transactions to get the total points
  async getCustomersWithPoints(): Promise<Customer[]> {
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

  // Get the max registrationNumber from the customers
  async getMaxRegistrationNumber(): Promise<number> {
    const maxRegistrationNumber = await prisma.customer.findFirst({
      select: {
        registrationNumber: true,
      },
      orderBy: {
        registrationNumber: "desc",
      },
    });
    return maxRegistrationNumber.registrationNumber;
  }
}


