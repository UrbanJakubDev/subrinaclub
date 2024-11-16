import { Dealer, DealerSelect } from "@/interfaces/types"
import { prisma } from "../pgDBClient"



// Get all dealers
export async function fetchDealersFromDB(): Promise<Dealer[]> {
    return await prisma.dealer.findMany()
}

// Get dealer by id
export async function getDealerById(id: number): Promise<Dealer | null> {
    return await prisma.dealer.findUnique({
        where: {
            id: id,
            active: true,
        },
    })
}

// Create dealer
export async function insertDealerIntoDB(data: Dealer): Promise<Dealer> {
    // Exclude the `id` from the data object to be updated
    const { id: _, ...dataWithoutId } = data;

    // Get max registration number
    const maxRegNumber = await prisma.dealer.findFirst({
        select: {
            registrationNumber: true,
        },
        orderBy: {
            registrationNumber: 'desc',
        },
    })

    // Set registration number to max + 1
    dataWithoutId.registrationNumber = maxRegNumber?.registrationNumber ?? 1;

    return await prisma.dealer.create({
        data: {
            ...dataWithoutId,
        },
    })
}

export async function updateDealerInDB(id: number, data: Dealer): Promise<Dealer> {
    // Exclude the `id` from the data object to be updated
    const { id: _, ...dataWithoutId } = data;

    return await prisma.dealer.update({
        where: {
            id: id,
        },
        data: {
            ...dataWithoutId,
        },
    });
}


// Get dealers for select input
export async function fetchDealersForOptionsFromDB(): Promise<DealerSelect[]> {
    const res = await prisma.dealer.findMany({
        select: {
            id: true,
            fullName: true,
        },
    })

    // Return as id, name array
    return res.map(dealer => ({
        value: dealer.id,
        label: dealer.fullName,
    }))
}