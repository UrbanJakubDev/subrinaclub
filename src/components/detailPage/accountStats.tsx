"use client";

import { IAccount, ITransaction } from "@/interfaces/interfaces";
import React from "react";
import SimpleTable from "../tables/simpleTable";
import { sumPosPointsInTransactions } from "@/utils/functions";

type Props = {
  account: IAccount;
  transactions: any[];
};

export default function AccountStats({ account, transactions }: Props) {
  const [selectedYear, setSelectedYear] = React.useState(0);
  const clubAccountBalance = sumPosPointsInTransactions(transactions);
  
  

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




  return (
    <div className="flex flex-col gap-10">
      <div className="border-b">
        <small>Statistika účtu s id: {account.id}</small>
        <div>
          <h2>Transakce na účtu</h2>
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

        <p>Klubové konto: {clubAccountBalance}</p>
        <p>Roční konto: {account.balance}</p>
        <p>
          Suma bodů ve vybraném roce:{" "}
          {selectedYear === 0 ? "Nevybráno" : selectedYear} -{" "}
          {sumPointsInYear(transactions, selectedYear)}
        </p>
        <p>
          Suma bodů předešlý rok:{" "}
          {sumPointsInYear(transactions, selectedYear - 1)}
        </p>
        <p>
          Průměr bodů za poslední 4 roky:{" "}
          {fourYearAverage(transactions, selectedYear)}
        </p>
      </div>

      <div className="flex gap-10 justify-between border-b">
        <div>
          <SimpleTable data={transactionsInYear(transactions, selectedYear)} />
          <p>Total points {sumPointsInYear(transactions, selectedYear)}</p>
        </div>
      </div>
    </div>
  );
}
