'use client'

import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from "@/components/features/detailPage/pageHeader";
import { useCustomer } from "@/lib/queries/customer/queries";
import CustomerCard from "@/components/features/customer/customerCard";
import AccountInfoCard from "@/components/features/customer/accountInfoCard";
import AccountStats from "@/components/features/account/accountStats";
import SavingPeriodStats from "@/components/features/savingPeriod/savingPeriodStats";
import TransactionDataView from "@/components/features/transactions/trasanctionDataView";

export default function UserDetailStatsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const customer_id = parseInt(id);
  const { data: customer } = useCustomer(customer_id);

  return (
    <PageComponent>
      {customer && (
        <>
          <PageHeader
            userName={customer.data.fullName}
            userId={customer.data.id.toString()}
            active={customer.data.active}
            formUrl={`/customers/${customer.data.id}`}
            accountUrl={`/accounts/${customer.data.account?.id}`}
            addBtn
          />
        </>
      )}

      {customer && (
        <>
          <div className="flex gap-8 my-2">
            <CustomerCard customer_id={customer.data.id} />
            <AccountInfoCard account_id={customer.data.account?.id} />
            <SavingPeriodStats account_id={customer.data.account?.id} />
          </div>
          <div>
            <div className="my-2">
              <AccountStats account_id={customer.data.account?.id} />
            </div>
            <div className="my-2 w-full">
              <TransactionDataView accountId={customer.data.account?.id} />
            </div>
          </div>
        </>
      )}

    </PageComponent>
  );
}   