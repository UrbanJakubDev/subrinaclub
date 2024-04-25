import AccountStats from "@/components/detailPage/accountStats";
import PageHeader from "@/components/detailPage/pageHeader";
import TransactionsTable from "@/components/tables/transactionsTable";
import { getAccountByUserId } from "@/db/queries/accounts";
import { getCustomerById } from "@/db/queries/customers";
import { getTransactionsByCustomerId } from "@/db/queries/transactions";
import { IAccount, ICustomer } from "@/interfaces/interfaces";

export default async function UserDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let customer_id = parseInt(params.id);

  const customer = (await getCustomerById(customer_id)) as ICustomer;
  const account = (await getAccountByUserId(customer_id)) as IAccount;
  const transactions = await getTransactionsByCustomerId(account.id);

  return (
    <div className="content-container p-6 my-2">
      <PageHeader
        userName={customer.fullName}
        userId={customer.id.toString()}
        active={customer.active}
      />
      <div className="content-container p-6 my-2">
        <AccountStats account={account} transactions={transactions} />
      </div>
      <div className="content-container p-6 my-2 ">
        <h2>Přehled transakcí</h2>
        <TransactionsTable defaultData={transactions} />
      </div>
    </div>
  );
}
