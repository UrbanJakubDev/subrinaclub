import { Account } from "@/types/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";

export class AccountRepository extends BaseRepository<
   Account,
   Prisma.AccountCreateInput,
   Prisma.AccountUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'account');
   }
}