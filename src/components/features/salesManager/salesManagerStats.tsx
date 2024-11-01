"use client";

import React from "react";
import { Suspense } from "react";
import Loader from "../../ui/loader";
import SimpleStat from "../../ui/stats/cardsWidgets/simple";
import SalesManagerStatsTable from "./salesManagerStatsTable";
import LineChart from "../../ui/charts/line";
import { Card, Typography } from "@material-tailwind/react";
import { yearSelectOptions } from "@/utils/dateFnc";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { set } from "react-hook-form";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";
import CustomersActiveWidget from "@/components/ui/stats/cardsWidgets/customersActiveWidget";
import NoData from "@/components/ui/noData";

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
  const [apiData, setApiData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [apiDataLastYear, setApiDataLastYear] = React.useState<any[]>([]);
  const salesManagerId = salesManager?.id;
  const [selectedYear, setSelectedYear] = React.useState(2023);
  const [chartSeries, setChartSeries] = React.useState<any[]>([
    {
      name: "Quarters",
      data: [50, 40, 300, 320],
    }
  ]);
  const [chartCategories, setChartCategories] = React.useState<any[]>(
    ["Q1", "Q2", "Q3", "Q4"]
  );


  const fetchApi = async (year: Number) => {
    setLoading(true);
    if (!salesManagerId || selectedYear === 0) {
      return;
    }

    // Make get request to API
    let url = `/api/sales-managers/transactions?id=${salesManagerId}&year=${year}`;
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

  const getApiData = async () => {
    setApiData([]);
    const data = await fetchApi(selectedYear);
    const dataLastYear = await fetchApi(selectedYear - 1);
    setApiData(data);
    setApiDataLastYear(dataLastYear);
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
  }, [apiData]);

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
    apiData.forEach((transaction) => {
      if (transaction.quarter === quarter) {

        // Sum only the positive amounts
        sum += transaction.amount > 0 ? transaction.amount : 0;
      }
    });
    return sum;
  }

  function calculateQuarterSums(data) {
    const result = {};
    data.forEach(entry => {
      const key = `${entry.customerID}_${entry.customerFullName}`;
      if (!result[key]) {
        result[key] = {
          // Spread the entry to the result
          ...entry,
          sumQ1: 0,
          sumQ2: 0,
          sumQ3: 0,
          sumQ4: 0
        };
      }
      switch (entry.quarter) {
        case 1:
          result[key].sumQ1 += entry.amount > 0 ? entry.amount : 0;
          break;
        case 2:
          result[key].sumQ2 += entry.amount > 0 ? entry.amount : 0;
          break;
        case 3:
          result[key].sumQ3 += entry.amount > 0 ? entry.amount : 0;
          break;
        case 4:
          result[key].sumQ4 += entry.amount > 0 ? entry.amount : 0;
          break;
        default:
          break;
      }
    });

    // Join the customerTotalPoints to the result baed on customerID and add totalPoints to the result
    Object.values(result).forEach((entry) => {
      const customer = customersTotalPoints.find((customer) => customer.id === entry.customerID);
      if (customer) {
        entry.totalPoints = customer.totalPoints;
      }
    });

    return Object.values(result);
  }


  if (!salesManager) {
    <Loader />;
  }

  return (
    <>
      <div className="flex w-full gap-4 mb-4">
        <div className="w-1/3">
          <Card className="shadow-md border p-4 border-gray-200 !rounded-lg grow">
            <Typography className="text-2xl font-bold text-gray-900" >{salesManager.fullName}</Typography>
            <Typography className="mb-2 font-light " >Statistika bodů pro obchodníka</Typography>
            <SimpleSelectInput
              label="Vybrat Rok..."
              onChange={(value) => setSelectedYear(value)}
              options={yearSelectOptions()}
              value={selectedYear} // Ensure the value is also passed to maintain the controlled state
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
          <LineChart series={chartSeries} categories={chartCategories} title="Počet bodů za čtvrtletí" description="Počet bodů za členy, podle čtvrtletí pro obchodníka " />
        </div>


      </div>

      {loading ? (
        <Loader />
      ) : (
        apiData.length > 0 ? (
          <SalesManagerStatsTable detailLinkPath={"users/"} defaultData={calculateQuarterSums(apiData)} />
        ) : (
          <NoData />
        )
      )}
    </>
  );
}
