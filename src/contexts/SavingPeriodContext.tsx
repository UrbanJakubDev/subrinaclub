import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ISavingPeriod } from '@/types/interfaces';

interface SavingPeriodContextType {
   activeSavingPeriod: ISavingPeriod | null;
   closeSavingPeriod: () => Promise<void>;
   createSavingPeriod: (startYear: number, startQuarter: number) => Promise<void>;
}

const SavingPeriodContext = createContext<SavingPeriodContextType | undefined>(undefined);

export const useSavingPeriods = () => {
   const context = useContext(SavingPeriodContext);
   if (!context) {
      throw new Error('useSavingPeriods must be used within a SavingPeriodProvider');
   }
   return context;
};

interface SavingPeriodProviderProps {
   children: React.ReactNode;
   account: any
}

export const SavingPeriodProvider: React.FC<SavingPeriodProviderProps> = ({ children, account }) => {
   const [activeSavingPeriod, setActiveSavingPeriod] = useState<ISavingPeriod | null>(null);
   const accountId = account.id;

   const fetchActiveSavingPeriod = useCallback(async () => {
      try {
         const response = await fetch(`/api/saving-periods/active?accountId=${accountId}`);
         if (!response.ok) throw new Error('Failed to fetch active saving period');
         const data = await response.json();
         setActiveSavingPeriod(data);
      } catch (error) {
         console.error('Error fetching active saving period:', error);
      }
   }, [accountId]);

   useEffect(() => {
      fetchActiveSavingPeriod();
   }, [fetchActiveSavingPeriod]);

   const closeSavingPeriod = useCallback(async () => {
      if (!activeSavingPeriod) return;
      try {
         const response = await fetch(`/api/saving-periods/${activeSavingPeriod.id}/close`, {
            method: 'POST',
         });
         if (!response.ok) throw new Error('Failed to close saving period');
         setActiveSavingPeriod(null);
      } catch (error) {
         console.error('Error closing saving period:', error);
         throw error;
      }
   }, [activeSavingPeriod]);

   const createSavingPeriod = useCallback(async (startYear: number, startQuarter: number) => {
      try {
         const response = await fetch('/api/saving-periods', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountId, startYear, startQuarter }),
         });
         if (!response.ok) throw new Error('Failed to create saving period');
         const newSavingPeriod = await response.json();
         setActiveSavingPeriod(newSavingPeriod);
      } catch (error) {
         console.error('Error creating saving period:', error);
         throw error;
      }
   }, [accountId]);

   return (
      <SavingPeriodContext.Provider value={{ activeSavingPeriod, closeSavingPeriod, createSavingPeriod }}>
         {children}
      </SavingPeriodContext.Provider>
   );
};