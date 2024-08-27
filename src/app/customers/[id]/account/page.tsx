
import DetailDataWrapper from "@/components/blocks/customer/detailDataWrapper";
import SavingPeriodsComponent from "@/components/blocks/savingPeriod/savingPeriodsComponent";
import PageComponent from "@/components/detailPage/pageComponent";
import PageHeader from '@/components/detailPage/pageHeader';
import TransactionForm from '@/components/forms/transactionForm';
import { getAccountById, getAccountByUserId } from '@/db/queries/accounts';
import { CustomerService } from "@/db/queries/customers";
import { ICustomer } from "@/interfaces/interfaces";


const AccountDetailPage = async ({ params }: { params: { id: string } }) => {


  const customerService = new CustomerService();
  const customerId = parseInt(params.id);
  const customer = await customerService.getCustomerById(customerId) as unknown as ICustomer;
  const savingPeriods = customer.accounts[0].savingPeriods;
  const account = customer.accounts[0];

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
         <DetailDataWrapper initialCustomer={customer} />
        </div>
        <div className='w-1/2 p-4'>
          <TransactionForm  />
          <SavingPeriodsComponent savingPeriods={savingPeriods} />
        </div>
      </div>

    </PageComponent>
  )
}

export default AccountDetailPage