"use client";

import React from "react";
import { Suspense } from "react";
import Loader from "../ui/loader";

type SalesManagerStatsProps = {
  salesManager?: any;
  customers?: any[];
  salesTransactions?: any[];
};

export default function SalesManagerStats({
  salesManager,
}: SalesManagerStatsProps) {
  const [apiData, setApiData] = React.useState<any[]>([]);
  const salesManagerId = salesManager?.id;
  const [selectedYear, setSelectedYear] = React.useState(0);

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

  if (!salesManager) {
    <Loader />;
  }

  return (
    <div className="content-container">
      <h2>API Data</h2>
      <small>{salesManager ? salesManagerId : "No ID"}</small>
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
      <Suspense fallback={<Loader />}>
        <h1>Sales Manager Stats from API</h1>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Quarter</th>
              <th>Amount</th>
              <th>Customer Name</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {apiData.map((transaction, index) => {
              return (
                <tr key={index}>
                  <td>{transaction.year}</td>
                  <td>{transaction.quarter}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.customerFullName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Suspense>
    </div>
  );
}
