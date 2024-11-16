import { Dealer } from "@/types/dealer";
import { BaseRepository } from "./base/BaseRepository";
import { Prisma, PrismaClient } from "@prisma/client";

export class DealerRepository extends BaseRepository<
   Dealer,
   Prisma.DealerCreateInput,
   Prisma.DealerUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'dealer');
   }

   async getMaxRegistrationNumber(): Promise<number> {
      const dealer = await this.prisma.dealer.findFirst({
         select: {
            registrationNumber: true
         },
         orderBy: {
            registrationNumber: 'desc'
         }
      });

      return dealer?.registrationNumber ?? 0;
   }
}