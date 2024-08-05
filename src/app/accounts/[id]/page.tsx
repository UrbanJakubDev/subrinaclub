import { getAccountById } from "../../../db/queries/accounts";
import { getTransactionsByAccountId } from "../../../db/queries/transactions";
import PageHeader from '../../../components/detailPage/pageHeader';
import TransactionForm from '../../../components/forms/transactionForm';
import TrasactionTable from '../../../components/tables/transactionsTable';
import AccountDetail from '@/components/blocks/account/detail';
import SavingPeriodStats from '@/components/blocks/savingPeriod/savingPeriodStats';
import SavingPeriodsComponent from '@/components/blocks/savingPeriod/savingPeriodsComponent';
import PageComponent from "@/components/detailPage/pageComponent";


const AccountDetailPage = async ({ params }: { params: { id: string } }) => {

  const account = await getAccountById(parseInt(params.id));
  const savingPeriods = account?.savingPeriods;
  const customer = account.customer;
  const activeSavingPeriod = savingPeriods.find((savingPeriod: any) => savingPeriod.active)


  if (!account || !customer) {
    return <div>Loading</div>
  }

  return (
    <PageComponent>
      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
        statsUrl={`/users/${customer.id}/stats`}
        formUrl={`/users/${customer.id}`}
      />
      <h2>{customer.fullName}</h2>
      <div className='flex'>
        <div className='w-1/2 p-4'>
          <AccountDetail account={account} />
          <SavingPeriodStats savingPeriod={activeSavingPeriod} />
        </div>
        <div className='w-1/2 p-4'>
          <TransactionForm accountId={account.id} customer={customer} savingPeriod={activeSavingPeriod} />
          <SavingPeriodsComponent savingPeriods={savingPeriods} account={account} />
        </div>
      </div>

    </PageComponent>
  )
}

export default AccountDetailPage