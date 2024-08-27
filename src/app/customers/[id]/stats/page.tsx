import StatsDataWrapper from "@/components/blocks/customer/statsDataWrapper";
import PageComponent from "@/components/detailPage/pageComponent";
import PageHeader from "@/components/detailPage/pageHeader";
import TransactionForm from "@/components/forms/transactionForm";
import { CustomerService } from "@/db/queries/customers";
import { getTransactionsByAccountId } from "@/db/queries/transactions";
import { ICustomer } from "@/interfaces/interfaces";

export default async function UserDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let customer_id = parseInt(params.id);

  const customerService = new CustomerService();

  const customer = await customerService.getCustomerById(customer_id) as unknown as ICustomer;
  const transactions = await getTransactionsByAccountId(customer.accounts[0].id);

  return (
    <PageComponent>
      <PageHeader
        userName={customer.fullName}
        userId={customer.id.toString()}
        active={customer.active}
        accountUrl={`/customers/${customer.id}/account`}
        formUrl={`/customers/${customer.id}`}
        addBtn
      />
      <StatsDataWrapper initialCustomer={customer} initialTransactions={transactions} />
    </PageComponent>
  );
}