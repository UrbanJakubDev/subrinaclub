import { salesManagerApi } from "@/lib/api/salesManager/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { salesManagerKeys } from "./queries"
import { SalesManager } from "@/types/salesmanager"

export const useCreateSalesManager = () => {
   return useMutation({
      mutationFn: salesManagerApi.create,
   })
}

export const useUpdateSalesManager = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<SalesManager> }) => 
         salesManagerApi.update(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: salesManagerKeys.all })
      }
   })
}

export const useDeleteSalesManager = () => {
   return useMutation({
      mutationFn: salesManagerApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: salesManagerKeys.all })
      }
   })
} 