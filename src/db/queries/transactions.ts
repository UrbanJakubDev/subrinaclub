import { prisma } from '../pgDBClient';

// Get single transaction by ID
export async function getTransactionById(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: {
            id: id,
        },
    });
    return transaction;
}



/**
 * Retrieves transactions based on the specified year and type.
 * @param year - The year of the transactions.
 * @param type - The type of the transactions. Can be "DEPOSIT" or "WITHDRAW".
 * @returns A promise that resolves to an array of transactions.
 */
export async function getTransactions(year: number, type: 'DEPOSIT' | 'WITHDRAW') {
    const transactions = await prisma.transaction.findMany({
        select: {
            id: true,
            year: true,
            quarter: true,
            amount: true,
            description: true,
            acceptedBonusOrder: true,
            bonusName: true,
            bonusAmount: true,
            account: {
                select: {
                    customer: {
                        select: {
                            fullName: true,
                            town: true,
                            registrationNumber: true,
                            salesManager: {
                                select: {
                                    fullName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        where: {
            year: year,
            type: type,
        },
        orderBy: {
            year: 'desc',
        },
    });
    return transactions;
}

/**
 * Retrieves transactions by account ID.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to an array of transactions.
 */
export async function getTransactionsByAccountId(accountId: number) {
    const transactions = await prisma.transaction.findMany({
        where: {
            accountId: accountId,
        },
        orderBy: {
            year: 'desc',
        },
    });
    return transactions;
}

/**
 * Adds a new transaction to the database.
 * @param transaction - The transaction object to be added.
 * @returns The newly created transaction.
 */
export async function addTransaction(transaction: any) {
    if (transaction.type === '1') {
        transaction.type = 'DEPOSIT';
    }

    if (transaction.type === '2') {
        transaction.type = 'WITHDRAW';
    }

    const newTransaction = await prisma.transaction.create({
        data: transaction,
    });
    return newTransaction;
}

/**
 * Updates a transaction in the database.
 * @param id - The ID of the transaction to be updated.
 * @param transaction - The updated transaction object.
 * @returns The updated transaction.
 */
export async function updateTransactionById(id: number, transaction: any) {
    const updatedTransaction = await prisma.transaction.update({
        where: {
            id: id,
        },
        data: transaction,
    });
    return updatedTransaction;
}

// Advanced Querying
// Get the total of deposits over the years based on the account ID
export async function getTotalDepositsByAccountId(accountId: number) {
    // Get balancePointsCorrection from the account
    const account = await prisma.account.findUnique({
        where: {
            id: accountId,
        },
        select: {
            balancePointsCorrection: true,
        },
    });

    const totalDeposits = await prisma.account.findMany({
        where: {
            id: accountId,
        },
        select: {
            transactions: {
                where: {
                    type: 'DEPOSIT',
                },
            },
        },
    });

    // Sum the amounts of the transactions to get the total deposits for the account and add account.balancePointsCorrection to the sum
    const total = totalDeposits.reduce((acc, account) => {
        return account.transactions.reduce((acc, transaction) => {
            return acc + transaction.amount;
        }, 0);
    }, 0);
    return total + account.balancePointsCorrection;
}

// Get the total of deposits for selected year based on the account ID
export async function getTotalDepositsByAccountIdAndYear(accountId: number, year: number) {
    const totalDeposits = await prisma.transaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            accountId: accountId,
            year: year,
            type: 'DEPOSIT',
        },
    });

    return totalDeposits._sum.amount || 0;
}

// Get the sum of transaction for account ID and between two dates
export async function getSumOfTransactionsByAccountIdAndDate(
    accountId: number,
    startDate: string,
    endDate: string,
) {
    let [startYear, startQuarter] = startDate.split('-');
    let [endYear, endQuarter] = endDate.split('-');

    const sumResult = await prisma.transaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            accountId: accountId,
            OR: [
                {
                    year: parseInt(startYear),
                    quarter: {
                        gte: parseInt(startQuarter),
                    },
                },
                {
                    year: parseInt(endYear),
                    quarter: {
                        lte: parseInt(endQuarter),
                    },
                },
                {
                    year: {
                        gt: parseInt(startYear),
                        lt: parseInt(endYear),
                    },
                },
            ],
        },
    });

    return sumResult._sum.amount || 0;
}

// Get the list of transactions for the account ID and between two dates
export async function getTransactionsByAccountIdAndDate(
    accountId: number,
    startDate: string,
    endDate: string,
) {
    let [startYear, startQuarter] = startDate.split('-');
    let [endYear, endQuarter] = endDate.split('-');

    const transactions = await prisma.transaction.findMany({
        where: {
            accountId: accountId,
            OR: [
                {
                    year: parseInt(startYear),
                    quarter: {
                        gte: parseInt(startQuarter),
                    },
                },
                {
                    year: parseInt(endYear),
                    quarter: {
                        lte: parseInt(endQuarter),
                    },
                },
                {
                    year: {
                        gt: parseInt(startYear),
                        lt: parseInt(endYear),
                    },
                },
            ],
        },
    });

    return transactions;
}

// Get array of sum of points points for the account id by the year. Return array of points for each quarter
export async function getQuarterPointsByAccountIdAndYear(accountId: number, year: number) {
  const quarters = await prisma.transaction.groupBy({
      by: ['year', 'quarter'],
      where: {
          accountId: accountId,
          year: year,
          type: 'DEPOSIT',
      },
      _sum: {
          amount: true,
      },
  });

  return quarters.map(quarter => ({
      year: quarter.year,
      quarter: quarter.quarter,
      sumPoints: quarter._sum.amount,
  }));
}


// Remove transaction by ID
export async function removeTransactionById(id: number) {
    const transaction = await prisma.transaction.delete({
        where: {
            id: id,
        },
    });
    return transaction;
}