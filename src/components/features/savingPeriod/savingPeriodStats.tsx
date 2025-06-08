'use client'
import ColumnChart from '@/components/ui/charts/columnChart';
import Skeleton from '@/components/ui/skeleton';
import { KpiCardProgress } from '@/components/ui/stats/cardsWidgets/KpiCardProgress';
import { useSavingPeriodByAccount, useTransactionsBySavingPeriodId } from '@/lib/queries/savingPeriod/queries';
import { Transaction } from '@/types/transaction';
import { SavingPeriod } from '@/types/types';
import { Card } from '@material-tailwind/react';
import { useMemo } from 'react';

type Props = {
  account_id: number;
}

interface QuarterData {
  quarter: string;  // Format: "2024-Q1"
  depositedPoints: number;
}

export default function SavingPeriodStats({ account_id }: Props) {
  const { data: savingPeriod, isLoading: isSavingPeriodLoading } = useSavingPeriodByAccount(account_id) as any;
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactionsBySavingPeriodId(savingPeriod?.id) as any;

  // Move chart data preparation to a separate function
  const chartData = useMemo(() =>
    prepareSavingPeriodChartData(savingPeriod, transactions),
    [savingPeriod, transactions]
  );

  // Early return if no saving period
  if (!savingPeriod) {
    return (
      <Card className='p-8 grow rounded-sm'>
        <p>
          No saving period selected.
        </p>
        {/* <SavingPeriodForm /> */}
      </Card>
    );
  }

  if (isSavingPeriodLoading || isTransactionsLoading) return <Skeleton className="w-2/4" type="chart" />;

  return (
    <Card className='p-8 flex grow rounded-sm w-1/3'>
      <div className='flex gap-4 pb-4'>
        <KpiCardProgress
          title={`Dvouleté šetřící období od ${savingPeriod?.startYear}-Q${savingPeriod?.startQuarter} do ${savingPeriod?.endYear}-Q${savingPeriod?.endQuarter}`}
          points={savingPeriod?.availablePoints}
          icon={<i className="fas fa-arrow-up"></i>}
          color="blue"
        />
      </div>
      <ColumnChart
        title="Průběžné konto"
        description="Přehled nasbíraných bodů za šetřící období"
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
    currentYear < savingPeriod?.endYear ||
    (currentYear === savingPeriod?.endYear && currentQuarter <= savingPeriod?.endQuarter)
  ) {
    quarters.push({
      quarter: `${currentYear}-Q${currentQuarter}`,
      depositedPoints: 0,
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

    if (quarterIndex !== -1 && transaction.points > 0) {
      quarters[quarterIndex].depositedPoints += transaction.points;
    }
  });

  // Prepare chart data
  return {
    categories: quarters.map(q => q.quarter),
    series: [
      {
        name: 'Stav bodů',
        data: quarters.map(q => q.depositedPoints)
      },

    ]
  };
}
