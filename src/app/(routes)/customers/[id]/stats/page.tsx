import StatsDataWrapper from "@/components/features/customer/statsDataWrapper";
import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from "@/components/features/detailPage/pageHeader";
import { getTransactionsByAccountId } from "@/lib/db/queries/transactions";
import CustomerCard from "@/components/features/customer/customerCard";
import { customerService } from "@/lib/services/customer";
import AccountInfoCard from "@/components/features/customer/accountInfoCard";
import AccountStats from "@/components/features/customer/account/accountStats";
import Skeleton from "@/components/ui/skeleton";
import TransactionsTable from "@/components/features/transactions/transactionsTable";
import CustomerProvider from "@/contexts/CustomerContext";
import ModalProvider from "@/contexts/ModalContext";

export default async function UserDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let customer_id = parseInt(params.id);


  const customer = await customerService.getAccountDataWithActiveSavingPeriod(customer_id);
  const { account } = customer;

  // 
  const { savingPeriods } = account
  // const customer = await customerService.get(customer_id) as Customer;
  const transactions = await getTransactionsByAccountId(account.id);

  return (
    <PageComponent>
      <CustomerProvider>
        <PageHeader
          userName={customer.fullName}
          userId={customer.id.toString()}
          active={customer.active}
          formUrl={`/customers/${customer.id}`}
          addBtn
        />
        <StatsDataWrapper initialCustomer={customer} initialTransactions={transactions} >
          <div className="flex gap-8 my-2">
            <CustomerCard customer={customer} />
            <AccountInfoCard account={account} customer={customer} />
          </div>
          <div>
            <div className="my-2">
              <AccountStats initData={transactions} />
            </div>
            <div className="my-2">
              <h2>Přehled všech transakcí</h2>
              {!account ? <Skeleton /> : (
                <TransactionsTable
                  tableName={`Transakce ${customer.fullName}`}
                  accountId={account.id} transactions={transactions} />
              )}
            </div>
          </div>
        </StatsDataWrapper>
      </CustomerProvider>
    </PageComponent>
  );
}   