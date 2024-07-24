"use client";


import React, { use, useEffect, useState } from "react";
import SimpleTable from "../../tables/simpleTable";
import TransactionComponent from "../transaction";
import InputField from "../../ui/inputs/basicInput";
import SelectField from "../../ui/inputs/selectInput";
import Button from "../../ui/button";
import SimpleStat from "../../ui/stats/simple";
import InputDateFiled from "../../ui/inputs/dateInput";
import TransactionsTable from "../../tables/transactionsTable";
import { set } from "react-hook-form";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { IAccount, ICustomer, ITransaction } from "../../../interfaces/interfaces";
import { yearSelectOptions } from "../../../utils/dateFnc";
import { sumPosPointsInTransactions } from "@/utils/functions";
import { KpiCard } from "@/components/ui/stats/KpiCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LineChart from "@/components/ui/charts/line";
import Donut from "@/components/ui/charts/donutChart";
import DonutChart from "@/components/ui/charts/donutChart";

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


  const getTransactions = async () => {
    alert("Transactions fetched");
  }


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

  const { series, categories } = getSumOfTransactionsForChart(transactions, "2014-01", "2024-04");


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

        <div className="flex flex-row justify-stretch mx-auto">
          <KpiCard title="Bodový stav na konci roku" percentage={""} price={clubAccountBalance} color={""} />
          <KpiCard title={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`} percentage={""} price={sumPointsInYear(transactions, selectedYear)} color={""} />
          <KpiCard title="Průměr bodů získaných za poslední 4 roky" percentage={""} price={fourYearAverage(transactions, selectedYear)} color={""} />
        </div>
      </div>


      <div className="border bg-zinc-50 p-4">
        <h2>Nejoblíbenější produkt</h2>
        <div className="flex justify-between w-full gap-4">
          <div className="w-1/2">
            <Donut data={chartData} />
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


      {/* <div className="justify-between border bg-zinc-50 p-4">
        <div>
          <SimpleTable data={transactionsInYear(transactions, selectedYear)} />
          <p>Total points {sumPointsInYear(transactions, selectedYear)}</p>
        </div>
      </div> */}

    </div>
  );
}


