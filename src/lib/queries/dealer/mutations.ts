import { dealerApi } from "@/lib/api/dealer/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { dealerKeys } from "./queries"
import { Dealer } from "@/types/dealer"

export const useCreateDealer = () => {
   return useMutation({
      mutationFn: dealerApi.create,
   })
}

export const useUpdateDealer = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Dealer> }) => 
         dealerApi.update(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: dealerKeys.all })
      }
   })
}

export const useDeleteDealer = () => {
   return useMutation({
      mutationFn: dealerApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: dealerKeys.all })
      }
   })
}

