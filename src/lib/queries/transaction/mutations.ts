import { transactionApi } from "@/lib/api/transaction/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { transactionKeys } from "./queries"
import { Transaction, TransactionCreateDTO, TransactionUpdateDTO } from "@/types/transaction"
import { accountKeys } from "../account/queries"

export const useCreateTransaction = () => {
   return useMutation({
      mutationFn: async (data: TransactionCreateDTO) => {
         const response = await transactionApi.create(data as any);
         return response; // This is already the Transaction object from the API
      },
      onSuccess: (data) => {
         // Invalidate all transaction queries
         queryClient.invalidateQueries({ queryKey: transactionKeys.all })
         
         // Invalidate account-specific transaction queries
         if (data?.accountId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.byAccount(data.accountId) })
            // Also invalidate the account itself as its balance might have changed
            queryClient.invalidateQueries({ queryKey: accountKeys.detail(data.accountId) })
         }
      }
   })
}

export const useUpdateTransaction = () => {
   return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: TransactionUpdateDTO }) => {
         const response = await transactionApi.update(id, data as any);
         return response;
      },
      onSuccess: (data, variables) => {
         // Invalidate all transaction queries
         queryClient.invalidateQueries({ queryKey: transactionKeys.all })
         
         // Invalidate specific transaction query
         queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
         
         // Invalidate account-specific transaction queries
         if (data?.accountId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.byAccount(data.accountId) })
            // Also invalidate the account itself as its balance might have changed
            queryClient.invalidateQueries({ queryKey: accountKeys.detail(data.accountId) })
         }
      }
   })
}

export const useDeleteTransaction = () => {
   return useMutation({
      mutationFn: transactionApi.delete,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables) })
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