import { bonusApi } from "@/lib/api/bonus/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { bonusKeys } from "./queries"
import { Bonus } from "@/types/bonus"

export const useCreateBonus = () => {
   return useMutation({
      mutationFn: bonusApi.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: bonusKeys.all })
         queryClient.invalidateQueries({ queryKey: bonusKeys.active() })
         queryClient.invalidateQueries({ queryKey: bonusKeys.forSelect() })
      }
   })
}

export const useUpdateBonus = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Bonus> }) => 
         bonusApi.update(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: bonusKeys.all })
         queryClient.invalidateQueries({ queryKey: bonusKeys.detail(variables.id) })
         queryClient.invalidateQueries({ queryKey: bonusKeys.active() })
         queryClient.invalidateQueries({ queryKey: bonusKeys.forSelect() })
      }
   })
}

export const useDeleteBonus = () => {
   return useMutation({
      mutationFn: bonusApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: bonusKeys.all })
         queryClient.invalidateQueries({ queryKey: bonusKeys.active() })
         queryClient.invalidateQueries({ queryKey: bonusKeys.forSelect() })
      }
   })
}

export const useSoftDeleteBonus = () => {
   return useMutation({
      mutationFn: bonusApi.softDelete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: bonusKeys.all })
         queryClient.invalidateQueries({ queryKey: bonusKeys.active() })
         queryClient.invalidateQueries({ queryKey: bonusKeys.forSelect() })
      }
   })
} 