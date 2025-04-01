import { accountApi } from "@/lib/api/account/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { accountKeys } from "./queries"
import { Account } from "@/types/types"

export const useCreateAccount = () => {
   return useMutation({
      mutationFn: accountApi.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: accountKeys.all })
      }
   })
}

export const useUpdateAccount = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Account> }) => 
         accountApi.update(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: accountKeys.all })
         queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) })
      }
   })
}

export const useDeleteAccount = () => {
   return useMutation({
      mutationFn: accountApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: accountKeys.all })
      }
   })
}

export const useSoftDeleteAccount = () => {
   return useMutation({
      mutationFn: accountApi.softDelete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: accountKeys.all })
      }
   })
} 