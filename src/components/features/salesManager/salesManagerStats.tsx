"use client";

import React from "react";
import { Suspense } from "react";
import Loader from "../../ui/loader";
import SimpleStat from "../../ui/stats/cardsWidgets/simple";
import SalesManagerStatsTable from "./salesManagerStatsTable";
import LineChart from "../../ui/charts/line";
import { Card, Typography } from "@material-tailwind/react";
import { yearSelectOptions } from "@/lib/utils/dateFnc";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { set } from "react-hook-form";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";
import CustomersActiveWidget from "@/components/ui/stats/cardsWidgets/customersActiveWidget";
import NoData from "@/components/ui/noData";
import Skeleton from "@/components/ui/skeleton";
import SelectField from "@/components/ui/inputs/selectInput";

type SalesManagerStatsProps = {
  salesManager?: any;
  totalPoints?: any;
  numOfCusomers?: any;
  numOfActiveCusomers?: any;
  numOfSystemActiveCusomers?: any;
  customersTotalPoints?: any;
};

export default function SalesManagerStats({
  salesManager,
  totalPoints,
  numOfCusomers,
  numOfActiveCusomers,
  numOfSystemActiveCusomers,
  customersTotalPoints,
}: SalesManagerStatsProps) {

  const salesManagerId = salesManager?.id;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [apiData, setApiData] = React.useState<any[]>([]);
  const [selectedYear, setSelectedYear] = React.useState(2024);
  const yearDial = yearSelectOptions();
  const [chartSeries, setChartSeries] = React.useState<any[]>([
    {
      name: "Quarters",
      data: [50, 40, 300, 320],
    }
  ]);
  const [chartCategories, setChartCategories] = React.useState<any[]>(
    ["Q1", "Q2", "Q3", "Q4"]
  );


  // Transaction part
  const [transactionData, setTransactionData] = React.useState<any[]>([]);
  // Fetch transactions for the selected year and sales manager 
  const fetchTransactions = async (year: Number) => {
    setLoading(true);
    if (!salesManagerId || selectedYear === 0) {
      return;
    }

    // Make get request to API
    let url = `/api/transactions/salesManager?salesManagerId=${salesManagerId}&year=${year}`;
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, header);
    const data = await response.json();

    setLoading(false);
    return data;
  };


  // Customers part
  const [customersData, setCustomersData] = React.useState<any[]>([]);

  // Fetch customers with accounts data for the sales manager
  const fetchCustomers = async () => {
    if (!salesManagerId) {
      return;
    }

    // Make get request to API
    let url = `/api/customers?salesManagerId=${salesManagerId}`;
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, header);
    const data = await response.json();

    return data;
  };


  const getApiData = async () => {
    setTransactionData([]);
    setCustomersData([]);
    const data = await fetchTransactions(selectedYear);
    const customers = await fetchCustomers();
    setTransactionData(data);
    setCustomersData(customers);
    setApiData(joinData(customers, data));
  };


  // Spread the apiData quarter sums to the chartSeries
  const updateChartSeries = () => {
    const series = [
      {
        name: "Quarters",
        data: [quarterSum(1), quarterSum(2), quarterSum(3), quarterSum(4)],
      }
    ];
    setChartSeries(series);
  }


  React.useEffect(() => {
    updateChartSeries();
  }, [transactionData]);

  React.useEffect(() => {
    console.log("Selected year changed to: ", selectedYear);

    const refetchData = async () => {
      await getApiData();
    }
    refetchData();

  }, [selectedYear]);



  // Sum API data.amount for each quarter and display in table
  // Note: This is just a mockup, the actual data will be different
  const quarterSum = (quarter: number) => {
    let sum = 0;
    transactionData.forEach((transaction) => {
      if (transaction.quarter === quarter) {

        // Sum only the positive amounts
        sum += transaction.points > 0 ? transaction.points : 0;
      }
    });
    return sum;
  }


  // Function to sum points for a given quarter
  const sumQuarterPoints = (transactions, quarter) => {
    return transactions
      .filter(transaction => transaction.quarter === quarter)
      .reduce((sum, transaction) => sum + transaction.points, 0);
  };

  // Function to join the customer and transaction data
  const joinData = (customers, transactions) => {
    const joinedData = customers.map((customer) => {
      const customerTransactions = transactions.filter(
        (transaction) => transaction.accountId === customer.account.id
      );

      return {
        ...customer,
        transactions: customerTransactions,
        quarterSums: {
          Q1: sumQuarterPoints(customerTransactions, 1),
          Q2: sumQuarterPoints(customerTransactions, 2),
          Q3: sumQuarterPoints(customerTransactions, 3),
          Q4: sumQuarterPoints(customerTransactions, 4),
        },
      };
    });

    return joinedData;
  };


  return (
    <>
      <div className="flex w-full gap-4 mb-4">
        <div className="w-1/3">
          <Card className="shadow-md border p-4 border-gray-200 !rounded-lg grow">
            <Typography className="text-2xl font-bold text-gray-900" >{salesManager.fullName}</Typography>
            <Typography className="mb-2 font-light " >Statistika bodů pro obchodníka</Typography>
            <SimpleSelectInput
              label="Rok"
              options={yearDial as any}
              onChange={(value) => setSelectedYear(value)}
              value={selectedYear}

            />
          </Card>

          <div className="flex flex-col w-full gap-2 mx-auto my-4">
            <SimpleStat title="Klubové konto" value={totalPoints} />
            <CustomersActiveWidget
              title="Aktivní zákazníci"
              allCustomers={numOfCusomers}
              systemActiveCustomers={numOfSystemActiveCusomers}
              activeCustomers={numOfActiveCusomers} />
          </div>
        </div>

        <div className="flex flex-col justify-center w-2/3 h-full gap-4 mx-auto">
          <div className="flex justify-between gap-2">
            <SimpleStat title="Celkem za členy v Q1" value={quarterSum(1)} />
            <SimpleStat title="Celkem za členy v Q2" value={quarterSum(2)} />
            <SimpleStat title="Celkem za členy v Q3" value={quarterSum(3)} />
            <SimpleStat title="Celkem za členy v Q4" value={quarterSum(4)} />
            <SimpleStat title="Celkem za rok" value={quarterSum(1) + quarterSum(2) + quarterSum(3) + quarterSum(4)} />
          </div>
          <Card>
            <LineChart series={chartSeries} categories={chartCategories} title="Počet bodů za čtvrtletí" description="Počet bodů za členy, podle čtvrtletí pro obchodníka " />
          </Card>
        </div>


      </div>


      {loading ? (
        <Skeleton type="table" />
      ) : (
        apiData.length > 0 ? (
          <SalesManagerStatsTable detailLinkPath={"customers/"} defaultData={apiData} />
        ) : (
          <NoData />
        )
      )}

      <pre>
        {JSON.stringify(apiData, null, 2)}
      </pre>
    </>
  );
}
