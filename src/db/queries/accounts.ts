import {prisma} from "../pgDBClient";

export default async function getAllAccounts() {
  const accounts = await prisma.account.findMany();
  return accounts;
}

export async function getAccountById(id: number) {
  const account = await prisma.account.findUnique({
    where: {
      id: id,
    },
  });
  return account;
}

export async function getAccountByUserId(userId: number) {
  const account = await prisma.account.findFirst({

      include: {
        savingPeriods: true,
      },
      where: {
         customerId: userId,
         
      },
  });
  return account;
}