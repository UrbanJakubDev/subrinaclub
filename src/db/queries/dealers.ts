import { PrismaClient, Dealer } from '@prisma/client'

export class DealerService {
    constructor(private readonly prismaDealer: PrismaClient['dealer']) {}

    // Get all dealers
    async getDealers(): Promise<Dealer[]> {
        return await this.prismaDealer.findMany()
    }

    // Get dealer by id
    async getDealerById(id: number): Promise<Dealer | null> {
        return await this.prismaDealer.findUnique({
            where: {
                id: id,
                active: true,
            },
        })
    }

    // Get dealers for select input
    async getDealersForSelect(): Promise<Dealer[]> {
        const res = await this.prismaDealer.findMany({
            select: {
                id: true,
                fullName: true,
            },
        })

        // Return as id, name array
        return res.map(dealer => {
            return {
                id: dealer.id,
                name: dealer.fullName,
            }
        })
    }
}
