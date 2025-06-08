
import { bonusApi } from "@/lib/api/bonus/api"
import { ApiResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { Bonus } from "@/types/bonus"
export const bonusKeys = {
    all: ['bonuses'] as const,
    active: () => [...bonusKeys.all, 'active'] as const,
    detail: (id: number) => [...bonusKeys.all, id] as const,
    forSelect: () => [...bonusKeys.all, 'forSelect'] as const,
}

export const useBonuses = () => {
    return useQuery<ApiResponse<Bonus[]>>({
        queryKey: bonusKeys.all,
        queryFn: () => bonusApi.getAll(),
    })
}

export const useActiveBonuses = () => {
    return useQuery<ApiResponse<Bonus[]>>({
        queryKey: bonusKeys.active(),
        queryFn: () => bonusApi.getActive(),
    })
}

export const useBonus = (id: number) => {
    return useQuery<ApiResponse<Bonus>>({
        queryKey: bonusKeys.detail(id),
        queryFn: () => bonusApi.getById(id),
        enabled: !!id,
    })
}

export const useBonusesForSelect = () => {
    return useQuery<ApiResponse<Bonus[]>>({
        queryKey: bonusKeys.forSelect(),
        queryFn: () => bonusApi.getForSelect(),
    })
} 