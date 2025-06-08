import { dealerApi } from "@/lib/api/dealer/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { dealerKeys } from "./queries"
import { Dealer } from "@/types/dealer"
import { toast } from "react-toastify"
import { ApiResponse } from "@/types/types"

export const useCreateDealer = () => {
   return useMutation({
      mutationFn: dealerApi.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: dealerKeys.all })
         toast.success('Velkoobchod byl úspěšně vytvořen.')
      },
      onError: (error: Error) => {
         toast.error('Velkoobchod nebyl úspěšně vytvořen. ' + error.message)
      }
   })
}

export const useUpdateDealer = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Dealer> }) => 
         dealerApi.update(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: dealerKeys.all })
         
         toast.success('Velkoobchod byl úspěšně upraven.')
      },
      onError: () => {
         toast.error('Velkoobchod nebyl úspěšně upraven.')
      }
   })
}

export const useDeleteDealer = () => {
   return useMutation({
      mutationFn: dealerApi.delete,
      // Optimistic update
      onMutate: async (deletedId: number) => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries({ queryKey: dealerKeys.all })
         
         // Snapshot the previous value
         const previousDealers = queryClient.getQueryData<ApiResponse<Dealer[]>>(dealerKeys.list(true))
         
         // Optimistically update to the new value
         if (previousDealers) {
            queryClient.setQueryData<ApiResponse<Dealer[]>>(dealerKeys.list(true), {
               ...previousDealers,
               data: previousDealers.data.filter(dealer => dealer.id !== deletedId)
            })
         }
         
         return { previousDealers }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, id, context) => {
         if (context?.previousDealers) {
            queryClient.setQueryData(dealerKeys.list(true), context.previousDealers)
         }
         toast.error('Velkoobchod nebyl úspěšně smazán.')
      },
      // Always refetch after error or success
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: dealerKeys.all })
         toast.success('Velkoobchod byl úspěšně smazán.')
      }
   })
}

