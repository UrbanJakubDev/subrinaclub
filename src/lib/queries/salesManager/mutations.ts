import { salesManagerApi } from "@/lib/api/salesManager/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { salesManagerKeys } from "./queries"
import { SalesManager } from "@/types/salesmanager"
import { toast } from "react-toastify"

export const useCreateSalesManager = () => {
   return useMutation({
      mutationFn: salesManagerApi.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: salesManagerKeys.all })
         toast.success('Prodejce byl úspěšně vytvořen.')
      },
      onError: (error) => {
         toast.error('Nastala chyba při vytváření prodejce.' + error)
      }
   })
}

export const useUpdateSalesManager = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<SalesManager> }) => 
         salesManagerApi.update(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: salesManagerKeys.all })
         toast.success('Prodejce byl úspěšně upraven.')
      },
      onError: (error) => {
         toast.error('Nastala chyba při úpravě prodejce.' + error)
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