'use client';
import { useState, useCallback, useEffect } from "react";
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from "@/lib/services/customer/types";
import { Transaction } from "@/types/transaction";
import CustomerCard from "./customerCard";
import AccountInfoCard from "./accountInfoCard";
import AccountStats from "./account/accountStats";
import TransactionsTable from "../transactions/transactionsTable";
import SavingPeriodStats from "../savingPeriod/savingPeriodStats";
import { useModalStore } from "@/stores/ModalStore";
import { useTransactionUpdates } from "@/hooks/useTransactionUpdates";
import { toast } from "react-toastify";
import { useStatsStore } from "@/stores/CustomerStatsStore";

type CustomerStatsViewProps = {
   initialCustomer: any
}

export default function CustomerStatsView({ initialCustomer }: CustomerStatsViewProps) {
   // Local state for the component and its children
   const [customer, setLocalCustomer] = useState(initialCustomer);
   const [account, setLocalAccount] = useState(initialCustomer.account);
   const [savingPeriod, setLocalSavingPeriod] = useState(initialCustomer.account.savingPeriod);
   const [transactions, setTransactions] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
   const [test, setTest] = useState(null);

   // Store setters for global state
   // const { setCustomer, setAccount, setSavingPeriod } = useStatsStore();
   const { actions } = useModalStore();

   // // Update both local and global state
   // const refreshData = useCallback((
   //    newCustomer: CustomerWithAccountDataAndActiveSavingPeriodDTO,
   //    newTransactions: Transaction[]
   // ) => {
   //    setIsLoading(true);
   //    setIsTransactionsLoading(true);

   //    // Ensure newTransactions is always an array
   //    const transactions = Array.isArray(newTransactions) ? newTransactions : [];

   //    // Validate customer data before updating state
   //    if (!newCustomer || !newCustomer.account) {
   //       console.error('Invalid customer data received:', newCustomer);
   //       toast.error('Received invalid customer data from server');
   //       setIsLoading(false);
   //       setIsTransactionsLoading(false);
   //       return;
   //    }

   //    // Update local state
   //    setLocalCustomer(newCustomer);
   //    setLocalAccount(newCustomer.account);
   //    setLocalSavingPeriod(newCustomer.account.savingPeriod);
   //    setTransactions(transactions);

   //    // Always update global state, even if there are no transactions
   //    setCustomer(newCustomer);
   //    setAccount(newCustomer.account);
   //    setSavingPeriod(newCustomer.account.savingPeriod);



   //    setIsLoading(false);
   //    setIsTransactionsLoading(false);
   // }, [setCustomer, setAccount, setSavingPeriod]);

   // // Handle initial data changes
   // useEffect(() => {

   //    refreshData(initialCustomer, initialTransactions || []); // Ensure transactions is always an array
   // }, [initialCustomer, refreshData]); // Remove initialTransactions from dependencies


   // Fetch data from API and update local and global state
   const fetchCustomer = async (customerId: number) => {
      const endpoint = `/api/customers/${customerId}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      return data;
   }


   const fetchTransactions = async (accountId: number): Promise<Transaction[]> => {
      const endpoint = `/api/transactions?accountId=${accountId}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      // Ensure we return an array, even if empty
      return Array.isArray(data) ? data : [];
   }

   const deleteTransaction = async (transactionId: number) => {
      const endpoint = `/api/transactions/${transactionId}`;
      const response = await fetch(endpoint, { method: 'DELETE' });
      const data = await response.json();
      return data;
   }



   const handleDataUpdate = async () => {
      if (!customer?.id || !customer?.account?.id) {
         toast.error('Customer data is not available');
         return;
      }

      setIsLoading(true);
      setIsTransactionsLoading(true);
      try {
         // Use separate variables and sequential fetching for better error handling
         const newCustomer = await fetchCustomer(customer.id);
         setTest(newCustomer);
         // Early validation to provide more specific error messages
         if (!newCustomer) {
            throw new Error('Failed to fetch customer data');
         }

         if (!newCustomer.account) {
            console.error('Customer API response missing account property:', newCustomer);
            // If customer data is valid but account is missing, use existing account data as fallback
            // This will allow the app to continue functioning with partial data
            const mergedCustomer = {
               ...newCustomer,
               account: customer.account // Fallback to the current account data
            };

            // Now fetch transactions
            const newTransactions = await fetchTransactions(customer.account.id);
            refreshData(mergedCustomer, newTransactions);
            toast.warning('Retrieved partial customer data - some information may be outdated');
         } else {
            // Normal flow with complete data
            const newTransactions = await fetchTransactions(newCustomer.account.id);
            refreshData(newCustomer, newTransactions);
         }
      } catch (error) {
         console.error('Data refresh error:', error);
         toast.error(`Failed to refresh data: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
         setIsLoading(false);
         setIsTransactionsLoading(false);
      }
   };

   const handleEdit = useCallback((transaction: Transaction) => {
      actions.openModal('transactionForm', transaction)
   }, []);

   const handleDelete = async (transactionId: number) => {
      setIsTransactionsLoading(true);

      try {
         await deleteTransaction(transactionId);
         await handleDataUpdate();
      } catch (error) {
         toast.error('Failed to delete transaction');
      } finally {
         setIsTransactionsLoading(false);
      }
   };

   const handleTransactionUpdate = useCallback(() => {
      handleDataUpdate();
   }, []);
   // Subscribe to transaction updates
   useTransactionUpdates(handleTransactionUpdate)


   return (
      <>
         <div className="flex gap-8 my-2">
            <CustomerCard customer_id={customer.id} />
            <AccountInfoCard
               account_id={account.id}
            />
            {/*
            <SavingPeriodStats
               transactions={transactions}
               savingPeriod={savingPeriod}
               isLoading={isLoading || isTransactionsLoading}
            /> */}
         </div>
         <div>
            {/* <div className="my-2">
               <AccountStats
                  customer={customer}
                  transactions={transactions}
                  isLoading={isLoading || isTransactionsLoading}
               />
            </div>
            <div className="my-2 w-full">
               <TransactionsTable
                  tableName={`Transakce ${customer.fullName || ''}`}
                  accountId={account?.id}
                  transactions={transactions}
                  isLoading={isTransactionsLoading || isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
               />
            </div> */}
         </div>

      </>
   );
}