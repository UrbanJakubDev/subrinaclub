/* 
   This file cotains basic set of CRUD operations for savingPeriods table.
*/

import { returnLastQuarter } from '@/utils/dateFnc';
import { prisma } from '../pgDBClient';

export default async function getAllSavingPeriods() {
    const savingPeriods = await prisma.savingPeriod.findMany();
    return savingPeriods;
}

export async function getSavingPeriodById(id: number) {
    const savingPeriod = await prisma.savingPeriod.findUnique({
        where: {
            id: id,
        },
    });
    return savingPeriod;
}

export async function getSavingPeriodByUserId(userId: number) {
    const savingPeriod = await prisma.savingPeriod.findFirst({
        where: {
            account: {
                customerId: userId,
            },
            active: true,
        },
    });
    return savingPeriod;
}

export async function createSavingPeriod(account_id: any, data: any) {
    // Change the active to boolean
    if (data.active === 'true') {
        data.active = true;
    } else {
        data.active = false;
    }

    data.balance = parseFloat(data.balance);

    // Get the last saving period for the account and set it to inactive and replace savingEndDate with the new savingStartDate - 1 quarter
    // For example: If the last saving period ended on 2022/04 and new starts on 2023/03, the last saving period will end on 2023/02
    const lastSavingPeriod = await prisma.savingPeriod.findFirst({
        where: {
            account: {
                id: account_id,
            },
            active: true,
        },
    });

    if (lastSavingPeriod) {
        await prisma.savingPeriod.update({
            where: {
                id: lastSavingPeriod.id,
            },
            data: {
                active: false,
                savingEndDate: returnLastQuarter(lastSavingPeriod.savingStartDate),
            },
        });
    }

    const savingPeriod = await prisma.savingPeriod.create({
        data: {
            ...data,
            account: {
                connect: {
                    id: account_id,
                },
            },
        },
    });
    return savingPeriod;
}

export async function updateSavingPeriod(id: number, data: any) {
    // Change the active to boolean
    if (data.active === 'true') {
        data.active = true;
    } else {
        data.active = false;
    }

    data.balance = parseFloat(data.balance);

    const savingPeriod = await prisma.savingPeriod.update({
        where: {
            id: id,
        },
        data: {
            ...data,
        },
    });
    return savingPeriod;
}

// Delete savingPeriod by id as change the active flag to false
export async function deleteSavingPeriod(id: number) {
    const savingPeriod = await prisma.savingPeriod.update({
        where: {
            id: id,
        },
        data: {
            active: false,
        },
    });
    return savingPeriod;
}
