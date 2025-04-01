import { dealerApi } from "@/lib/api/dealer/api"
import { Dealer } from "@/types/dealer"
import { ApiResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

export const dealerKeys = {
    all: ['dealers'] as const,
    list: (active: boolean) => [...dealerKeys.all, { active }] as const,
    detail: (id: number) => [...dealerKeys.all, id] as const,
}

export const useDealers = (active: boolean) => {
    return useQuery<ApiResponse<Dealer[]>>({
        queryKey: dealerKeys.list(active),
        queryFn: () => dealerApi.getAll(),
    })
}


export const useDealer = (id: number) => {
    return useQuery<ApiResponse<Dealer>>({
        queryKey: dealerKeys.detail(id),
        queryFn: () => dealerApi.getById(id),
        enabled: !!id,
    })
}

export const useDealersForSelect = () => {
    return useQuery<ApiResponse<Dealer[]>>({
        queryKey: dealerKeys.all,
        queryFn: () => dealerApi.getForSelect(),
    })
}
