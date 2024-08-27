'use client';
import { useEffect, useState } from "react";
import AccountStats from "./account/accountStats";
import TransactionsTable from "@/components/tables/transactionsTable";
import { ICustomer } from "@/interfaces/interfaces";
import { useCustomer } from "@/contexts/CustomerContext";
import TransactionForm from "@/components/forms/transactionForm";
import { useModal } from "@/contexts/ModalContext";
import Skeleton from "@/components/ui/skeleton";

type StatsDataWrapperProps = {
   initialTransactions: any[]
   initialCustomer: ICustomer
}

export default function StatsDataWrapper({ initialCustomer, initialTransactions }: StatsDataWrapperProps) {
   const [transactions, setTransactions] = useState(initialTransactions);
   const [loading, setLoading] = useState(false);
   const { account, updateCustomer } = useCustomer();
   const { modalSubmitted } = useModal();

   useEffect(() => {
      updateCustomer(initialCustomer); // Update customer context
   }, [initialCustomer, updateCustomer]);

   // Fetch transactions for the account
   const fetchTransactions = async () => {
      setLoading(true);
      try {
         const response = await fetch(`/api/transactions?accountId=${account?.id}`);
         const data = await response.json();
         setTransactions(data);
      } catch (error) {
         console.error("Error fetching transactions:", error);
      } finally {
         setLoading(false);
      }
   };

   // Fetch transactions on modalSubmitted
   useEffect(() => {
      if (modalSubmitted) {
         fetchTransactions();
      }
   }, [modalSubmitted]);

   return (
      <div>
         <div className="content-container p-6 my-2">
            {loading ? <Skeleton /> : <AccountStats initData={transactions} />}
         </div>
         <div className="content-container p-6 my-2">
            <h2>Přehled všech transakcí</h2>
            {loading ? <Skeleton /> : <TransactionsTable defaultData={transactions} tableName={`Transakce ${initialCustomer.fullName}`} />}
         </div>
         <TransactionForm />
      </div>
   );
}
