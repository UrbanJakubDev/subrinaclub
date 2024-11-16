"use client";
import React, { Suspense, use, useEffect, useState } from "react";
import SimpleSelectInput from "../../../ui/inputs/simpleSelectInput";
import { yearSelectOptions } from "../../../../lib/utils/dateFnc";
import { sumPosPointsInTransactions } from "@/lib/utils/functions";
import LineChart from "@/components/ui/charts/line";
import Donut from "@/components/ui/charts/donutChart";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";
import SimpleStat from "@/components/ui/stats/cardsWidgets/simple";
import ProductCardWidget from "@/components/ui/stats/cardsWidgets/ProductCardWidget";
import { Button, Card, Typography } from "@material-tailwind/react";
import Loader from "@/components/ui/loader";
import { useModal } from "@/contexts/ModalContext";
import { useStatsStore } from "@/stores/CustomerStatsStore";


interface ITransaction {
  points: number;
  bonusName: string;
  bonuspoints: number;
}

interface IProductData {
  bonusId: string;
  bonusName: string;
  count: number;
  sum: number;
  price: number;
}


export default function AccountStats() {

  const customer = useStatsStore(state => state.customer);
  const transactions = useStatsStore(state => state.transactions);

  // State for the selected year
  const [selectedYear, setSelectedYear] = React.useState(2024);
  const clubAccountBalance = customer?.account?.lifetimePoints;

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
    if (!Array.isArray(transactions)) return 0;
    
    const validTransactions = transactions.filter((transaction) => {
      return transaction.year === year && transaction.points > 0;
    });

    return validTransactions.reduce((total, transaction) => {
      return total + transaction.points;
    }, 0);
  };

  function sumNextTwoYears(startingDate: Date, data: any): number {
    // Early return if data is not an array
    if (!Array.isArray(data)) return 0;

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

    // Sum up the points of the relevant data points
    const sum = relevantData.reduce((acc, point) => acc + point.points, 0);

    return sum;
  }


  const getSumOfTransactionsForChart = (transactions: any, startDate: String, endDate: String) => {
    // Early return if transactions is not an array
    if (!Array.isArray(transactions)) {
      return {
        series: [{ name: "Body", data: [] }],
        categories: [],
      };
    }

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
      quarterSums[key] += transaction.points;
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
    if (!Array.isArray(transactions)) return 0;

    const validTransactions = transactions.filter((transaction) => {
      return transaction.year === year && transaction.quarter === quarter && transaction.points > 0;
    });

    return validTransactions.reduce((total, transaction) => {
      return total + transaction.points;
    }, 0);
  }




  // Function to find the most favorite product based on transactions with negative pointss
  const mostFavouriteProduct = (transactions: ITransaction[]): IProductData[] => {
    if (!Array.isArray(transactions)) return [];

    const negativeTransactions = transactions.filter(transaction => transaction.points < 0);

    const productDataMap: { [key: string]: IProductData } = {};
    negativeTransactions.forEach(transaction => {
      const { bonusName, points, bonuspoints } = transaction;

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
      productDataMap[bonusName].sum += Math.abs(points); // Sum points spent
      productDataMap[bonusName].price += (bonuspoints ?? 0); // Sum money spent
    });

    return Object.values(productDataMap);
  }

  // Find most favourite product for the customer based on the transactions with negative points and return the all products with count of transactions
  const mostFavouriteProductValue = mostFavouriteProduct(transactions);


  // Sum all bonuspointss in transactions with type "withdraw"
  const sumWithdrawnPrice = (transactions: ITransaction[]): number => {
    if (!Array.isArray(transactions)) return 0;

    const negativeTransactions = transactions.filter(transaction => transaction.points < 0);

    // Sum the bonuspointss
    const sum = negativeTransactions.reduce((total, transaction) => {
      return total + (transaction.bonuspoints ?? 0);
    }, 0);

    return sum;
  }

  const withdrawPrice = sumWithdrawnPrice(transactions);


  // TODO: Make that function more universal and use it for the line chart as well
  // Function to convert productDataArray to chart data
  const convertToChartData = (productDataArray: IProductData[]) => {
    const labels = productDataArray.map(product =>
      product.bonusName === undefined ? "Chybí název Bonusu" : product.bonusName
    );
    const series = productDataArray.map(product => product.count);

    return {
      options: {
        labels
      },
      series
    };
  };

  const chartData = convertToChartData(mostFavouriteProductValue);

  if (!chartData || !mostFavouriteProductValue || !transactions || !customer) {
    return <Loader />;
  }


  return (
    <div className="flex flex-col gap-10">
      <Card className="p-8 border rounded-sm">
        <span>Component AccountStats</span>
        <div className="mb-4">
          <Typography
            variant="h5"
            className="mb-4 color-gray-900 "
          >{`Statistika bodů na účtu s id:  pro zákazníka - ${customer.fullName}`}</Typography>
          {transactions?.length > 0 && (
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
          <div className="flex flex-col justify-between p-4">
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


      <Card className="p-8 border rounded-sm">
        <Typography
          variant="h5"
          className="mb-4 color-gray-900"
        >Nejoblíbenější produkty</Typography>
        <div className="flex justify-between w-full gap-4">
          <div className="w-1/2">
            {chartData && (<Donut data={chartData}/>)}
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


