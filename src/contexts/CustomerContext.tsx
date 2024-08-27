
'use client';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ICustomer, IAccount, ISavingPeriod } from '@/interfaces/interfaces';

interface ICustomerContext {
   customer: ICustomer | null;
   account: IAccount | null;
   activeSavingPeriod: ISavingPeriod | null;
   updateCustomer: (customer: ICustomer) => void;
   updateActiveSavingPeriod: (newPeriod: ISavingPeriod) => void;
}

const CustomerContext = createContext<ICustomerContext | undefined>(undefined);

export const CustomerProvider = ({ children }) => {
   const [customer, setCustomer] = useState<ICustomer | null>(null);

   // Memoized account based on customer data
   const account = useMemo(() => {
      return customer && customer.accounts.length > 0 ? customer.accounts[0] : null;
   }, [customer]);

   // Memoized active saving period based on account data
   const activeSavingPeriod = useMemo(() => {
      return account && account.savingPeriods.length > 0
         ? account.savingPeriods.find(period => period.active) || null
         : null;
   }, [account]);

   const updateCustomer = useCallback((newCustomer: ICustomer) => {
      setCustomer(newCustomer);
   }, []);

   const updateActiveSavingPeriod = useCallback((newPeriod: ISavingPeriod) => {
      if (account) {
         const updatedPeriods = account.savingPeriods.map(period =>
            period.id === newPeriod.id ? newPeriod : period
         );
         account.savingPeriods = updatedPeriods;
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
