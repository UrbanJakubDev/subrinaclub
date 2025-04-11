import { transactionApi } from "@/lib/api/transaction/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { transactionKeys } from "./queries"
import { Transaction } from "@/types/transaction"
import { accountKeys } from "../account/queries"

export const useCreateTransaction = () => {
   return useMutation({
      mutationFn: transactionApi.create,
      onSuccess: (data) => {
         // Invalidate all transaction queries
         queryClient.invalidateQueries({ queryKey: transactionKeys.all })
         
         // Invalidate account-specific transaction queries
         if (data.accountId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.account(data.accountId) })
            // Also invalidate the account itself as its balance might have changed
            queryClient.invalidateQueries({ queryKey: accountKeys.detail(data.accountId) })
         }
         
         // Invalidate saving period transactions if applicable
         if (data.savingPeriodId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.savingPeriod(data.savingPeriodId) })
         }
      }
   })
}

export const useUpdateTransaction = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Transaction> }) => 
         transactionApi.update(id, data),
      onSuccess: (data, variables) => {
         // Invalidate all transaction queries
         queryClient.invalidateQueries({ queryKey: transactionKeys.all })
         
         // Invalidate specific transaction query
         queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
         
         // Invalidate account-specific transaction queries
         if (data.accountId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.account(data.accountId) })
            // Also invalidate the account itself as its balance might have changed
            queryClient.invalidateQueries({ queryKey: accountKeys.detail(data.accountId) })
         }
         
         // Invalidate saving period transactions if applicable
         if (data.savingPeriodId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.savingPeriod(data.savingPeriodId) })
         }
      }
   })
}

export const useDeleteTransaction = (id: number) => {
   return useMutation({
      mutationFn: transactionApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) })
      }
   })
}

export const useSoftDeleteTransaction = () => {
   return useMutation({
      mutationFn: transactionApi.softDelete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      }
   })
} 