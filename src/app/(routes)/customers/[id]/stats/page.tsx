import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from "@/components/features/detailPage/pageHeader";
import { customerService } from "@/lib/services/customer";
import CustomerStatsView from "@/components/features/customer/CustomerStatsView";
import { transactionService } from "@/lib/services/transaction";

export default async function UserDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let customer_id = parseInt(params.id);


  const customer = await customerService.getAccountDataWithActiveSavingPeriod(customer_id)
  const { account } = customer;
  const transactions = await transactionService.getByAccountId(account?.id);

  return (
    <PageComponent>
        <PageHeader
          userName={customer.fullName}
          userId={customer.id.toString()}
          active={customer.active}
          formUrl={`/customers/${customer.id}`}
          addBtn
        />
      
        <CustomerStatsView initialCustomer={customer} initialTransactions={transactions} />
    </PageComponent>
  );
}   