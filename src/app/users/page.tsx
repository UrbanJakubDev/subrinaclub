import CustomerTable from "@/components/tables/customerTable";
import Loader from "@/components/ui/loader";
import { getCustomers, getCustomersWithPoints } from "@/db/queries/customers";
import React from "react";

type Props = {};

export default async function Users({}: Props) {
  // Get all users
  const customers = await getCustomersWithPoints();

  if (!customers) {
    <Loader />
  }

  return (
    <div className="p-6 content-container">
      <h1>Users</h1>
      <CustomerTable defaultData={customers} detailLinkPath="/users" />
    </div>
  );
}
