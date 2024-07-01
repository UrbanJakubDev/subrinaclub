import React from 'react'
import { KpiCardProgress } from '../../ui/stats/KpiCardProgress';
import LineChart from '../../ui/charts/line';
import InputDateFiled from '../../ui/inputs/dateInput';
import { getSumOfTransactionsByAccountIdAndDate, getTransactionsByAccountIdAndDate } from '@/db/queries/transactions';
import TransactionsTable from '../../tables/transactionsTable';

type Props = {
  savingPeriod: any;
}

interface Series {
  name: string;
  data: number[];
}

interface ChartData {
  series: Series[];
  categories: string[];
}

const SavingPeriodStats = async ({ savingPeriod }: Props) => {

  // TODO: Modify the model to have the date as a string in the format YYYY-QQ
  let startDate = savingPeriod.savingStartDate
  let endDate = savingPeriod.savingEndDate

  // Get the points for the saving period
  const points = await getSumOfTransactionsByAccountIdAndDate(savingPeriod.accountId, startDate, endDate)
  const transationsInSavingPeriod = await getTransactionsByAccountIdAndDate(savingPeriod.accountId, startDate, endDate)


  const getSumOfTransactionsForChart = (transactions: any, startDate: String, endDate: String) => {
    const [startYear, startQuarter] = startDate.split("-");
    const [endYear, endQuarter] = endDate.split("-");


    // Initialize a map to store the sums per quarter
    const quarterSums: { [key: string]: number } = {};

    // Populate the map with sums
    transactions.forEach((transaction) => {
      const key = `${transaction.year}-Q${transaction.quarter}`;
      if (!quarterSums[key]) {
        quarterSums[key] = 0;
      }
      quarterSums[key] += transaction.amount;
    });

    // Generate the categories and data for the series
    const categories: string[] = [];
    const data: number[] = [];

    let currentYear = parseInt(startYear);
    let currentQuarter = parseInt(startQuarter);

    while (
      currentYear < parseInt(endYear) ||
      (currentYear === parseInt(endYear) && currentQuarter <= parseInt(endQuarter))
    ) {
      const category = `${currentYear}-Q${currentQuarter}`;
      categories.push(category);
      data.push(quarterSums[category] || 0);

      // Move to the next quarter
      currentQuarter += 1;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear += 1;
      }
    }

    return {
      series: [
        {
          name: "Body",
          data: data,
        },
      ],
      categories: categories,
    };
  }

  const { series, categories } = getSumOfTransactionsForChart(transationsInSavingPeriod, startDate, endDate);

  return (
    <div className='pt-2'>

      <div className='flex gap-4 pb-4'>
        <KpiCardProgress title={`Dvouleté šetřící období od ${startDate} do ${endDate}`} points={points} color={savingPeriod.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
      </div>
      <LineChart
        title='Dvouleté šetřící období'
        description='Graf vývoje bodů za dvouleté šetřící období'
        series={series}
        categories={categories}
      />
    </div>
  )
}

export default SavingPeriodStats