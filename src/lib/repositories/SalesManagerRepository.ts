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


   async getLifeTimePointsOfCustomers(salesManagerId: number): Promise<number> {
      const result = await this.prisma.customer.findMany({
         where: {
            salesManagerId: salesManagerId
         },
         include: {
            account: {
               select: {
                  lifetimePoints: true,
                  lifetimePointsCorrection: true
               }
            }
         }
      });

      // Sum up lifetimePoints from all customer accounts
      const totalPoints = result.reduce((sum, customer) => {
         return sum + (customer.account?.lifetimePoints || 0) + (customer.account?.lifetimePointsCorrection || 0);
      }, 0);

      return totalPoints;
   }


   // Get customers with accounts data belonging to the sales manager
   /**
    * Retrieves customers with their associated accounts for a given sales manager.
    * @param salesManagerId - The ID of the sales manager.
    * @returns A Promise that resolves to an array of customers with their associated accounts.
    */
   async getCustomersWithAccounts(salesManagerId: number): Promise<any> {
      const result = await this.prisma.customer.findMany({
         where: {
            salesManagerId: salesManagerId
         },
         include: {
            account: {
               include: {
                  savingPeriods: {
                     where: {
                        status: "ACTIVE"
                     }
                  }
               }
            },
            dealer: true,
         },
         orderBy: {
            fullName: 'asc'
         }
      });

      return result;
   }


   // Get customers counts info for a sales manager
   async getCustomersCountsInfo(salesManagerId: number, year: number): Promise<{
      allCustomers: number;
      activeCustomers: number;
   }> {
      // Get total count of customers
      const allCustomers = await this.prisma.customer.count({
         where: {
            salesManagerId: salesManagerId
         }
      });

      // Get count of customers with transactions in given year
      const activeCustomers = await this.prisma.customer.count({
         where: {
            salesManagerId: salesManagerId,
            account: {
               transactions: {
                  some: {
                     year: year
                  }
               }
            }
         }
      });



      return {
         allCustomers,
         activeCustomers
      };
   }


   // Get transactions for customer accounts assigned to sales manager
   async getTransactionsForCustomerAccounts(salesManagerId: number, year: number): Promise<any> {
      const result = await this.prisma.transaction.findMany({
         where: {
            account: {
               customer: { salesManagerId: salesManagerId }
            },
            year: year,
            type: "DEPOSIT"
         }
      });

      return result;
   }
}