import { useMemo, useCallback } from 'react';
import { Transaction } from '@/types/transaction';
import KpiCard from '@/components/ui/stats/cardsWidgets/KpiCard';
import { useStatsStore } from '@/stores/CustomerStatsStore';
import { Alert } from '@material-tailwind/react';



interface QuarterSummary {
  quarter: number;
  sumPoints: number;
  transactions: Transaction[];
}

interface Props {
  className?: string;
}

// Separate the quarter calculations into a custom hook for better reusability
const useQuarterStats = (transactions: Transaction[], year: number) => {
  return useMemo(() => {
    if (!transactions?.length) return [];

    // Initialize all quarters with proper typing
    const quarterMap = new Map<number, QuarterSummary>();
    
    // Initialize all quarters (1-4) with default values
    for (let q = 1; q <= 4; q++) {
      quarterMap.set(q, {
        quarter: q,
        sumPoints: 0,
        transactions: []
      });
    }

    // Process transactions
    transactions
      .filter(t => t.year === year)
      .forEach(transaction => {
        const quarter = quarterMap.get(transaction.quarter);
        if (quarter) {
          quarter.sumPoints += transaction.points;
          quarter.transactions.push(transaction);
        }
      });

    // Convert map to array and filter out empty quarters
    return Array.from(quarterMap.values())
      .filter(q => q.sumPoints !== 0)
      .sort((a, b) => a.quarter - b.quarter);
  }, [transactions, year]);
};

// Separate KPI section into its own component
const AccountOverview = ({ 
  clubPoints, 
  yearPoints, 
  year 
}: { 
  clubPoints: number; 
  yearPoints: number; 
  year: number; 
}) => (
  <div className='flex gap-4 flex-grow'>
    <div className='w-1/2'>
      <KpiCard 
        title="Klubové konto" 
        price={`${clubPoints} b.`} 
        icon={<i className="fas fa-arrow-up" />} 
      />
    </div>
    <div className='w-1/2'>
      <KpiCard 
        title="Roční konto pro rok:" 
        percentage={year} 
        price={`${yearPoints} b.`} 
        icon={<i className="fas fa-arrow-up" />} 
      />
    </div>
  </div>
);

// Separate Quarter summary section into its own component
const QuarterSummary = ({ 
  quarterPoints, 
  year 
}: { 
  quarterPoints: QuarterSummary[]; 
  year: number; 
}) => {
  if (!quarterPoints.length) return null;

  return (
    <div className='flex w-full justify-between py-4 gap-4'>
      {quarterPoints.map((quarter) => (
        <KpiCard 
          key={quarter.quarter}
          title={`${quarter.quarter}. čtvrtletí`}
          percentage={year}
          price={`${quarter.sumPoints} b.`}
          icon={<i className="fas fa-arrow-up" />}
          tooltip={`Počet transakcí: ${quarter.transactions.length}`}
        />
      ))}
    </div>
  );
};

export default function AccountDataView({ className = '' }: Props) {
  const customer = useStatsStore(state => state.customer);
  const transactions = useStatsStore(state => state.transactions);
  
  // Error handling for missing data
  if (!customer?.account || !transactions) {
    return (
      <Alert>
          Nepodařilo se načíst data účtu. Zkuste to prosím později.
      </Alert>
    );
  }

  const { account } = customer;
  const year = new Date().getFullYear();
  
  // Use custom hook for quarter calculations
  const quarterPoints = useQuarterStats(transactions, year);
  return (
    <div className={`h-full w-full gap-6 px-8 rounded-lg ${className}`}>
      <div className='rounded-lg'>
        <AccountOverview 
          clubPoints={account.lifetimePoints}
          yearPoints={account.currentYearPoints}
          year={year}
        />
        
        <QuarterSummary 
          quarterPoints={quarterPoints} 
          year={year}
        />
      </div>
    </div>
  );
}