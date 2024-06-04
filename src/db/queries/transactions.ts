import {prisma} from "../pgDBClient";



export async function getTransactions(year:number, type: "DEPOSIT" | "WITHDRAW") {
  // Get all transactions sort them by year descending
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