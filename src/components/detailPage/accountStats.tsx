"use client";

import { IAccount, ITransaction } from "@/interfaces/interfaces";
import React from "react";
import SimpleTable from "../tables/simpleTable";

type Props = {
  account: IAccount;
  transactions: any[];
};

export default function AccountStats({ account, transactions }: Props) {
  const [selectedYear, setSelectedYear] = React.useState(0);

  const sumPointsInTransactions = (transactions: ITransaction[]) => {
    let sum = 0;
    transactions.forEach((transaction: ITransaction) => {
      // Sum points if greater than 0
      if (transaction.amount > 0) {
        sum += transaction.amount;
      }
    });
    return sum;
  };

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

    return average;
  };

  const transactionsInYear = (transactions: ITransaction[], year: number) => {
    return transactions.filter(
      (transaction: ITransaction) => transaction.year === year
    );
  };

  interface QuarterSum {
    year: number;
    quarter: number;
    sum: number;
  }

  const sumTransactionsByQuarter = (
    transactions: ITransaction[],
    year: number
  ): QuarterSum[] => {
    const quarterSums: QuarterSum[] = [];

    // Loop through each year from the given year to four years back
    for (let y = year - 4; y <= year; y++) {
      // Loop through each quarter of the year
      for (let quarter = 1; quarter <= 4; quarter++) {
        // Filter transactions for the current quarter and year
        const relevantTransactions = transactions.filter((transaction) => {
          return transaction.year === y && transaction.quarter === quarter;
        });

        // Calculate the sum of points for the current quarter and year when are positive
        const sum = relevantTransactions.reduce((total, transaction) => {
          // Sum points if greater than 0
          if (transaction.amount > 0) {
            return total + transaction.amount;
          }
          return total;
        }, 0);

        // Add the quarter sum to the result array
        quarterSums.push({ year: y, quarter, sum });
      }
    }

    return quarterSums;
  };

  const QuarterTable = ({ data }) => {
    // Extract unique years and quarters
    const years = Array.from(new Set(data.map((item) => item.year)));
    const quarters = Array.from(new Set(data.map((item) => item.quarter)));

    return (
      <table>
        <thead className="bg-zinc-300">
          <tr>
            <th>Quarter</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-zinc-100">
          {quarters.map((quarter) => (
            <tr key={quarter} className="hover:bg-zinc-200">
              <td>{quarter}</td>
              {years.map((year) => {
                const item = data.find(
                  (item) => item.year === year && item.quarter === quarter
                );
                return (
                  <td key={`${year}-${quarter}`}>{item ? item.sum : "-"}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="border-b">
        <h1>Account Stats</h1>
        <small>Stats for account with id: {account.id}</small>

        <p>Balance: {account.balance}</p>
        <p>
          Sum of points in transactions: {sumPointsInTransactions(transactions)}
        </p>
        <p>
          Sum of points in year {selectedYear} -{" "}
          {sumPointsInYear(transactions, selectedYear)}
        </p>
        <p>
          Sum of points in previous years:{" "}
          {sumPointsInYear(transactions, selectedYear - 1)}
        </p>
        <p>
          Average points in last four years:{" "}
          {fourYearAverage(transactions, selectedYear)}
        </p>
      </div>
      <div>
        <h2>Transactions</h2>
        <select onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          <option value="0" disabled>
            Choose year...
          </option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
        </select>
      </div>
      <div className="flex gap-10 justify-between border-b">
        <div>
          <SimpleTable data={transactionsInYear(transactions, selectedYear)} />
          <p>Total points {sumPointsInYear(transactions, selectedYear)}</p>
        </div>
        <div>
          <h2>Long time sums</h2>
          <QuarterTable
            data={sumTransactionsByQuarter(transactions, selectedYear)}
          />
        </div>
      </div>
    </div>
  );
}
