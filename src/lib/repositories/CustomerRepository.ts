import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";
import { Customer } from "@/types/customer";
import { CustomerResponseDTO, CustomerWithAccountDataAndActiveSavingPeriodDTO, SeznamObratuDTO } from "../services/customer/types";



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
         where: { id: id },
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
            salesManager: {
               select: {
                  id: true,
                  fullName: true
               }
            },
            dealer: {
               select: {
                  id: true,
                  fullName: true
               }
            }
         }
         
      });

      return accountData;
   }

   // Get all customers with their associated accounts belonging to the sales manager
   async getCustomersWithAccounts(salesManagerId: number): Promise<Customer[]> {
      const result = await this.prisma.customer.findMany({
         where: {
            salesManagerId: salesManagerId
         },
         include: {
            dealer: true,
            account: true
         }
      });

      return result;
   }

   // Deactivate customer
   async deactivateCustomer(id: number): Promise<Customer> {
      return this.prisma.customer.update({
         where: { id },
         data: { active: false }
      });
   }

   async getCustomersForReportSeznamObratu(): Promise<SeznamObratuDTO[]> {
      const result = await this.prisma.$queryRaw<SeznamObratuDTO[]>`
         SELECT
            c."registrationNumber",
            max(c.id) as "id",
            max(c."fullName") as "fullName",
            max(c."address") as "address",
            max(c."town") as "town",
            max(c."psc") as "zip",
            max(c."phone") as "phone",
            max(d."fullName") as "dealer",
            max(c."salonName") as "salonName",
            max(sm."fullName") as "salesManager",
            sum(t.points) as "clubScore",
            sum(case when (t."year" = 2025 and t."quarter" = 1) then t.points else 0 end) as "Q1",
            sum(case when (t."year" = 2025 and t."quarter" = 2) then t.points else 0 end) as "Q2",
            sum(case when (t."year" = 2025 and t."quarter" = 3) then t.points else 0 end) as "Q3",
            sum(case when (t."year" = 2025 and t."quarter" = 4) then t.points else 0 end) as "Q4",
            sum(case when t."year" = 2025 then t.points else 0 end) as "2025",
            sum(case when t."year" = 2024 then t.points else 0 end) as "2024",
            sum(case when t."year" = 2023 then t.points else 0 end) as "2023",
            sum(case when t."year" = 2022 then t.points else 0 end) as "2022",
            sum(case when t."year" = 2021 then t.points else 0 end) as "2021",
            sum(case when t."year" = 2020 then t.points else 0 end) as "2020",
            sum(case when t."year" = 2019 then t.points else 0 end) as "2019",
            sum(case when t."year" = 2018 then t.points else 0 end) as "2018",
            sum(case when t."year" = 2017 then t.points else 0 end) as "2017",
            sum(case when t."year" = 2016 then t.points else 0 end) as "2016",
            sum(case when t."year" = 2015 then t.points else 0 end) as "2015",
            sum(case when t."year" = 2014 then t.points else 0 end) as "2014",
            sum(case when t."year" = 2013 then t.points else 0 end) as "2013",
            sum(case when t."year" = 2012 then t.points else 0 end) as "2012",
            sum(case when t."year" = 2011 then t.points else 0 end) as "2011",
            sum(case when t."year" = 2010 then t.points else 0 end) as "2010"
         FROM
            "Customer" c
         JOIN
            "Account" a ON c.id = a."customerId"
         JOIN
            "Transaction" t ON t."accountId" = a.id
         JOIN 
            "SalesManager" sm ON c."salesManagerId" = sm.id
         JOIN 
            "Dealer" d ON c."dealerId" = d.id
         WHERE
            t."type" = 'DEPOSIT'
            and c."active" = true
         GROUP BY
            c."registrationNumber"`;

      const formattedResult = result.map(row => ({
         ...row,
         clubScore: Number(row.clubScore),
         Q1: Number(row['Q1']),
         Q2: Number(row['Q2']),
         Q3: Number(row['Q3']),
         Q4: Number(row['Q4']),
         '2025': Number(row['2025']),
         '2024': Number(row['2024']),
         '2023': Number(row['2023']),
         '2022': Number(row['2022']),
         '2021': Number(row['2021']),
         '2020': Number(row['2020']),
         '2019': Number(row['2019']),
         '2018': Number(row['2018']),
         '2017': Number(row['2017']),
         '2016': Number(row['2016']),
         '2015': Number(row['2015']),
         '2014': Number(row['2014']),
         '2013': Number(row['2013']),
         '2012': Number(row['2012']),
         '2011': Number(row['2011']),
         '2010': Number(row['2010']),
      }));

      return formattedResult;
   }
}