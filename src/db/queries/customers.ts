import { Customer } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "../pgDBClient";

// basic CRUD operations for customers

export class CustomerService {
  // Create a new customer
  async createCustomer(customer: Customer): Promise<Customer> {
    // Make the unique publicId for the customer from the registrationNumber and UUID
    const publicId = `${customer.registrationNumber}SU${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    customer.publicId = publicId;
    const newCustomer = await prisma.customer.create({
      data: customer,
    });

    const newAccount = await prisma.account.create({
      data: {
        type: "LIFETIME",
        balance: 0,
        createdAt: new Date(),
        openedAt: new Date(),
        closedAt: null,
        customerId: newCustomer.id,
      },
    });

    return newCustomer;
  }

  // Read all customers
  async getCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany();
    return customers;
  }

  async geetCustomersForReportSeznamObratu() {
    // const customers = await prisma.customer.findMany({
    //   select: {
    //     registrationNumber: true,
    //     fullName: true,
    //     accounts: {
    //       select: {
    //         transactions: {
    //           where: {
    //             type: "DEPOSIT",
    //           },
    //           select: {
    //             year: true,
    //             amount: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const result = customers.map((customer) => {
    //   const pointsByYear = {};

    //   customer.accounts.forEach((account) => {
    //     account.transactions.forEach((transaction) => {
    //       const year = transaction.year;
    //       pointsByYear[year] = (pointsByYear[year] || 0) + transaction.amount;
    //     });
    //   });

    //   return {
    //     registrationNumber: customer.registrationNumber,
    //     fullName: customer.fullName,
    //     clubScore: customer.accounts.reduce(
    //       (acc, curr) =>
    //         acc + curr.transactions.reduce((acc, curr) => acc + curr.amount, 0),
    //       0
    //     ),
    //     ...pointsByYear,
    //   };
    // });

    const result = await prisma.$queryRaw`SELECT
            c."registrationNumber",
            max(c."fullName") as "fullName",
            max(c."town") as "town",
            max(c."salonName") as "salonName",
            sum(t.amount) as "clubScore",
            sum(case when t."year" = 2024 then t.amount else 0 end) as "2024",
            sum(case when t."year" = 2023 then t.amount else 0 end) as "2023",
            sum(case when t."year" = 2022 then t.amount else 0 end) as "2022",
            sum(case when t."year" = 2021 then t.amount else 0 end) as "2021",
            sum(case when t."year" = 2020 then t.amount else 0 end) as "2020",
            sum(case when t."year" = 2019 then t.amount else 0 end) as "2019",
            sum(case when t."year" = 2018 then t.amount else 0 end) as "2018",
            sum(case when t."year" = 2017 then t.amount else 0 end) as "2017",
            sum(case when t."year" = 2016 then t.amount else 0 end) as "2016",
            sum(case when t."year" = 2015 then t.amount else 0 end) as "2015",
            sum(case when t."year" = 2014 then t.amount else 0 end) as "2014",
            sum(case when t."year" = 2013 then t.amount else 0 end) as "2013",
            sum(case when t."year" = 2012 then t.amount else 0 end) as "2012",
            sum(case when t."year" = 2011 then t.amount else 0 end) as "2011",
            sum(case when t."year" = 2010 then t.amount else 0 end) as "2010"
        FROM
            "Customer" c
        JOIN
            "Account" a ON c.id = a."customerId"
        JOIN
            "Transaction" t ON t."accountId" = a.id
        WHERE
            t."type" = 'DEPOSIT'
        GROUP BY
            c."registrationNumber"`;

    const formattedResult = result.map((row) => ({
      ...row,
      clubScore: Number(row.clubScore),
      "2024": Number(row["2024"]),
      "2023": Number(row["2023"]),
      "2022": Number(row["2022"]),
      "2021": Number(row["2021"]),
      "2020": Number(row["2020"]),
      "2019": Number(row["2019"]),
      "2018": Number(row["2018"]),
      "2017": Number(row["2017"]),
      "2016": Number(row["2016"]),
      "2015": Number(row["2015"]),
      "2014": Number(row["2014"]),
      "2013": Number(row["2013"]),
      "2012": Number(row["2012"]),
      "2011": Number(row["2011"]),
      "2010": Number(row["2010"]),
    }));

    return formattedResult;
  }

  // Read a customer by ID
  async getCustomerById(id: number): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });
    if (!customer) {
      notFound();
    }
    return customer;
  }

  // Update a customer by ID
  async updateCustomerById(id: number, customer: Customer): Promise<Customer> {
    const { dealerId, salesManagerId, ...customerData } = customer;

    try {
      const updatedCustomer = await prisma.customer.update({
        where: {
          id: id,
        },
        data: {
          ...customerData,
          dealer: {
            connect: {
              id: dealerId,
            },
          },
          salesManager: {
            connect: {
              id: salesManagerId,
            },
          },
        },
      });
      return updatedCustomer;
    } catch (error) {
      // Handle error
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  // Restore a customer by ID (set the active flag to true)
  async restoreCustomerById(id: number): Promise<Customer> {
    const restoredCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        active: 1,
      },
    });
    return restoredCustomer;
  }

  // Get all customers, join with accounts and transactions to get the total points
  async getCustomersWithPoints(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      include: {
        accounts: {
          include: {
            transactions: true,
          },
        },
      },
    });
    return customers;
  }

  // Get the max registrationNumber from the customers
  async getMaxRegistrationNumber(): Promise<number> {
    const maxRegistrationNumber = await prisma.customer.findFirst({
      select: {
        registrationNumber: true,
      },
      orderBy: {
        registrationNumber: "desc",
      },
    });
    return maxRegistrationNumber.registrationNumber;
  }
}
