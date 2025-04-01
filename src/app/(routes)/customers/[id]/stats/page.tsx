'use client'

import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from "@/components/features/detailPage/pageHeader";
import CustomerStatsView from "@/components/features/customer/CustomerStatsView";
import { useCustomer } from "@/lib/queries/customer/queries";

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
        <CustomerStatsView initialCustomer={customer.data} />
      )}

    </PageComponent>
  );
}   