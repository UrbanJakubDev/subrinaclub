import PageComponent from "@/components/detailPage/pageComponent";
import CustomerTable from "@/components/tables/customerTable";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Typography from "@/components/ui/typography";
import { CustomerService } from "@/db/queries/customers";
import Link from "next/link";
import React from "react";

type Props = {};

export default async function Users({ }: Props) {
  // Get all users
  const customerService = new CustomerService();
  const customers = await customerService.getCustomers(true);


  if (!customers) {
    <Loader />
  }

  return (
    <PageComponent>
      <div className="flex justify-between w-full my-2">
        <Typography variant="h3">Zákazníci - základní přehled</Typography>
      </div>
      <CustomerTable defaultData={customers} detailLinkPath="/users" />
    </PageComponent>
  );
}
