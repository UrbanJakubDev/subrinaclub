import AccountStats from "@/components/detailPage/accountStats";
import PageHeader from "@/components/detailPage/pageHeader";
import CustomerForm from "@/components/forms/customerForm";
import Loader from "@/components/ui/loader";
import { getAccountByUserId } from "@/db/queries/accounts";
import { getCustomerById, updateCustomerById } from "@/db/queries/customers";
import { getDealersForSelect } from "@/db/queries/dealers";
import { getSalesManagersForSelect } from "@/db/queries/salesManagers";
import { getTransactionsByCustomerId } from "@/db/queries/transactions";
import { IAccount, ICustomer } from "@/interfaces/interfaces";
import { Suspense } from "react";

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {
  // Get the id from the URL as a number
  let customer_id = parseInt(params.id);
  const customer = await getCustomerById(customer_id) as ICustomer;
  const dealers = await getDealersForSelect();
  const salesManager = await getSalesManagersForSelect();
  const account = (await getAccountByUserId(customer_id)) as IAccount;
  const transactions = await getTransactionsByCustomerId(account.id);

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
    <>
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
      <div className="content-container p-6 my-2">
        <AccountStats account={account} transactions={transactions} />
      </div>
    </>
  );
}
