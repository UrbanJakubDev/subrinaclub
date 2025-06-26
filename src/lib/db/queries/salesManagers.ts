

import { SalesManagerSelectDTO } from "@/lib/services/salesManager/types";
import { prisma } from "../pgDBClient";

// Basic CRUD operations for the 'salesManager' model
/**
 * Retrieves a list of sales managers from the database.
 * @returns {Promise<Array<SalesManager>>} A promise that resolves to an array of sales managers.
 */
export async function fetchSalesManagersFromDB() {
  let salesManagers = await prisma.salesManager.findMany();
  return salesManagers;
}

/**
 * Retrieves a sales manager by their ID.
 * @param id - The ID of the sales manager.
 * @returns A Promise that resolves to the sales manager object.
 */
export async function fetchSalesManagerByIdFromDB(id: number) {
  let salesManager = await prisma.salesManager.findUnique({
    where: {
      id: id,
    },
  });
  return salesManager;
}

/**
 * Creates a new sales manager in the database.
 * @param data - The data for the sales manager.
 * @returns The created sales manager.
 */
export async function insertSalesManagerIntoDB(data: any) {

  data.publicId = Math.floor(Math.random()).toString();
  data.registrationNumber = parseInt(data.registrationNumber);

  // Exclude the `id` from the data object to be updated
  const { id: _, ...dataWithoutId } = data;

  let salesManager = await prisma.salesManager.create({
    data: {
      ...dataWithoutId,
    },
  });
  return salesManager;
}

/**
 * Updates a sales manager in the database.
 * @param id - The ID of the sales manager to update.
 * @param data - The updated data for the sales manager.
 * @returns The updated sales manager object.
 */
export async function updateSalesManagerInDB(id: number, data: any) {

  data.registrationNumber = parseInt(data.registrationNumber);
  let salesManager = await prisma.salesManager.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
  return salesManager;
}


/**
 * Retrieves sales managers for select options.
 * @returns An array of sales managers with their id and name.
 */
export async function fetchSalesManagersOptionsFromDB(): Promise<SalesManagerSelectDTO[]> {
  const res = await prisma.salesManager.findMany({
    select: {
      id: true,
      fullName: true,
    },
    orderBy: {
      fullName: 'asc',
    },
  });

  // Return as value, label array
  return res.map((salesManager) => ({
    value: salesManager.id,
    label: salesManager.fullName,
  }));
}




// Advanced queries for the 'salesManager' model

export async function getCustomersListBySalesManagerId(salesManagerId: number) {
  let customers = await prisma.customer.findMany({
    where: {
      salesManagerId: salesManagerId,
    },
  });
  return customers;
}

interface TransactionWithCustomerName {
  id: number;
  points: number;
  // Add any other fields from the 'transaction' model as needed
  customerFullName: string;
  year: number;
  quarter: number;
}
export async function getListOfTransactionsBySalesManagerId(
  salesManagerId: number,
  year?: number,
  quarter?: number
): Promise<TransactionWithCustomerName[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          customer: {
            salesManagerId: salesManagerId,
          },
        },
        // Apply filters based on year and quarter if provided
        ...(year &&
          quarter && {
          AND: [{ year: year }, { quarter: quarter }],
        }),
        ...(year && !quarter && { year: year }),
      },
      select: {
        id: true,
        points: true,
        year: true,
        quarter: true,
        description: true,
        account: {
          select: {
            customer: {
              select: {
                id: true,
                fullName: true,
                registrationNumber: true,
                salonName: true,
                address: true,
                town: true,
                psc: true,
                phone: true,
                dealer: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Format the result to include customerFullName
    const formattedTransactions: TransactionWithCustomerName[] =
      transactions.map((transaction) => ({
        id: transaction.id,
        points: transaction.points,
        customerFullName: transaction.account.customer.fullName,
        customerID: transaction.account.customer.id,
        year: transaction.year,
        quarter: transaction.quarter,
        registrationNumber: transaction.account.customer.registrationNumber,
        dealerName: transaction.account.customer.dealer?.fullName || "",
        customerSalonName: transaction.account.customer.salonName || "",
        salonAddress: transaction.account.customer.address || "",
        salonTown: transaction.account.customer.town || "",
        salonPsc: transaction.account.customer.psc || "",
        phone: transaction.account.customer.phone || "",
      }));

    return formattedTransactions;
  } catch (error) {
    // Handle errors
    console.error("Error fetching transactions:", error);
    throw error;
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

interface CustomerWithTotalPoints {
  id: number;
  fullName: string;
  totalPoints: number;
}

export async function getTotalPointsBySalesManagerId(
  salesManagerId: number
): Promise<CustomerWithTotalPoints[]> {
  const customers = await prisma.customer.findMany({
    where: {
      salesManagerId: salesManagerId,
    },
    select: {
      id: true,
      fullName: true,
      registrationNumber: true,
      account: {
        select: {
          id: true,
          transactions: {
            select: {
              points: true,
              year: true,
              quarter: true,
            },
            where: {
              points: {
                gt: 0,
              },
            },
          },
        },
      },
    },
  });

  // Calculate the total points for each customer
  const customersWithTotalPoints: CustomerWithTotalPoints[] = customers.map(
    (customer) => {
      const totalPoints = customer.account.transactions.reduce(
        (acc, transaction) => acc + transaction.points,
        0
      );
      return {
        id: customer.id,
        fullName: customer.fullName,
        totalPoints: totalPoints,
      };
    }
  );


  return customersWithTotalPoints;
}

// Get total points of transactions for a sales manager lifetime
export async function getTotalpointsOfTransactionsBySalesManagerId(
  salesManagerId: number
) {
  const totalpoints = await prisma.transaction.aggregate({
    where: {
      account: {
        customer: {
          salesManagerId: salesManagerId,
        },
      },
    },
    _sum: {
      points: true,
    },
  });
  return totalpoints._sum.points || 0;
}

// Get count of customers for a sales manager
export async function getCustomerCountBySalesManagerId(salesManagerId: number) {
  const customerCount = await prisma.customer.count({
    where: {
      salesManagerId: salesManagerId,
    },
  });
  return customerCount;
}

// Get count of cusoemrs for a sales manager which have active status based on the status provided
/**
 * Retrieves the count of customers based on the sales manager ID and status.
 * @param salesManagerId - The ID of the sales manager.
 * @param status - The status of the customers.
 * @returns The count of customers.
 */
export async function getCustomerCountBySalesManagerIdAndStatus(
  salesManagerId: number,
  status: boolean
) {
  const customerCount = await prisma.customer.count({
    where: {
      salesManagerId: salesManagerId,
      active: status,
    },
  });
  return customerCount;
}


// Get count of customer which have active status and have some transactions in the current year
export async function getActiveCustomersWithTransactionsBySalesManagerId(
  salesManagerId: number,
  year: number
) {
  const customerCount = await prisma.customer.count({
    where: {
      salesManagerId: salesManagerId,
      active: true,
      account: {
        transactions: {
          some: {
            year: year,

          },
        },
      },
    },
  });
  return customerCount;
}
