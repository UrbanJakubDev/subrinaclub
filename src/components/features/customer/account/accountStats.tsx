"use client";
import React, { useState } from "react";
import SimpleSelectInput from "../../../ui/inputs/simpleSelectInput";
import { yearSelectOptions } from "../../../../lib/utils/dateFnc";
import LineChart from "@/components/ui/charts/line";
import Donut from "@/components/ui/charts/donutChart";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";
import SimpleStat from "@/components/ui/stats/cardsWidgets/simple";
import ProductCardWidget from "@/components/ui/stats/cardsWidgets/ProductCardWidget";
import { Button, Card, Typography } from "@material-tailwind/react";
import Loader from "@/components/ui/loader";
import { Customer } from "@/types/customer";
import { Transaction } from "@/types/transaction";
import Skeleton from "@/components/ui/skeleton";

interface AccountStatsProps {
  customer: Customer;
  transactions: Transaction[];
  isLoading: boolean;
}

interface IProductData {
  bonusId: string;
  bonusName: string;
  count: number;
  sum: number;
  price: number;
}

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

interface StatsSectionProps {
  selectedYear: number;
  clubAccountBalance: number;
  withdrawPrice: number;
  transactions: Transaction[];
  sumPointsInYear: (year: number) => number;
  sumTransactionPointsInQuarter: (year: number, quarter: number) => number;
}

interface ProductsSectionProps {
  chartData: {
    options: { labels: string[] };
    series: number[];
  };
  products: IProductData[];
}

export default function AccountStats({ customer, transactions, isLoading }: AccountStatsProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const clubAccountBalance = customer?.account?.lifetimePoints;

  // Helper functions
  const sumPointsInYear = (year: number): number => {
    if (!Array.isArray(transactions)) return 0;
    return transactions
      .filter(t => t.year === year && t.points > 0)
      .reduce((total, t) => total + t.points, 0);
  };

  const sumTransactionPointsInQuarter = (year: number, quarter: number): number => {
    if (!Array.isArray(transactions)) return 0;
    return transactions
      .filter(t => t.year === year && t.quarter === quarter && t.points > 0)
      .reduce((total, t) => total + t.points, 0);
  };

  const getSumOfTransactionsForChart = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { series: [{ name: "Body", data: [] }], categories: [] };
    }

    // Get min and max dates from transactions
    const dates = transactions.map(t => ({ year: t.year, quarter: t.quarter }));
    const startYear = Math.min(...dates.map(d => d.year));
    const endYear = Math.max(...dates.map(d => d.year));

    const quarterSums: { [key: string]: number } = {};

    // Populate sums
    transactions.forEach((t) => {
      const key = `${t.year}-Q${t.quarter}`;
      quarterSums[key] = (quarterSums[key] || 0) + t.points;
    });

    // Generate series data
    const categories: string[] = [];
    const data: number[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const key = `${year}-Q${quarter}`;
        categories.push(key);
        data.push(quarterSums[key] || 0);
      }
    }

    return {
      series: [{ name: "Body", data }],
      categories,
    };
  };

  const getMostFavouriteProducts = (): IProductData[] => {
    if (!Array.isArray(transactions)) return [];

    const productMap: { [key: string]: IProductData } = {};
    transactions
      .filter(t => t.points < 0 && t.bonus?.name)
      .forEach(t => {
        const bonusName = t.bonus?.name || 'Unknown Bonus';
        if (!productMap[bonusName]) {
          productMap[bonusName] = {
            bonusId: t.bonusId?.toString() || 'unknown',
            bonusName,
            count: 0,
            sum: 0,
            price: 0,
          };
        }
        productMap[bonusName].count++;
        productMap[bonusName].sum += Math.abs(t.points);
        productMap[bonusName].price += (t.bonusPrice || 0);
      });

    return Object.values(productMap);
  };

  // Calculate derived data
  const { series, categories } = getSumOfTransactionsForChart();
  const mostFavouriteProducts = getMostFavouriteProducts();
  const withdrawPrice = transactions
    .filter(t => t.points < 0)
    .reduce((sum, t) => sum + (t.bonusPrice || 0), 0);

  const chartData = {
    options: {
      labels: mostFavouriteProducts.map(p => p.bonusName)
    },
    series: mostFavouriteProducts.map(p => p.count)
  };

  if (!chartData || !mostFavouriteProducts || !transactions || !customer || isLoading) {
    return <Skeleton type="chart" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <ProductsSection
        chartData={chartData}
        products={mostFavouriteProducts}
      />

      <Card className="p-8 border rounded-sm">
        <div className="mb-4">
          <Typography variant="h5" className="mb-4 color-gray-900">
            {`Statistika bodů na účtu pro zákazníka - ${customer.fullName}`}
          </Typography>
          {transactions.length > 0 && (
            <LineChart
              title="Pohyby na účtě"
              description="Graf vývoje bodů za posledních 10 let"
              series={series}
              categories={categories}
            />
          )}
        </div>

        <div className="flex gap-4">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
          <StatsSection
            selectedYear={selectedYear}
            clubAccountBalance={clubAccountBalance}
            withdrawPrice={withdrawPrice}
            transactions={transactions}
            sumPointsInYear={sumPointsInYear}
            sumTransactionPointsInQuarter={sumTransactionPointsInQuarter}
          />
        </div>
      </Card>


    </div>
  );
}

const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => (
  <div className="flex flex-col justify-between p-4">
    <Button className="w-full" onClick={() => onYearChange(selectedYear + 1)}>+</Button>
    <SimpleSelectInput
      label="Vybrat Rok..."
      onChange={onYearChange}
      options={yearSelectOptions()}
      value={selectedYear || new Date().getFullYear()}
    />
    <Button className="w-full" onClick={() => onYearChange(selectedYear - 1)}>-</Button>
  </div>
);

const StatsSection: React.FC<StatsSectionProps> = ({
  selectedYear,
  clubAccountBalance,
  withdrawPrice,
  transactions,
  sumPointsInYear,
  sumTransactionPointsInQuarter
}) => (
  <div className="w-full">
    <div className="flex flex-row gap-4 mx-auto mb-4 justify-stretch">
      <SimpleStat title="Klubové konto" value={clubAccountBalance} units="b." />
      <SimpleStat title="Celkově vybráno bonusů za" value={withdrawPrice} units="Kč" />
      <SimpleStat
        title={`Roční konto: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`}
        value={sumPointsInYear(selectedYear)}
      />
    </div>
    <div className="flex flex-row gap-4 mx-auto justify-stretch">
      {[1, 2, 3, 4].map(quarter => (
        <KpiCard
          key={quarter}
          title={`Suma bodu za ${quarter}q ${selectedYear}`}
          percentage=""
          price={sumTransactionPointsInQuarter(selectedYear, quarter)}
          color=""
        />
      ))}
    </div>
  </div>
);

const ProductsSection: React.FC<ProductsSectionProps> = ({ chartData, products }) => (
  <Card className="p-8 border rounded-sm">
    <Typography variant="h5" className="mb-4 color-gray-900">
    Přehled výběru Prémium bonusů
    </Typography>
    <div className="flex justify-between w-full gap-4">
      <div className="w-1/2">
        <Donut data={chartData} />
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="w-full">
            <ProductCardWidget
              title={product.bonusName}
              points={product.sum}
              count={product.count}
              price={product.price}
              color="red"
            />
          </div>
        ))}
      </div>
    </div>
  </Card>
);


