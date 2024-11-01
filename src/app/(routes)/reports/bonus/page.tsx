import ReportBonusTable from '@/components/tables/reports/bonusTable'
import { getTransactions } from '@/lib/db/queries/transactions'
import React from 'react'

type Props = {}

const BonusReportPage = async (props: Props) => {

  const transactions = await getTransactions(2023, "WITHDRAW")

  // Get list of unique bonus names from transactions
  const getUniqueBonusNames = (transactions: any[]) => {
    const bonusNames = transactions.map((transaction) => transaction.bonusName)
    return [...new Set(bonusNames)]
  }

  // Sum amount of all transactions based on the bonusName
  const sumAmount = (transactions: any[], bonusName: string) => {
    return transactions
      .filter((transaction) => transaction.bonusName === bonusName)
      .reduce((acc, transaction) => acc + transaction.amount * -1, 0)
  }

  return (
    <>
      <div className="content-container p-6 my-2">
        <h1>Premium Bonus - 2023</h1>
        <ReportBonusTable defaultData={transactions} />
        <div className="flex justify-start mt-8">
          <div className="w-1/4">
            <h2 className="text-lg border-b">Bonus Summary</h2>
            <ul>
              {getUniqueBonusNames(transactions).map((bonusName) => (
                <li className='flex justify-between' key={bonusName}>
                  <span>{bonusName}</span>
                  <span className="float right">{sumAmount(transactions, bonusName)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default BonusReportPage