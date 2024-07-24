import AccountStats from "@/components/blocks/account/accountStats";
import PageComponent from "@/components/detailPage/pageComponent";
import PageHeader from "@/components/detailPage/pageHeader";
import TransactionsTable from "@/components/tables/transactionsTable";
import Loader from "@/components/ui/loader";
import { getAccountByUserId } from "@/db/queries/accounts";
import { CustomerService } from "@/db/queries/customers";
import { getTransactionsByAccountId } from "@/db/queries/transactions";
import { IAccount, ICustomer } from "@/interfaces/interfaces";

export default async function UserDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let customer_id = parseInt(params.id);

  const customerService = new CustomerService();

  const customer = (await customerService.getCustomerById(customer_id)) as ICustomer;
  const account = (await getAccountByUserId(customer_id)) as IAccount;
  const transactions = await getTransactionsByAccountId(account.id);

  return (
    <PageComponent>
      <PageHeader
        userName={customer.fullName}
        userId={customer.id.toString()}
        active={customer.active}
        accountUrl={`/accounts/${account.id}`}
        formUrl={`/users/${customer.id}`}
      />
      <div className="content-container p-6 my-2">
        <AccountStats customer={customer} account={account} transactions={transactions} />
      </div>
      <div className="content-container p-6 my-2 ">
        <h2>Přehled všech transakcí</h2>
        <TransactionsTable defaultData={transactions} />
      </div>
    </PageComponent>
  );
}

