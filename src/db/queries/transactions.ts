import {prisma} from "../pgDBClient";



/**
 * Retrieves transactions based on the specified year and type.
 * @param year - The year of the transactions.
 * @param type - The type of the transactions. Can be "DEPOSIT" or "WITHDRAW".
 * @returns A promise that resolves to an array of transactions.
 */
export async function getTransactions(year:number, type: "DEPOSIT" | "WITHDRAW") {
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
      account : {
        select: {
          customer : {
            select: {
              fullName: true,
              town: true,
              registrationNumber: true,
              salesManager: {
                select: {
                  fullName: true,
                }
            }
          }
        }
      }
    }
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
          type: "DEPOSIT",
        },
      },
    },
  });

   // Sum the amounts of the transactions to get the total deposits for the account and add account.balancePointsCorrection to the sum
  const total = totalDeposits.reduce((acc, account) => {
    return account.transactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
  }
  , 0);
  return total + account.balancePointsCorrection;

}