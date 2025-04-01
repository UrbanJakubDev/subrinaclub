import { savingPeriodApi } from "@/lib/api/savingPeriod/api"
import { queryClient } from "@/lib/config/query"
import { useMutation } from "@tanstack/react-query"
import { savingPeriodKeys } from "./queries"
import { SavingPeriod } from "@/types/types"

export const useCreateSavingPeriod = () => {
   return useMutation({
      mutationFn: savingPeriodApi.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.all })
      }
   })
}

export const useUpdateSavingPeriod = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<SavingPeriod> }) => 
         savingPeriodApi.update(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.all })
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.detail(variables.id) })
      }
   })
}

export const useDeleteSavingPeriod = () => {
   return useMutation({
      mutationFn: savingPeriodApi.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.all })
      }
   })
}

export const useSoftDeleteSavingPeriod = () => {
   return useMutation({
      mutationFn: savingPeriodApi.softDelete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.all })
      }
   })
}

export const useCloseSavingPeriod = () => {
   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: { createNewPeriod: boolean, startYear?: number, startQuarter?: number } }) => 
         savingPeriodApi.closePeriod(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.all })
         queryClient.invalidateQueries({ queryKey: savingPeriodKeys.detail(variables.id) })
         // Also invalidate account-related queries since closing a period might affect accounts
         queryClient.invalidateQueries({ queryKey: ['accounts'] })
      }
   })
} 