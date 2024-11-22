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

export default function AccountStats({ customer, transactions, isLoading }: AccountStatsProps) {
  const [selectedYear, setSelectedYear] = useState(2024);
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

  const getSumOfTransactionsForChart = (startDate: string, endDate: string) => {
    if (!Array.isArray(transactions)) {
      return { series: [{ name: "Body", data: [] }], categories: [] };
    }

    const [startYear, startQuarter] = startDate.split("-");
    const [endYear, endQuarter] = endDate.split("-");
    const quarterSums: { [key: string]: number } = {};

    // Populate sums
    transactions.forEach((t) => {
      const key = `${t.year}-Q${t.quarter}`;
      quarterSums[key] = (quarterSums[key] || 0) + t.points;
    });

    // Generate series data
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

      currentQuarter++;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear++;
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
      .filter(t => t.points < 0)
      .forEach(t => {
        if (!productMap[t.bonusName]) {
          productMap[t.bonusName] = {
            bonusId: 'placeholder-id',
            bonusName: t.bonusName,
            count: 0,
            sum: 0,
            price: 0,
          };
        }
        productMap[t.bonusName].count++;
        productMap[t.bonusName].sum += Math.abs(t.points);
        productMap[t.bonusName].price += (t.bonuspoints ?? 0);
      });

    return Object.values(productMap);
  };

  // Calculate derived data
  const { series, categories } = getSumOfTransactionsForChart("2014-01", "2024-04");
  const mostFavouriteProducts = getMostFavouriteProducts();
  const withdrawPrice = transactions
    .filter(t => t.points < 0)
    .reduce((sum, t) => sum + (t.bonuspoints ?? 0), 0);

  const chartData = {
    options: {
      labels: mostFavouriteProducts.map(p => p.bonusName || "Chybí název Bonusu")
    },
    series: mostFavouriteProducts.map(p => p.count)
  };

  if (!chartData || !mostFavouriteProducts || !transactions || !customer || isLoading) {
    return <Skeleton type="chart" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <Card className="p-8 border rounded-sm">
        <div className="mb-4">
          <Typography variant="h5" className="mb-4 color-gray-900">
            {`Statistika bodů na účtu pro zákazníka - ${customer.fullName}`}
          </Typography>
          {transactions.length > 0 && (
            <LineChart
              title="Vývoj bodů na Klubovém kontu"
              description="Graf vývoje bodů za posledních 10 let"
              series={series}
              categories={categories}
            />
          )}
        </div>

        {/* Year selector and stats section */}
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

      {/* Products section */}
      <ProductsSection 
        chartData={chartData}
        products={mostFavouriteProducts}
      />
    </div>
  );
}

// Sub-components (can be moved to separate files if needed)
const YearSelector = ({ selectedYear, onYearChange }) => (
  <div className="flex flex-col justify-between p-4">
    <Button className="w-full" onClick={() => onYearChange(selectedYear + 1)}>+</Button>
    <SimpleSelectInput
      label="Vybrat Rok..."
      onChange={onYearChange}
      options={yearSelectOptions().map(option => ({
        id: option.value,
        name: option.label
      }))}
      value={selectedYear}
    />
    <Button className="w-full" onClick={() => onYearChange(selectedYear - 1)}>-</Button>
  </div>
);

const StatsSection = ({ selectedYear, clubAccountBalance, withdrawPrice, transactions, sumPointsInYear, sumTransactionPointsInQuarter }) => (
  <div className="w-full">
    <div className="flex flex-row gap-4 mx-auto mb-4 justify-stretch">
      <SimpleStat title="Bodový stav na konci roku" value={clubAccountBalance} units="b." />
      <SimpleStat title="Celkově vybráno bonusů za" value={withdrawPrice} units="Kč" />
      <SimpleStat 
        title={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`} 
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

const ProductsSection = ({ chartData, products }) => (
  <Card className="p-8 border rounded-sm">
    <Typography variant="h5" className="mb-4 color-gray-900">
      Nejoblíbenější produkty
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
              points={product.sum.toString()}
              count={`${product.count}`}
              price={`${product.price}`}
              color="red"
            />
          </div>
        ))}
      </div>
    </div>
  </Card>
);


