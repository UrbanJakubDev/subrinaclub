import { prisma } from '../pgDBClient';
// TODO: Rework to Class as a service

export default async function getAllAccounts() {
    const accounts = await prisma.account.findMany();
    return accounts;
}

export async function getAccountById(id: number) {
    const account = await prisma.account.findUnique({
        include: {
            savingPeriods: true,
            customer: true,
        },
        where: {
            id: id,
        },
    });
    return account;
}

export async function createAccount(data: any) {
    const account = await prisma.account.create({
        data: {
            ...data,
        },
    });
    return account;
}

export async function updateAccountById(id: number, data: any) {
    // Change id in data to number
    data.id = Number(data.id);
    data.balance = Number(data.balance);
    data.balancePointsCorrection = Number(data.balancePointsCorrection);

    // delete id from data
    delete data.id;

    console.log(data);

    const account = await prisma.account.update({
        where: {
            id: id,
        },
        data: {
            ...data,
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
