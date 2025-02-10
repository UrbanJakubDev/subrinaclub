import { Account } from "@/types/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { AccountResponseDTO } from "../services/account/types";

export class AccountRepository extends BaseRepository<
   Account,
   Prisma.AccountCreateInput,
   Prisma.AccountUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'account');
   }

   async getAccountWithSavingPeriods(accountId: number): Promise<AccountResponseDTO | null> {
      return this.prisma.account.findUnique({
         where: { id: accountId },
         include: {
            customer: true,
            savingPeriods: {
               orderBy: {
                  startDateTime: 'desc'
               }
            }
         }
      });
   }

   async getAllActiveAccounts(): Promise<AccountResponseDTO[]> {
      return this.prisma.account.findMany({
         where: {
            active: true
         },
         include: {
            customer: true,
            savingPeriods: {
               where: {
                  status: 'ACTIVE'
               },
               take: 1
            }
         },
         orderBy: {
            customer: {
               fullName: 'asc'
            }
         }
      });
   }
}