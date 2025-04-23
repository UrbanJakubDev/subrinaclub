import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from "@/components/features/detailPage/pageHeader";
import { customerService } from "@/lib/services/customer";
import { transactionService } from "@/lib/services/transaction";
import CustomerStatsView from "@/components/features/customer/CustomerStatsView";
export default async function UserDetailStats({
  params: { id },
}: {
  params: { id: string };
}) {
  const customer_id = await Promise.resolve(parseInt(id));
  const customer = await customerService.getAccountDataWithActiveSavingPeriod(customer_id);
  const account = customer?.account;
  const transactions = await transactionService.getByAccountId(customer.account.id);


  return (
    <PageComponent>
      {customer && account && (
        <>
          <PageHeader
            userName={customer.fullName}
            userId={customer.id.toString()}
            active={customer.active}
            formUrl={`/customers/${customer.id}`}
            accountUrl={`/accounts/${account?.id}`}
            addBtn
          />
        </>
      )}

      {customer && account && transactions && (
        <CustomerStatsView initialCustomer={customer} initialTransactions={transactions} />
      )}

    </PageComponent>
  );
}   