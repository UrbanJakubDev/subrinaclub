import { SalesManager, Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";


export class SalesManagerRepository extends BaseRepository<
   SalesManager,
   Prisma.SalesManagerCreateInput,
   Prisma.SalesManagerUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'salesManager');
   }

   async getMaxRegistrationNumber(): Promise<number> {
      const salesManager = await this.prisma.salesManager.findFirst({
         select: {
            registrationNumber: true
         },
         orderBy: {
            registrationNumber: 'desc'
         }
      });

      return salesManager?.registrationNumber ?? 0;
   }
}