// store/stats-store.ts
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Customer } from '@/types/customer'
import { Transaction } from '@/types/transaction'
import { SavingPeriod } from '@/types/types'
import { revalidatePath } from 'next/cache'



export interface ValidationError {
   field: string
   message: string
}

export interface StatsState {
   customer: Customer | null
   transactions: Transaction[]
   isLoading: boolean
   error: string | null
   validationErrors: ValidationError[]
   filteredTransactionsCache: Transaction[]
}

export interface StatsActions {
   initialize: (customer: Customer, transactions: Transaction[]) => void
   getActiveSavingPeriod: () => SavingPeriod | null
   getTransactionsForActiveSavingPeriod: () => Transaction[]
   addTransaction: (transaction: CreateTransactionInput) => void
   updateTransaction: (transaction: Transaction) => void
   deleteTransaction: (transaction: Transaction) => void
   refreshTransactionsFromServer: () => void
   refreshCustomerFromServer: () => void
}

export type StatsStore = StatsState & StatsActions

export const defaultInitState: StatsState = {
   customer: null,
   transactions: [],
   isLoading: false,
   error: null,
   validationErrors: [],
   filteredTransactionsCache: []
}

export const createStatsStore = (initState: StatsState = defaultInitState) => {
   return createStore<StatsStore>()(
      persist(
         (set, get) => ({
            ...initState,

            initialize: (customer, transactions) => {
               set({ customer, transactions })
            },

            // Memoize the getters to prevent infinite updates
            getActiveSavingPeriod: () => {
               const { customer } = get()
               const savingPeriods = customer?.account.savingPeriods
               if (!savingPeriods) return null
               return savingPeriods.find(p => p.status === 'ACTIVE') || null
            },

            getTransactionsForActiveSavingPeriod: () => {
               const { transactions } = get()
               const activeSavingPeriod = get().getActiveSavingPeriod()
               if (!activeSavingPeriod) return []

               // Only use cache if it exists and has items
               if (get().filteredTransactionsCache.length > 0) {
                  return get().filteredTransactionsCache
               }

               const filtered = transactions.filter(t => t.savingPeriodId === activeSavingPeriod.id)
               set({ filteredTransactionsCache: filtered })
               return filtered
            },

            addTransaction: async (transaction: CreateTransactionInput) => {
               const { customer } = get();
               if (!customer?.account) {
                  return Promise.reject(new Error('No customer account found'));
               }

               // Get the active saving period
               const activeSavingPeriod = get().getActiveSavingPeriod();
               if (!activeSavingPeriod) {
                  return Promise.reject(new Error('No active saving period found'));
               }

               const transactionData = {
                  ...transaction,
                  accountId: customer.account.id,
                  savingPeriodId: activeSavingPeriod.id
               };

               try {
                  const result = await fetch('/api/transactions', {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(transactionData)
                  })
                  const newTransaction = await result.json()
                  
                  // After successful creation, refresh the transactions
                  await get().refreshTransactionsFromServer()
                  
                  return newTransaction
               } catch (error) {
                  return Promise.reject(error)
               }
            },

            updateTransaction: (transaction: Transaction) => {
               console.log('Updating transaction', transaction)

            },

            deleteTransaction: (transaction: Transaction) => {
               console.log('Deleting transaction', transaction)
               throw new Error('Not implemented')
            },

            refreshTransactionsFromServer: async () => {
               const { customer } = get()
               if (!customer) return

               try {
                  const transactions = await fetch(`/api/transactions?customerId=${customer.id}`)
                  const data = await transactions.json()
                  // Clear the cache and set new transactions
                  set({ 
                     transactions: data,
                     filteredTransactionsCache: [] // Clear the cache
                  })
               } catch (error) {
                  return Promise.reject(error)
               }
            },

            refreshCustomerFromServer: async () => {
               const { customer } = get()
               if (!customer?.id) return

               try {
                  const response = await fetch(`/api/customers/${customer.id}`)
                  const data = await response.json()
                  set({ customer: data })
               } catch (error) {
                  console.error('Failed to refresh customer:', error)
                  return Promise.reject(error)
               }
            }



         }),
         {
            name: 'stats-storage',
            storage: createJSONStorage(() => sessionStorage)
         }
      )
   )
}

// To handle hydration, create a helper hook:
let store: ReturnType<typeof createStatsStore>

function getStore(initState?: StatsState) {
   // For SSR, always create a new store
   if (typeof window === 'undefined') {
      return createStatsStore(initState)
   }
   // Create store if doesn't exist
   if (!store) {
      store = createStatsStore(initState)
   }
   return store
}

export function useStatsStore<T>(
   selector: (state: StatsStore) => T,
   initState?: StatsState
): T {
   const store = getStore(initState)
   return useStore(store, selector)
}