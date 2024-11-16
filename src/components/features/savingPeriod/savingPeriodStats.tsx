'use client'
import ColumnChart from '@/components/ui/charts/columnChart';
import { KpiCardProgress } from '@/components/ui/stats/cardsWidgets/KpiCardProgress';
import { Transaction } from '@/types/transaction';
import { SavingPeriod } from '@/types/types';
import { Card } from '@material-tailwind/react';
import { useMemo } from 'react';

type Props = {
  savingPeriod: SavingPeriod | null;
  transactions?: Transaction[];
}

interface Series {
  name: string;
  data: number[];
}

interface ChartData {
  series: Series[];
  categories: string[];
}

interface QuarterData {
  quarter: string;  // Format: "2024-Q1"
  points: number;
  deposits: number;
  withdrawals: number;
}

export default function SavingPeriodStats({ savingPeriod, transactions = [] }: Props) {
  // Early return if no saving period
  if (!savingPeriod) {
    return (
      <Card className='p-8 grow rounded-sm'>
        <p>No data for saving period</p>
        <p>New saving period form here...</p>
      </Card>
    );
  }

  // Move chart data preparation to a separate function
  const chartData = useMemo(() => 
    prepareSavingPeriodChartData(savingPeriod, transactions), 
    [savingPeriod, transactions]
  );

  return (
    <Card className='p-8 flex grow rounded-sm'>
      <div className='flex gap-4 pb-4'>
        <KpiCardProgress 
          title={`Dvouleté šetřící období od ${savingPeriod.startYear}-Q${savingPeriod.startQuarter}`} 
          points={savingPeriod.availablePoints} 
          icon={<i className="fas fa-arrow-up"></i>} 
        />
      </div>
      <ColumnChart
        title="Points Overview"
        description="Stacked points by quarter"
        colors={['#3B82A1', '#10A981', '#AF4444']}
        series={chartData.series}
        categories={chartData.categories}
        height={300}
        columnWidth="70%"
      />
    </Card>
  );
}

function prepareSavingPeriodChartData(savingPeriod: SavingPeriod, transactions: Transaction[] = []) {
  // Generate all quarters in range
  const quarters: QuarterData[] = [];
  let currentYear = savingPeriod?.startYear;
  let currentQuarter = savingPeriod?.startQuarter;

  while (
    currentYear < savingPeriod.endYear ||
    (currentYear === savingPeriod.endYear && currentQuarter <= savingPeriod.endQuarter)
  ) {
    quarters.push({
      quarter: `${currentYear}-Q${currentQuarter}`,
      points: 0,
      deposits: 0,
      withdrawals: 0
    });

    currentQuarter++;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      currentYear++;
    }
  }

  // Sum transactions for each quarter
  transactions.forEach(transaction => {
    const quarterIndex = quarters.findIndex(q =>
      q.quarter === `${transaction.year}-Q${transaction.quarter}`
    );

    if (quarterIndex !== -1) {
      quarters[quarterIndex].points += transaction.points;

      if (transaction.type === 'DEPOSIT') {
        quarters[quarterIndex].deposits += transaction.points;
      } else {
        quarters[quarterIndex].withdrawals += Math.abs(transaction.points);
      }
    }
  });

  // Prepare chart data
  return {
    categories: quarters.map(q => q.quarter),
    series: [
      {
        name: 'Stav bodů',
        data: quarters.map(q => q.points)
      },
      {
        name: 'Body z vkladů',
        data: quarters.map(q => q.deposits)
      },
      {
        name: 'Body z výběrů',
        data: quarters.map(q => q.withdrawals)
      }
    ]
  };
}
