import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Bonus } from "@/types/bonus";


export class BonusRepository extends BaseRepository<
   Bonus,
   Prisma.BonusCreateInput,
   Prisma.BonusUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'bonus');
   }

   
}