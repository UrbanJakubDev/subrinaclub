import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Customer } from "@/types/customer";
import { CustomerResponseDTO, CustomerWithAccountDataAndActiveSavingPeriodDTO } from "../services/customer/types";

export class CustomerRepository extends BaseRepository<
   Customer,
   Prisma.CustomerCreateInput,
   Prisma.CustomerUpdateInput
> {
   constructor(prisma: PrismaClient) {
      super(prisma, 'customer');
   }

   async getMaxRegistrationNumber(): Promise<number> {
      const result = await this.prisma.customer.aggregate({
         _max: {
            registrationNumber: true
         }
      });
      return result._max.registrationNumber || 0;
   }

   async findByIco(ico: string): Promise<any> {

      // Try to find customer by ICO
      const customer = await this.prisma.customer.findFirst({
         where: {
            ico
         }
      });

      return customer;
   }

   // Find customers Account with active saving period
   async getAccountDataWithActiveSavingPeriod(id: number): Promise<CustomerWithAccountDataAndActiveSavingPeriodDTO[]> {
      const accountData = await this.prisma.customer.findUnique({
         where: { id },
         include: {
            account: {
               include: {
                  savingPeriods: {
                     where: {
                        status: "ACTIVE"
                     }
                  }
               }
            }
         }
         
      });

      return accountData;
   }
}