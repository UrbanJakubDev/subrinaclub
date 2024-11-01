import { KpiCardProgress } from '../../ui/stats/cardsWidgets/KpiCardProgress';
import LineChart from '../../ui/charts/line';
import Skeleton from '@/components/ui/skeleton';

type Props = {
  savingPeriod: any;
  transactions: any;
  points: number;
  isLoading: boolean;
}

interface Series {
  name: string;
  data: number[];
}

interface ChartData {
  series: Series[];
  categories: string[];
}

export default function SavingPeriodStats({ savingPeriod, transactions, points, isLoading }: Props) {

  // TODO: Modify the model to have the date as a string in the format YYYY-QQ
  let startDate = savingPeriod.savingStartDate
  let endDate = savingPeriod.savingEndDate


  // Get the points for the saving period and the transactions in the saving period for Chart
  const getSumOfTransactionsForChart = (savingPeriod: any) => {
    // Initialize a map to store the sums per quarter
    const quarterSums: { [key: string]: number } = {};
  
    // Populate the map with sums
    savingPeriod.transactions.forEach((transaction) => {
      const key = `${transaction.year}-Q${transaction.quarter}`;
      if (!quarterSums[key]) {
        quarterSums[key] = 0;
      }
      quarterSums[key] += transaction.points;
    });
  
    // Generate the categories and data for the series
    const categories: string[] = [];
    const data: number[] = [];
  
    let currentYear = savingPeriod.startYear;
    let currentQuarter = savingPeriod.startQuarter;
  
    while (
      currentYear < savingPeriod.endYear ||
      (currentYear === savingPeriod.endYear && currentQuarter <= savingPeriod.endQuarter)
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
          name: "Points",
          data: data,
        },
      ],
      categories: categories,
    };
  };

  const { series, categories } = getSumOfTransactionsForChart(savingPeriod);

  if (isLoading || !savingPeriod || !transactions) {
    <Skeleton />
  }

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
