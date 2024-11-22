// store/stats-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from '@/types/customer'
import { Account, SavingPeriod } from '@/types/types'

interface StatsState {
   customer: Customer | null
   account: Account | null
   activeSavingPeriod: SavingPeriod | null
   lastTransactionUpdate?: Date
   
   setCustomer: (customer: Customer) => void
   setAccount: (account: Account) => void
   setSavingPeriod: (period: SavingPeriod) => void
   reset: () => void
   notifyTransactionChange: () => void
}

export const useStatsStore = create<StatsState>()(
   persist(
      (set) => ({
         // Initial state
         customer: null,
         account: null,
         activeSavingPeriod: null,

         // Actions
         setCustomer: (customer) => set({ customer }),
         setAccount: (account) => set({ account }),
         setSavingPeriod: (period) => set({ activeSavingPeriod: period }),
         reset: () => set({ customer: null, account: null, activeSavingPeriod: null }),
         notifyTransactionChange: () => set({ lastTransactionUpdate: new Date() }),
      }),
      {
         name: 'customer-stats-storage',
         storage: sessionStorage
      }
   )
)