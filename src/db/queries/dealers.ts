import { PrismaClient, Dealer } from '@prisma/client';

export class DealerService {
    constructor(private readonly prismaDealer: PrismaClient['dealer']) {}

    async getDealers(): Promise<Dealer[]> {
        return await this.prismaDealer.findMany();
    }

    async getDealerById(id: number): Promise<Dealer | null> {
        return await this.prismaDealer.findUnique({
            where: {
                id: id,
                active: true,
            },
        });
    }

    async getDealersForSelect(): Promise<Dealer[]> {
        const res = await this.prismaDealer.findMany({
            select: {
                id: true,
                fullName: true,
            },
        });

        // Return as id, name array
        return res.map(dealer => {
            return {
                id: dealer.id,
                name: dealer.fullName,
            };
        });
    }
}
