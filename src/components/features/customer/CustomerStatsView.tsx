'use client';
import { useEffect } from "react";

import { Customer } from "@/types/customer";
import { useStatsStore } from "@/stores/CustomerStatsStore";
import { Transaction } from "@/types/transaction";
import Skeleton from "@/components/ui/skeleton";
import CustomerCard from "./customerCard";
import AccountInfoCard from "./accountInfoCard";
import AccountStats from "./account/accountStats";
import TransactionsTable from "../transactions/transactionsTable";
import SavingPeriodStats from "../savingPeriod/savingPeriodStats";


type CustomerStatsViewProps = {
   initialCustomer: Customer
   initialTransactions: Transaction[]
}

export default function CustomerStatsView({ initialCustomer, initialTransactions }: CustomerStatsViewProps) {

   const initialize = useStatsStore(state => state.initialize)
   const customer = useStatsStore(state => state.customer)
   const transactions = useStatsStore(state => state.transactions)
   const isLoading = useStatsStore(state => state.isLoading)
   const activePeriod = useStatsStore(state => state.getActiveSavingPeriod())
   // const periodTransactions = useStatsStore(state => state.getTransactionsForActiveSavingPeriod())
   const refreshTransactionsFromServer = useStatsStore(state => state.refreshTransactionsFromServer)

   useEffect(() => {
      initialize(initialCustomer, initialTransactions)
   }, [initialCustomer, initialTransactions, initialize])


   // Refresh transactions from server if transaction in store is updated
   useEffect(() => {
      refreshTransactionsFromServer()
   }, [transactions])


   if (!customer || isLoading || !transactions) return <Skeleton />

   return (
      <>
         <div className="flex gap-8 my-2">
            <CustomerCard customer={customer} />
            <AccountInfoCard
               account={customer.account}
               customer={customer}
            />

            <SavingPeriodStats
               transactions={[]}
               savingPeriod={activePeriod}
            />
         </div>
         <div>
            <div className="my-2">
               <AccountStats />
            </div>
            <div className="my-2">
               <h2>Přehled všech transakcí</h2>
               <TransactionsTable
                  tableName={`Transakce ${customer.fullName}`}
                  accountId={customer.account.id}
                  transactions={transactions}
               />
            </div>
         </div>
      </>
   )
}