import { salesManagerApi } from "@/lib/api/salesManager/api"
import { SalesManager } from "@/types/salesmanager"
import { ApiResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

export const salesManagerKeys = {
    all: ['salesManagers'] as const,
    list: (active: boolean) => [...salesManagerKeys.all, { active }] as const,
    detail: (id: number) => [...salesManagerKeys.all, id] as const,
}

export const useSalesManagers = (active: boolean) => {
    return useQuery<ApiResponse<SalesManager[]>>({
        queryKey: salesManagerKeys.list(active),
        queryFn: () => salesManagerApi.getAll(),
    })
}

export const useSalesManager = (id: number) => {
    return useQuery<ApiResponse<SalesManager>>({
        queryKey: salesManagerKeys.detail(id),
        queryFn: () => salesManagerApi.getById(id),
        enabled: !!id,
    })
}

export const useSalesManagersForSelect = () => {
    return useQuery<ApiResponse<SalesManager[]>>({
        queryKey: salesManagerKeys.all,
        queryFn: () => salesManagerApi.getForSelect(),
    })
} 