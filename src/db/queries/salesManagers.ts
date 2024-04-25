import prisma from "../pgDBClient";

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
        account: {
          select: {
            customer: {
              select: {
                id: true,
                fullName: true,
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

export async function getSalesManagersForSelect() {
  let salesManagers = await prisma.salesManager.findMany({
    select: {
      id: true,
      fullName: true,
    },
  });
  return salesManagers;
}
