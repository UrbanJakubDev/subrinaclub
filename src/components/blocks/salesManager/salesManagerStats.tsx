"use client";

import React from "react";
import { Suspense } from "react";
import Loader from "../../ui/loader";
import SimpleStat from "../../ui/stats/cardsWidgets/simple";
import SalesManagerStatsTable from "../../tables/salesManagerStatsTable";
import LineChart from "../../ui/charts/line";
import { Typography } from "@material-tailwind/react";
import { yearSelectOptions } from "@/utils/dateFnc";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { set } from "react-hook-form";
import KpiCard from "@/components/ui/stats/cardsWidgets/KpiCard";

type SalesManagerStatsProps = {
  salesManager?: any;
  totalPoints?: any;
  numOfCusomers?: any;
  numOfActiveCusomers?: any;
  customersTotalPoints?: any;
};

export default function SalesManagerStats({
  salesManager,
  totalPoints,
  numOfCusomers,
  numOfActiveCusomers,
  customersTotalPoints,
}: SalesManagerStatsProps) {
  const [apiData, setApiData] = React.useState<any[]>([]);
  const [apiDataLastYear, setApiDataLastYear] = React.useState<any[]>([]);
  const [yearAverage, setYearAverage] = React.useState(0);
  const [yearAverageLastYear, setYearAverageLastYear] = React.useState(0);
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
      <div className="w-full flex gap-4 mb-4">
        <div className="w-1/3">
          <Typography className="text-2xl font-bold" >{salesManager.fullName}</Typography>
          <Typography className=" mb-2 font-light" >Statistika bodů pro obchodníka</Typography>
          <SimpleSelectInput
            label="Vybrat Rok..."
            onChange={(value) => setSelectedYear(value)}
            options={yearSelectOptions()}
            value={selectedYear} // Ensure the value is also passed to maintain the controlled state
          />

          <div className="flex flex-col mx-auto w-full my-4 gap-2">
            <SimpleStat title="Klubové konto" value={totalPoints} />
            <KpiCard title="Počet zákazníků" price={numOfCusomers} percentage={numOfActiveCusomers - 50} color="green" icon="Aktivní" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 mx-auto w-2/3">
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

      {apiData.length > 0 ? <SalesManagerStatsTable detailLinkPath={"users/"} defaultData={calculateQuarterSums(apiData)} /> : <Loader />}
      <pre>
        {JSON.stringify(apiData, null, 2)}
      </pre>
    </>
  );
}
