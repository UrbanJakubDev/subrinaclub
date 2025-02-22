
import SavingPeriodsComponent from "@/components/features/savingPeriod/savingPeriodsComponent";
import PageComponent from "@/components/features/detailPage/pageComponent";
import PageHeader from '@/components/features/detailPage/pageHeader';
import TransactionForm from '@/components/features/transactions/transactionForm';
import { getCustomerById } from "@/lib/db/queries/customers";
import { Customer } from "@/types/customer";


const AccountDetailPage = async ({ params }: { params: { id: string } }) => {



  const customerId = parseInt(params.id);
  const customer = await getCustomerById(customerId) as Customer;
  const savingPeriods = customer.account.savingPeriods;
  const account = customer.account;

  return (
    <PageComponent>
      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
        statsUrl={`/customers/${customer.id}/stats`}
        formUrl={`/customers/${customer.id}`}
        addBtn
      />
      <h2>{customer.fullName}</h2>
      <div className='flex'>
        <div className='w-1/2 p-4'>
         <pre>
          {JSON.stringify(customer, null, 2)}
         </pre>
        </div>
        <div className='w-1/2 p-4'>
          <SavingPeriodsComponent savingPeriods={savingPeriods} />
        </div>
      </div>

    </PageComponent>
  )
}

export default AccountDetailPage