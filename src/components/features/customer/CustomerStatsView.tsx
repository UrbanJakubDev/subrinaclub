'use client';
import { useState, useCallback, useEffect } from "react";
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from "@/lib/services/customer/types";
import { Transaction } from "@/types/transaction";
import Skeleton from "@/components/ui/skeleton";
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
   initialCustomer: CustomerWithAccountDataAndActiveSavingPeriodDTO
   initialTransactions: Transaction[]
}

export default function CustomerStatsView({ initialCustomer, initialTransactions }: CustomerStatsViewProps) {
   // Local state for the component and its children
   const [customer, setLocalCustomer] = useState(initialCustomer);
   const [account, setLocalAccount] = useState(initialCustomer.account);
   const [savingPeriod, setLocalSavingPeriod] = useState(initialCustomer.account.savingPeriod);
   const [transactions, setTransactions] = useState(initialTransactions);
   const [isLoading, setIsLoading] = useState(false);
   const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

   // Store setters for global state
   const { setCustomer, setAccount, setSavingPeriod } = useStatsStore();
   const { actions } = useModalStore();

   // Update both local and global state
   const refreshData = useCallback((
      newCustomer: CustomerWithAccountDataAndActiveSavingPeriodDTO,
      newTransactions: Transaction[]
   ) => {
      setIsLoading(true);
      setIsTransactionsLoading(true);
      
      // Ensure newTransactions is always an array
      const transactions = Array.isArray(newTransactions) ? newTransactions : [];
      
      // Update local state
      setLocalCustomer(newCustomer);
      setLocalAccount(newCustomer.account);
      setLocalSavingPeriod(newCustomer.account.savingPeriod);
      setTransactions(transactions);

      // Always update global state, even if there are no transactions
      setCustomer(newCustomer);
      setAccount(newCustomer.account);
      setSavingPeriod(newCustomer.account.savingPeriod);
      
      console.log('Refreshing data:', {
        customer: newCustomer,
        account: newCustomer.account,
        savingPeriod: newCustomer.account.savingPeriod,
        transactionsCount: transactions.length
      });

      setIsLoading(false);
      setIsTransactionsLoading(false);
   }, [setCustomer, setAccount, setSavingPeriod]);

   // Handle initial data changes
   useEffect(() => {
      console.log('Initial data:', {
        customer: initialCustomer,
        transactions: initialTransactions
      });
      refreshData(initialCustomer, initialTransactions || []); // Ensure transactions is always an array
   }, [initialCustomer, refreshData]); // Remove initialTransactions from dependencies


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
         const [newCustomer, newTransactions] = await Promise.all([
            fetchCustomer(customer.id),
            fetchTransactions(customer.account.id)
         ]);
         
         console.log('API Response - New transactions:', newTransactions);
         
         if (newCustomer && Array.isArray(newTransactions)) {
            refreshData(newCustomer, newTransactions);
            console.log('After refresh - Updated transactions:', newTransactions);
         }
      } catch (error) {
         toast.error(`Failed to refresh data ${error}`);
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
      console.log('Before delete - Current transactions:', transactions);
      
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
            <CustomerCard
               customer={customer}
               isLoading={isLoading}
            />
            <AccountInfoCard
               account={account}
               savingPeriod={savingPeriod}
               isLoading={isLoading}
            />
            <SavingPeriodStats
               transactions={transactions}
               savingPeriod={savingPeriod}
               isLoading={isLoading || isTransactionsLoading}
            />
         </div>
         <div>
            <div className="my-2">
               <AccountStats
                  customer={customer}
                  transactions={transactions}
                  isLoading={isLoading || isTransactionsLoading}
               />
            </div>
            <div className="my-2">
               <TransactionsTable
                  tableName={`Transakce ${customer.fullName || ''}`}
                  accountId={account?.id}
                  transactions={transactions}
                  isLoading={isTransactionsLoading || isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
               />
            </div>
         </div>
      </>
   );
}