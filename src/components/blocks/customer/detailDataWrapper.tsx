'use client';
import { useEffect, useState, useCallback, Suspense } from "react";
import CustomerAccountDetail from "./account/detail";
import TransactionForm from "@/components/forms/transactionForm";
import { useCustomer } from "@/contexts/CustomerContext";
import SavingPeriodStats from "../savingPeriod/savingPeriodStats";
import { useModal } from "@/contexts/ModalContext";
import Loader from "@/components/ui/loader";

type Props = {
   initialCustomer: any;
   initData?: {
      initTransactions: any[];
      initTransactionsInPeriod: any[];
   }
}

export default function DetailDataWrapper({ initialCustomer, initData }: Props) {
   const { updateCustomer } = useCustomer();
   const { modalSubmitted } = useModal();
   const [isFetching, setIsFetching] = useState(false);

   const [accountData, setAccountData] = useState(initialCustomer.accounts[0]);
   const [savingPeriod, setSavingPeriod] = useState(initialCustomer.accounts[0].savingPeriods[0]);
   const [customerAccountDetailData, setCustomerAccountDetailData] = useState({
      year: new Date().getFullYear(),
      clubPoints: 0,
      yearPoints: 0,
      savingPeriodPoints: 0,
      quarterPoints: []
   });

   const [transactions, setTransactions] = useState(initData?.initTransactions || []);
   const [transactionsInPeriod, setTransactionsInPeriod] = useState(initData?.initTransactionsInPeriod || []);

   useEffect(() => {
      updateCustomer(initialCustomer); // Update customer context
   }, [initialCustomer, updateCustomer]);

   const fetchTransactionsInPeriod = useCallback(async () => {
      try {
         const response = await fetch(`/api/transactions/saving-period?accountId=${accountData.id}&from=${savingPeriod.savingStartDate}&to=${savingPeriod.savingEndDate}`);
         return await response.json();
      } catch (error) {
         console.error("Error fetching transactions:", error);
         return [];
      }
   }, [accountData.id, savingPeriod.savingStartDate, savingPeriod.savingEndDate]);

   const fetchTransactions = useCallback(async () => {
      try {
         const response = await fetch(`/api/transactions?accountId=${accountData.id}`);
         return await response.json();
      } catch (error) {
         console.error("Error fetching transactions:", error);
         return [];
      }
   }, [accountData.id]);

   const calculatePoints = useCallback(() => {
      const sum = getSumOfTransactions(transactions);
      const yearSum = getSumOfTransactionsInYear(transactions, customerAccountDetailData.year);
      const periodSum = getBalanceOfTransactions(transactionsInPeriod);

      setCustomerAccountDetailData((prevData) => ({
         ...prevData,
         clubPoints: sum,
         yearPoints: yearSum,
         savingPeriodPoints: periodSum,
      }));
   }, [transactions, transactionsInPeriod, customerAccountDetailData.year]);

   const getSumOfTransactions = (transactions: any[]) => {
      return transactions.reduce((sum, transaction) => sum + (transaction.amount > 0 ? transaction.amount : 0), 0);
   }

   // Get the sum of transactions in a specific year and greater than 0
   const getSumOfTransactionsInYear = (transactions: any[], year: number) => {
      return transactions.reduce((sum, transaction) => sum + (transaction.amount > 0 && transaction.year === year ? transaction.amount : 0), 0);
   }

   const getBalanceOfTransactions = (transactions: any[]) => {
      return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
   }

   // Fetch and calculate points when the component mounts, if initData is not provided
   useEffect(() => {
      const fetchInitialData = async () => {
         if (!initData) {
            setIsFetching(true);

            const [transactionsData, transactionsInPeriodData] = await Promise.all([
               fetchTransactions(),
               fetchTransactionsInPeriod(),
            ]);

            setTransactions(transactionsData);
            setTransactionsInPeriod(transactionsInPeriodData);

            setIsFetching(false);
         }

         calculatePoints(); // Calculate points regardless of whether data is fetched or provided
      };

      fetchInitialData();
   }, [initData, fetchTransactions, fetchTransactionsInPeriod, calculatePoints]);

   useEffect(() => {
      if (modalSubmitted) {
         setIsFetching(true);

         // Perform optimistic update before fetching new data
         Promise.all([fetchTransactions(), fetchTransactionsInPeriod()])
            .then(([transactionsData, transactionsInPeriodData]) => {
               setTransactions(transactionsData);
               setTransactionsInPeriod(transactionsInPeriodData);

               calculatePoints();  // Recalculate points after fetching new transactions
            })
            .finally(() => setIsFetching(false));
      }
   }, [modalSubmitted, fetchTransactions, fetchTransactionsInPeriod, calculatePoints]);

   return (
      <div className="h-full w-full flex flex-col gap-6">
         <CustomerAccountDetail
            account={accountData}
            data={customerAccountDetailData}
            isLoading={isFetching} // Pass the loading state to this component to handle it internally
         />
         <SavingPeriodStats
            savingPeriod={savingPeriod}
            transactions={transactions}
            points={customerAccountDetailData.savingPeriodPoints}
            isLoading={isFetching} // Pass the loading state to this component to handle it internally
         />
         <TransactionForm /> {/* Show loading indicator if necessary */}
      </div>
   );
}
