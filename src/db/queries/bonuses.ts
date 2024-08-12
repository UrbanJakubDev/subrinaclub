import { prisma } from '../pgDBClient';


export async function getAllBonuses() {
    const bonuses = (await prisma.bonus.findMany()).sort((a, b) => a.id - b.id);
    return bonuses;
}

export async function getBonusById(id: number) {
    const bonus = await prisma.bonus.findUnique({
        where: {
            id: id,
        },
    });
    return bonus;
}

export async function createBonus(data: any) {
    const bonus = await prisma.bonus.create({
        data: {
            ...data,
        },
    });
    return bonus;
}

export async function updateBonusById(id: number, data: any) {
    const bonus = await prisma.bonus.update({
        where: {
            id: id,
        },
        data: {
            ...data,
        },
    });
    return bonus;
}


// Soft delete bonus set active to false
export async function deleteBonusById(id: number) {
    const bonus = await prisma.bonus.update({
        where: {
            id: id,
        },
        data: {
            active: false,
        },
    });
    return bonus;
}