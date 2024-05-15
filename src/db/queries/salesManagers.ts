import { prisma } from "../pgDBClient";

export async function getSalesManagers() {
  let salesManagers = await prisma.salesManager.findMany();
  return salesManagers;
}

export async function getSalesManagerById(id: number) {
  let salesManager = await prisma.salesManager.findUnique({
    where: {
      id: id,
    },
  });
  return salesManager;
}

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
  amount: number;
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
        amount: true,
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
        amount: transaction.amount,
        customerFullName: transaction.account.customer.fullName,
        customerID: transaction.account.customer.id,
        year: transaction.year,
        quarter: transaction.quarter,
        registrationNumber: transaction.account.customer.registrationNumber,
        dealerName: transaction.account.customer.dealer.fullName,
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
      accounts: {
        select: {
          id: true,
          transactions: {
            select: {
              amount: true,
              year: true,
              quarter: true,
            },
            where: {
              amount: {
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
      const totalPoints = customer.accounts.reduce((total, account) => {
        return (
          total +
          account.transactions.reduce((total, transaction) => {
            return total + transaction.amount;
          }, 0)
        );
      }, 0);

      return {
        id: customer.id,
        fullName: customer.fullName,
        registrationNumber: customer.registrationNumber,
        accounts: customer.accounts[0],
        totalPoints: totalPoints,
      };
    }
  );


  return customersWithTotalPoints;
}

// Get total amount of transactions for a sales manager lifetime
export async function getTotalAmountOfTransactionsBySalesManagerId(
  salesManagerId: number
) {
  const totalAmount = await prisma.transaction.aggregate({
    where: {
      account: {
        customer: {
          salesManagerId: salesManagerId,
        },
      },
    },
    _sum: {
      amount: true,
    },
  });
  return totalAmount._sum.amount || 0;
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
  status: number
) {
  const customerCount = await prisma.customer.count({
    where: {
      salesManagerId: salesManagerId,
      active: status,
    },
  });
  return customerCount;
}

export async function getSalesManagersForSelect() {
  let salesManagers = await prisma.salesManager.findMany({
    select: {
      id: true,
      fullName: true,
    },
  });
  return salesManagers;
}
