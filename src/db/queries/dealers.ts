import { PrismaClient, Dealer } from "@prisma/client";

export class DealerService {
   constructor(private readonly prismaDealer: PrismaClient['dealer']) {}

   async getDealers(): Promise<Dealer[]> {
      return await this.prismaDealer.findMany();
   }

   async getDealerById(id: number): Promise<Dealer | null> {
      return await this.prismaDealer.findUnique({
         where: {
            id: id,
            active: true
         }
      });
   }

   async getDealersForSelect(): Promise<Dealer[]> {
      return await this.prismaDealer.findMany({
         select: {
            id: true,
            fullName: true
         }
      });
   }
}