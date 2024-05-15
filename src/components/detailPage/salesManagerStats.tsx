"use client";

import React from "react";
import { Suspense } from "react";
import Loader from "../ui/loader";
import SimpleStat from "../ui/stats/simple";
import SimpleTable from "../tables/simpleTable";
import SalesManagerStatsTable from "../tables/salesManagerStatsTable";

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
  const salesManagerId = salesManager?.id;
  const [selectedYear, setSelectedYear] = React.useState(2023);

  const getApiData = async () => {
    if (!salesManagerId || selectedYear === 0) {
      return;
    }

    // Make get request to API
    let url = `/api/sales-managers?id=${salesManagerId}&year=${selectedYear}`;
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, header);
    const data = await response.json();
    setApiData(data);
  };

  React.useEffect(() => {
    getApiData();
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

  // Sum API data.amount for average points for selected year
  const yearAverage = () => {
    let sum = 0;
    let count = 0;
    apiData.forEach((transaction) => {
      if (transaction.year === selectedYear) {
        // Sum only the positive amounts
        if (transaction.amount > 0) {
          sum += transaction.amount;
        }
      }
    }
    );
    return sum / 4;
  }

  function calculateQuarterSums(data) {
    const result = {};
    data.forEach(entry => {
      const key = `${entry.customerID}_${entry.customerFullName}`;
      if (!result[key]) {
        result[key] = {
          customerID: entry.customerID,
          customerFullName: entry.customerFullName,
          registrationNumber: entry.registrationNumber,
          dealerName: entry.dealerName,
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
    <div className="content-container ">
      <div className="flex flex-row justify-center gap-4 mx-auto w-full">
        <SimpleStat label="Celkem za členy v Q1" value={quarterSum(1)} />
        <SimpleStat label="Celkem za členy v Q2" value={quarterSum(2)} />
        <SimpleStat label="Celkem za členy v Q3" value={quarterSum(3)} />
        <SimpleStat label="Celkem za členy v Q4" value={quarterSum(4)} />
        <SimpleStat label="Celkem za rok" value={quarterSum(1) + quarterSum(2) + quarterSum(3) + quarterSum(4)} />
      </div>
      <div className="mx-auto w-full my-4">
        <p>Klubové konto: {totalPoints}</p>
        <p>Průměr za kvartál: {yearAverage()}</p>
        <p>Počet zákazníků {numOfCusomers}</p>
        <p>Počet aktivních zákazníků {numOfActiveCusomers}</p>
      </div>
      <div>
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          <option value={0}>Select Year</option>
          <option value={2021}>2021</option>
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
        </select>
      </div>

        {apiData.length > 0 ? <SalesManagerStatsTable detailLinkPath={"users/"} defaultData={calculateQuarterSums(apiData) } /> : <Loader />}
 
    </div>
  );
}
