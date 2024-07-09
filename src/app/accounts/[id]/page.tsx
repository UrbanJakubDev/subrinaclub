import React from 'react'
import { getAccountById } from "../../../db/queries/accounts";
import AccountForm from "../../../components/forms/accountForm";
import { getTransactionsByAccountId, getTransactionsByAccountIdAndDate } from "../../../db/queries/transactions";
import SavingPeriodForm from '../../../components/forms/savingPeriodForm';
import PageHeader from '../../../components/detailPage/pageHeader';
import SimpleSelectInput from '../../../components/ui/inputs/simpleSelectInput';
import TransactionForm from '../../../components/forms/transactionForm';
import TrasactionTable from '../../../components/tables/transactionsTable';
import Button from '../../../components/ui/button';
import AccountDetail from '@/components/blocks/account/detail';
import SavingPeriodStats from '@/components/blocks/savingPeriod/savingPeriodStats';
import SimpleTable from '@/components/tables/simpleTable';
import SavingPeriodCard from '@/components/blocks/savingPeriod/savingPeriodCard';
import SavingPeriodsComponent from '@/components/blocks/savingPeriod/savingPeriodsComponent';


const AccountDetailPage = async ({ params }: { params: { id: string } }) => {

  const account = await getAccountById(parseInt(params.id));
  const savingPeriods = account?.savingPeriods;
  const customer = account.customer;

  const activeSavingPeriod = savingPeriods.find((savingPeriod: any) => savingPeriod.active)
  const allTransactions = await getTransactionsByAccountId(account.id);


  if (!account || !customer) {
    return <div>Loading</div>
  }

  return (
    <div className='content-container p-6 my-2 flex flex-col h-11/12'>
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
          <TransactionForm account={account} />
          <SavingPeriodsComponent savingPeriods={savingPeriods} account={account}  />
        </div>
      </div>
      <TrasactionTable defaultData={allTransactions} />
    </div>
  )
}

export default AccountDetailPage