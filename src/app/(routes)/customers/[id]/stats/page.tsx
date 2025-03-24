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

  const customerData = await customerService.getAccountDataWithActiveSavingPeriod(customer_id);
  // Get the first customer from the array
  const customer = Array.isArray(customerData) ? customerData[0] : customerData;
  
  if (!customer || !customer.account) {
    throw new Error('Customer or account data not found');
  }
  
  const { account } = customer;
  const transactions = await transactionService.getByAccountId(account?.id);

  // Serialize the customer data to avoid Decimal object serialization error
  const serializedCustomer = {
    ...customer,
    account: {
      ...customer.account,
      // Convert Decimal to number using toString() and parseFloat
      averagePointsBeforeSalesManager: customer.account.averagePointsBeforeSalesManager 
        ? parseFloat(customer.account.averagePointsBeforeSalesManager.toString()) 
        : 0,
      // Ensure other possible Decimal fields are also serialized
      lifetimePoints: Number(customer.account.lifetimePoints),
      lifetimePointsCorrection: Number(customer.account.lifetimePointsCorrection),
      // Calculate lifetimePointsCorrected if it doesn't exist
      lifetimePointsCorrected: Number(customer.account.lifetimePoints) + Number(customer.account.lifetimePointsCorrection),
    }
  };

  return (
    <PageComponent>
        <PageHeader
          userName={customer.fullName}
          userId={customer.id.toString()}
          active={customer.active}
          formUrl={`/customers/${customer.id}`}
          accountUrl={`/accounts/${account?.id}`}
          addBtn
        />
      
        <CustomerStatsView initialCustomer={serializedCustomer} initialTransactions={transactions} />
    </PageComponent>
  );
}   