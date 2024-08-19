"use client";
import React, { Suspense, useEffect, useState } from "react";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { IAccount, ICustomer } from "../../../interfaces/interfaces";
import { yearSelectOptions } from "../../../utils/dateFnc";
import { sumPosPointsInTransactions } from "@/utils/functions";
import LineChart from "@/components/ui/charts/line";
import Donut from "@/components/ui/charts/donutChart";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";
import SimpleStat from "@/components/ui/stats/cardsWidgets/simple";
import ProductCardWidget from "@/components/ui/stats/cardsWidgets/ProductCardWidget";
import { Button, Card, Typography } from "@material-tailwind/react";
import Loader from "@/components/ui/loader";

type Props = {
  customer: ICustomer;
  account: IAccount;
  transactions: any[];
};

interface ITransaction {
  amount: number;
  bonusName: string;
  bonusAmount: number;
}

interface IProductData {
  bonusId: string;
  bonusName: string;
  count: number;
  sum: number;
  price: number;
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




  // Function to find the most favorite product based on transactions with negative amounts
  const mostFavouriteProduct = (transactions: ITransaction[]): IProductData[] => {
    // Filter transactions with negative amount
    const negativeTransactions = transactions.filter(transaction => transaction.amount < 0);

    // Accumulate product data
    const productDataMap: { [key: string]: IProductData } = {};
    negativeTransactions.forEach(transaction => {
      const { bonusName, amount, bonusAmount } = transaction;

      // Use the bonusName as a key for now since bonusId is not available
      if (!productDataMap[bonusName]) {
        productDataMap[bonusName] = {
          bonusId: 'placeholder-id', // Placeholder for the bonusId
          bonusName,
          count: 0,
          sum: 0,
          price: 0,
        };
      }

      productDataMap[bonusName].count += 1;
      productDataMap[bonusName].sum += Math.abs(amount); // Sum points spent
      productDataMap[bonusName].price += (bonusAmount ?? 0); // Sum money spent
    });

    // Convert the product data map to an array
    const productDataArray: IProductData[] = Object.values(productDataMap);

    // Sort the products by count of transactions
    productDataArray.sort((a, b) => b.count - a.count);

    return productDataArray;
  }

  // Find most favourite product for the customer based on the transactions with negative amount and return the all products with count of transactions
  const mostFavouriteProductValue = mostFavouriteProduct(transactions);


  // Sum all bonusAmounts in transactions with type "withdraw"
  const sumWithdrawnPrice = (transactions: ITransaction[]): number => {
    // Filter transactions with negative amount
    const negativeTransactions = transactions.filter(transaction => transaction.amount < 0);

    // Sum the bonusAmounts
    const sum = negativeTransactions.reduce((total, transaction) => {
      return total + (transaction.bonusAmount ?? 0);
    }, 0);

    return sum;
  }

  const withdrawPrice = sumWithdrawnPrice(transactions);


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
    return <Loader />;
  }


  return (
    <div className="flex flex-col gap-10">
      <Card className="p-4 bg-gray-100 border">
        <div className="mb-4">
          <Typography
            variant="h5"
            className="mb-4 color-gray-900 "
            children={`Statistika bodů na účtu s id: ${account.id} pro zákazníka - ${customer.fullName}`}
          />
          {transactions.length > 0 && (
            <LineChart
              title="Vývoj bodů na Klubovém kontu"
              description="Graf vývoje bodů za posledních 10 let"
              series={series}
              categories={categories}
            />
          )}
        </div>
        <div className="flex gap-4">

          {/* TODO: Rework as Component  */}
          <div className="flex flex-col justify-between">
            <Button className="w-full" onClick={() => setSelectedYear(selectedYear + 1)}>+</Button>
            <SimpleSelectInput
              label="Vybrat Rok..."
              onChange={(value) => setSelectedYear(value)}
              options={yearSelectOptions()}
              value={selectedYear} // Ensure the value is also passed to maintain the controlled state
            />
            <Button className="w-full" onClick={() => setSelectedYear(selectedYear - 1)}>-</Button>
          </div>
          <div className="w-full">
            <div className="flex flex-row gap-4 mx-auto mb-4 justify-stretch">
              <SimpleStat title="Bodový stav na konci roku" value={clubAccountBalance} units="b." />
              <SimpleStat title="Celkově vybráno bonusů za" value={withdrawPrice} units="Kč" />
              <SimpleStat title={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`} value={sumPointsInYear(transactions, selectedYear)} />
            </div>
            <div className="flex flex-row gap-4 mx-auto justify-stretch">
              <KpiCard title={`Suma bodu za 1q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 1)} color={""} />
              <KpiCard title={`Suma bodu za 2q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 2)} color={""} />
              <KpiCard title={`Suma bodu za 3q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 3)} color={""} />
              <KpiCard title={`Suma bodu za 4q ${selectedYear}`} percentage={""} price={sumTransactionPointsInQuarter(transactions, selectedYear, 4)} color={""} />
            </div>
          </div>
        </div>
      </Card>


      <Card className="p-4 bg-gray-100 border">
        <Typography
          variant="h5"
          className="mb-4 color-gray-900"
          children="Nejoblíbenější produkty"
        />
        <div className="flex justify-between w-full gap-4">
          <div className="w-1/2">
            {chartData && (

              <Donut data={chartData}
              />
            )
            }
          </div>
          <div className="grid w-full grid-cols-3 gap-4">
            {Object.keys(mostFavouriteProductValue).map((key) => {
              return (
                <div key={key} className="w-full">
                  <ProductCardWidget
                    title={mostFavouriteProductValue[key].bonusName}
                    points={mostFavouriteProductValue[key].sum.toString()}
                    count={`${mostFavouriteProductValue[key].count}`}
                    price={`${mostFavouriteProductValue[key].price}`}
                    color="red" />
                </div>
              );
            }
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}


