import CustomerTable from "@/components/tables/customerTable";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { CustomerService } from "@/db/queries/customers";
import Link from "next/link";
import React from "react";

type Props = {};

export default async function Users({ }: Props) {
  // Get all users
  const customerService = new CustomerService();
  const customers = await customerService.getCustomers();


  if (!customers) {
    <Loader />
  }

  return (
    <div className="p-6 content-container">
      <h1>Zákazníci - přehled</h1>
      <div>
        <Button size="sm">
          <Link href="/users/0">
            Přidat zákazníka
          </Link>
        </Button>
      </div>
      <CustomerTable defaultData={customers} detailLinkPath="/users" />
    </div>
  );
}
