import AccountStats from "@/components/detailPage/accountStats";
import PageHeader from "@/components/detailPage/pageHeader";
import CustomerForm from "@/components/forms/customerForm";
import CustomerTable from "@/components/tables/customerTable";
import TransactionsTable from "@/components/tables/transactionsTable";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { getAccountByUserId } from "@/db/queries/accounts";
import { getCustomerById, getCustomers } from "@/db/queries/customers";
import {
  getDealerById,
  getDealers,
  getDealersForSelect,
} from "@/db/queries/dealers";
import {
  getSalesManagerById,
  getSalesManagers,
  getSalesManagersForSelect,
} from "@/db/queries/salesManagers";
import { getTransactionsByCustomerId } from "@/db/queries/transactions";
import { IAccount, ICustomer, ITransaction } from "@/interfaces/interfaces";
import { PrismaClient } from "@prisma/client";
import { register } from "module";
import Link from "next/link";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {
  // Get the id from the URL as a number
  let customer_id = parseInt(params.id);
  const customer = (await getCustomerById(customer_id)) as ICustomer;
  const dealers = await getDealersForSelect();
  const salesManager = await getSalesManagersForSelect();

  const dials = {
    dealers: dealers,
    salesManagers: salesManager,
  };

  {
    if (!customer || !dealers || !salesManager) {
      return <div>loading...</div>;
    }
  }

  return (
    <div className="content-container p-6 my-2">
      <PageHeader
        userName={customer.fullName}
        userId={customer.id.toString()}
        active={customer.active}
      />
      <Suspense fallback={<Loader />}>
        <CustomerForm customer={customer} dials={dials} />
      </Suspense>
    </div>
  );
}
