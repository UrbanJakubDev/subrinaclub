
'use client';
import { Customer } from '@/types/customer';
import { Account, SavingPeriod } from '@/types/types';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface ICustomerContext {
   customer: Customer | null;
   account: Account | null;
   activeSavingPeriod: SavingPeriod | null;
   updateCustomer: (customer: Customer) => void;
   updateActiveSavingPeriod: (newPeriod: SavingPeriod) => void;
}

const CustomerContext = createContext<ICustomerContext | undefined>(undefined);

export const CustomerProvider = ({ children }) => {
   const [customer, setCustomer] = useState<Customer | null>(null);

   // Memoized account based on customer data
   const account = useMemo(() => {
      return customer && customer.account
   }, [customer]);

   // Memoized active saving period based on account data where status is "ACTIVE"
   const activeSavingPeriod = useMemo(() => {
      return account && account.savingPeriod && account.savingPeriod;
   }, [account]);

   const updateCustomer = useCallback((newCustomer: Customer) => {
      setCustomer(newCustomer);
   }, []);

   const updateActiveSavingPeriod = useCallback((newPeriod: SavingPeriod) => {
      if (account) {
         const updatedPeriods = account.savingPeriod.map(period =>
            period.id === newPeriod.id ? newPeriod : period
         );
         account.savingPeriod = updatedPeriods;
      }
   }, [account]);

   return (
      <CustomerContext.Provider value={{ customer, account, activeSavingPeriod, updateCustomer, updateActiveSavingPeriod }}>
         {children}
      </CustomerContext.Provider>
   );
};

export const useCustomer = () => {
   const context = useContext(CustomerContext);
   if (!context) {
      throw new Error('useCustomer must be used within a CustomerProvider');
   }
   return context;
};

export default CustomerProvider;
