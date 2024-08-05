"use client";;
import React, { Suspense, useEffect, useState } from "react";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { IAccount, ICustomer, ITransaction } from "../../../interfaces/interfaces";
import { yearSelectOptions } from "../../../utils/dateFnc";
import { sumPosPointsInTransactions } from "@/utils/functions";
import { KpiCard } from "@/components/ui/stats/KpiCard";
import LineChart from "@/components/ui/charts/line";
import Donut from "@/components/ui/charts/donutChart";

type Props = {
  customer: ICustomer;
  account: IAccount;
  transactions: any[];
};

interface IProductData {
  bonusId: string;
  bonusName: string;
  count: number;
  sum: number;
}


export default function AccountStats({ customer, account, transactions }: Props) {
  const [selectedYear, setSelectedYear] = React.useState(2024);
  const clubAccountBalance = sumPosPointsInTransactions(transactions);

  // Date for the year balance calculation
  const [yearBalanceDate, setYearBalanceDate] = useState(new Date("2024-01-01"));
  const [yearBalance, setYearBalance] = useState(0);


  useEffect(() => {
    setYearBalance(sumNextTwoYears(yearBalanceDate, transactions));
  }
    , [yearBalanceDate, transactions]);





  const sumPointsInYear = (
    transactions: ITransaction[],
    year: number
  ): number => {
    // Use filter to get transactions for the specified year with positive amounts
    const validTransactions = transactions.filter((transaction) => {
      return transaction.year === year && transaction.amount > 0;
    });

    // Use reduce to sum the points from valid transactions
    const sum = validTransactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

    return sum;
  };

  const fourYearAverage = (
    transactions: ITransaction[],
    year: number
  ): number => {
    // Filter transactions for the specified year and the previous three years
    const relevantTransactions = transactions.filter((transaction) => {
      return (
        transaction.year >= year - 3 &&
        transaction.year <= year &&
        transaction.amount > 0
      );
    });

    // Group transactions by year and sum the points for each year
    const sumsByYear: { [key: number]: number } = {};
    relevantTransactions.forEach((transaction) => {
      sumsByYear[transaction.year] =
        (sumsByYear[transaction.year] || 0) + transaction.amount;
    });

    // Calculate the average sum of points for the relevant years
    const relevantYears = Object.keys(sumsByYear).map(Number);
    const sum = relevantYears.reduce((total, y) => total + sumsByYear[y], 0);
    const average = sum / relevantYears.length;

    // Round the average to two decimal places
    return Math.round(average * 100) / 100;
  };


  function sumNextTwoYears(startingDate: Date, data: any): number {
    // Extract the starting year from the starting date
    const startingYear = startingDate.getFullYear();

    // Get the quarters for the starting year and the next year
    const quartersToSum: number[] = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 1; j <= 4; j++) {
        quartersToSum.push(j + i * 4);
      }
    }

    // Filter the data to include only the relevant quarters for the next two years
    const relevantData = data.filter(point => {
      return (point.year === startingYear || point.year === startingYear + 1) &&
        quartersToSum.includes(point.quarter);
    });

    // Sum up the amounts of the relevant data points
    const sum = relevantData.reduce((acc, point) => acc + point.amount, 0);

    return sum;
  }


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

  // TODO: Make that to accept dynamic date range
  const { series, categories } = getSumOfTransactionsForChart(transactions, "2014-01", "2024-04");



  // Sum of points for the selected year and quarter for the account
  const sumTransactionPointsInQuarter = (transactions: ITransaction[], year: number, quarter: number): number => {
    // Filter transactions for the specified year and quarter with positive amounts
    const validTransactions = transactions.filter((transaction) => {
      return transaction.year === year && transaction.quarter === quarter && transaction.amount > 0;
    });

    // Use reduce to sum the points from valid transactions
    const sum = validTransactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

    return sum;
  }






  // TODO: Implement as fucntion which groups transactions on category and sums the points
  // Find the most favourite product for the customer based on transactions with negative amounts and return all products with count of transactions and sum of points
  const mostFavouriteProduct = (transactions: ITransaction[]): IProductData[] => {
    // Filter transactions with negative amount
    const negativeTransactions = transactions.filter(transaction => transaction.amount < 0);

    // Accumulate product data
    const productDataMap: { [key: string]: IProductData } = {};
    negativeTransactions.forEach(transaction => {
      const { bonusName, amount } = transaction;

      // Use the bonusName as a key for now since bonusId is not available
      if (!productDataMap[bonusName]) {
        productDataMap[bonusName] = {
          bonusId: 'placeholder-id', // Placeholder for the bonusId
          bonusName,
          count: 0,
          sum: 0
        };
      }

      productDataMap[bonusName].count += 1;
      productDataMap[bonusName].sum += amount;
    });

    // Convert the product data map to an array
    const productDataArray: IProductData[] = Object.values(productDataMap);

    // Sort the products by count of transactions
    productDataArray.sort((a, b) => b.count - a.count);

    return productDataArray;
  }

  // Find most favourite product for the customer based on the transactions with negative amount and return the all products with count of transactions
  const mostFavouriteProductValue = mostFavouriteProduct(transactions);


  // TODO: Make that function more universal and use it for the line chart as well
  // Function to convert productDataArray to chart data
  const convertToChartData = (productDataArray: IProductData[]) => {
    const labels = productDataArray.map(product => product.bonusName);
    const series = productDataArray.map(product => product.count);

    return {
      options: {
        labels
      },
      series
    };
  };

  const chartData = convertToChartData(mostFavouriteProductValue);

  if (!chartData || !mostFavouriteProductValue) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex flex-col gap-10">
      {/* <TransactionComponent account={account} onTransactionCreated={getTransactions} /> */}
      <div className="border p-4 bg-zinc-50">
        <h2>Statistika bodů na účtu s id: {account.id} pro zákazníka - {customer.fullName}</h2>
        {transactions.length > 0 && (

          <LineChart
            title="Vývoj bodů za posledních 10 let"
            description="Graf vývoje bodů za poslední 10 let"
            series={series}
            categories={categories}
          />
        )}
        <div className="mt-6">
          <SimpleSelectInput
            label="Vybrat Rok..."
            onChange={(value) => setSelectedYear(value)}
            options={yearSelectOptions()}
            value={selectedYear} // Ensure the value is also passed to maintain the controlled state
          />

        </div>

        <div className="flex flex-row justify-stretch mx-auto gap-4 mb-4">
          <KpiCard title="Bodový stav na konci roku" percentage={""} price={clubAccountBalance} color={""} />
          <KpiCard title={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`} percentage={""} price={sumPointsInYear(transactions, selectedYear)} color={""} />
          <KpiCard title="Průměr bodů získaných za poslední 4 roky" percentage={""} price={fourYearAverage(transactions, selectedYear)} color={""} />
        </div>
        <div className="flex flex-row justify-stretch mx-auto gap-4">
          <KpiCard title={`Suma bodu za 1q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 1)} color={""} />
          <KpiCard title={`Suma bodu za 2q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 2)} color={""} />
          <KpiCard title={`Suma bodu za 3q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 3)} color={""} />
          <KpiCard title={`Suma bodu za 4q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 4)} color={""} />
        </div>
      </div>


      <div className="border bg-zinc-50 p-4">
        <h2>Nejoblíbenější produkt</h2>
        <div className="flex justify-between w-full gap-4">
          <div className="w-1/2">
            {chartData && (
              <Suspense fallback={<div>Loading...</div>}>
                <Donut data={chartData}
                />  </Suspense>
            )
            }
          </div>
          <div className="grid grid-cols-3 w-full gap-4">
            {Object.keys(mostFavouriteProductValue).map((key) => {
              return (
                <div key={key} className="w-full">
                  <KpiCard title={mostFavouriteProductValue[key].bonusName} percentage={` ${mostFavouriteProductValue[key].sum} bodů`} price={`${mostFavouriteProductValue[key].count}x`} color="red" />
                </div>
              );
            }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


