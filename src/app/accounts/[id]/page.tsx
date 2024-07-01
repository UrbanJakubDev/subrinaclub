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


const AccountDetailPage = async ({ params }: { params: { id: string } }) => {

  const account = await getAccountById(parseInt(params.id));
  const savingPeriods = account.savingPeriods;
  const customer = account.customer;

  const activeSavingPeriod = savingPeriods.find((savingPeriod: any) => savingPeriod.active)
  const transactions = await getTransactionsByAccountIdAndDate(account.id, activeSavingPeriod?.savingStartDate, activeSavingPeriod?.savingEndDate);
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
      <div className='flex flex-grow gap-4 p-2'>

        <div className='flex gap-4'>
          <AccountForm account={account} customer={customer} />
          <TransactionForm accountId={account.id} />
          <div className='p-4'>

            <h2 className="text-xl font-bold text-center">Šetřící období</h2>
            <SimpleSelectInput
              label="Šetřící období"
              value={activeSavingPeriod?.id}
              options={
                savingPeriods.map((savingPeriod: any) => ({
                  name: `${savingPeriod.savingStartDate} - ${savingPeriod.savingEndDate}`,
                  id: savingPeriod.id
                }))
              } />
            <div className='p-4'>

              {savingPeriods.map((savingPeriod: any) => (
                <SavingPeriodForm key={savingPeriod.id} savingPeriod={savingPeriod} />
              ))}
            </div>

            <h2 className="text-xl font-bold text-center">Transakce v aktivním šetřícím období</h2>
            {transactions.map((transaction: any) => (
              <div key={transaction.id}>
                <p>{transaction.year} - {transaction.quarter} - {transaction.amount} - {transaction.type}</p>
              </div>
            ))}


          </div>
        </div>
      </div>
      <TrasactionTable defaultData={allTransactions} />
    </div>
  )
}

export default AccountDetailPage