"use client";

import { IAccount, ITransaction } from "@/interfaces/interfaces";
import React, { use, useEffect, useState } from "react";
import SimpleTable from "../tables/simpleTable";
import { sumPosPointsInTransactions } from "@/utils/functions";
import TransactionComponent from "../transactionForm";
import InputField from "../ui/inputs/basicInput";
import SelectField from "../ui/inputs/selectInput";
import { yearSelectOptions } from "@/utils/dateFnc";
import Button from "../ui/button";
import SimpleStat from "../ui/stats/simple";
import InputDateFiled from "../ui/inputs/dateInput";
import TransactionsTable from "../tables/transactionsTable";
import { set } from "react-hook-form";

type Props = {
  account: IAccount;
  transactions: any[];
};

export default function AccountStats({ account, transactions }: Props) {
  const [selectedYear, setSelectedYear] = React.useState(2024);
  const clubAccountBalance = sumPosPointsInTransactions(transactions);
  const [transactionIsOpen, setTransactionIsOpen] = React.useState(false);
  const [yearFilteredTransactions, setYearFilteredTransactions] = React.useState<ITransaction[]>([]);

  // Date for the year balance calculation
  const [yearBalanceDate, setYearBalanceDate] = useState(new Date("2024-01-01"));
  const [yearBalance, setYearBalance] = useState(0);


  useEffect(() => {
    setYearBalance(sumNextTwoYears(yearBalanceDate, transactions));
  }
    , [yearBalanceDate, transactions]);

  useEffect(() => {
    // Clear the state when the selected year changes
    setYearFilteredTransactions([]);
    setYearFilteredTransactions(transactionsInYear(transactions, selectedYear));
  }
    , [selectedYear, transactions]);


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


  const transactionsInYear = (transactions: ITransaction[], year: number) => {
    return transactions.filter(
      (transaction: ITransaction) => transaction.year === year
    );
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

  return (
    <div className="flex flex-col gap-10">
      <TransactionComponent account={account} onTransactionCreated={getTransactions} />
      <div className="border p-4 bg-zinc-50">
        <h2>Statistika bodů na účtu s id: {account.id}</h2>
        <div>
          <SelectField
            label="Rok"
            name="year"
            defaultValue="0"
            options={yearSelectOptions()}
            onChange={(e: any) => setSelectedYear(parseInt(e.target.value))}
          />

          <InputDateFiled
            label="Datum pro výpočet stavu šetřícího účtu"
            name="yearBalanceDate"
            defaultValue={yearBalanceDate}
            onChange={(date: string) => setYearBalanceDate(new Date(date))}
          />


        </div>

        <div className="flex flex-row justify-stretch mx-auto">
          <SimpleStat label="Stav zákaznického konta" value={clubAccountBalance} />
          <SimpleStat label={`Stav šetřícího konta od: ${yearBalanceDate.toLocaleDateString()}`} value={yearBalance} />
          <SimpleStat label={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`} value={sumPointsInYear(transactions, selectedYear)} />
          <SimpleStat label="Průměr bodů získaných za poslední 4 roky" value={fourYearAverage(transactions, selectedYear)} />
        </div>
      </div>

      <div className="justify-between border bg-zinc-50 p-4">
        <div>
          <SimpleTable data={transactionsInYear(transactions, selectedYear)} />
          <p>Total points {sumPointsInYear(transactions, selectedYear)}</p>
        </div>
      </div>

    </div>
  );
}
