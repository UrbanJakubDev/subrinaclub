'use client';
import { useEffect } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { SavingPeriodProvider } from "@/contexts/SavingPeriodContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { Customer } from "@/types/customer";


type StatsDataWrapperProps = {
   initialTransactions: any[]
   initialCustomer: Customer
   children: React.ReactNode
}

export default function StatsDataWrapper({ initialCustomer, initialTransactions, children}: StatsDataWrapperProps) {
   const { account, updateCustomer } = useCustomer();

   useEffect(() => {
      updateCustomer(initialCustomer);
   }, [initialCustomer, updateCustomer]);

   return (
      <SavingPeriodProvider account={initialCustomer.account}>
         <TransactionProvider initialTransactions={initialTransactions} >
            {children}
         </TransactionProvider>
      </SavingPeriodProvider>
   );
}