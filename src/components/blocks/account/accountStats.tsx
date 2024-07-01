"use client";


import React, { use, useEffect, useState } from "react";
import SimpleTable from "../../tables/simpleTable";
import TransactionComponent from "../transaction";
import InputField from "../../ui/inputs/basicInput";
import SelectField from "../../ui/inputs/selectInput";
import Button from "../../ui/button";
import SimpleStat from "../../ui/stats/simple";
import InputDateFiled from "../../ui/inputs/dateInput";
import TransactionsTable from "../../tables/transactionsTable";
import { set } from "react-hook-form";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import { IAccount, ICustomer, ITransaction } from "../../../interfaces/interfaces";
import { yearSelectOptions } from "../../../utils/dateFnc";
import { sumPosPointsInTransactions } from "@/utils/functions";
import { KpiCard } from "@/components/ui/stats/KpiCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  customer: ICustomer;
  account: IAccount;
  transactions: any[];
};

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
      {/* <TransactionComponent account={account} onTransactionCreated={getTransactions} /> */}
      <div className="border p-4 bg-zinc-50">
        <h2>Statistika bodů na účtu s id: {account.id} pro zákazníka - {customer.fullName}</h2>
        <div className="mt-2">
          <SimpleSelectInput
            label="Vybrat Rok..."
            onChange={(value) => setSelectedYear(value)}
            options={yearSelectOptions()}
            value={selectedYear} // Ensure the value is also passed to maintain the controlled state
          />

        </div>

        <div className="flex flex-row justify-stretch mx-auto">
          <KpiCard title="Bodový stav na konci roku" percentage={""} price={clubAccountBalance} color={""} />
          <KpiCard title={`Suma bodů získaných ve vybraném roce: ${selectedYear === 0 ? "Nevybráno" : selectedYear}`}  percentage={""} price={sumPointsInYear(transactions, selectedYear)}  color={""} />
          <KpiCard title="Průměr bodů získaných za poslední 4 roky"  percentage={""} price={fourYearAverage(transactions, selectedYear)} color={""} />
        </div>
      </div>



      {/* <div className="justify-between border bg-zinc-50 p-4">
        <div>
          <SimpleTable data={transactionsInYear(transactions, selectedYear)} />
          <p>Total points {sumPointsInYear(transactions, selectedYear)}</p>
        </div>
      </div> */}

    </div>
  );
}


