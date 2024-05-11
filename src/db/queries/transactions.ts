import {prisma} from "../pgDBClient";

export async function getTransactionsByAccountId(accountId: number) {

  // Get all transactions for a given account sort them by year descending
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


export async function addTransaction(transaction: any) {
  const newTransaction = await prisma.transaction.create({
    data: transaction,
  });
  return newTransaction;
}