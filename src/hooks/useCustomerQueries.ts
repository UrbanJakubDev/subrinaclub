import { trpc } from '@/lib/trpc/client'

/**
 * Custom hooks for customer tRPC queries
 * Verze 2: Reusable hooks with pre-configured options
 */

/**
 * Get all customers with optional filtering
 * @param options - Query options with active filter
 * @returns tRPC query result with customers data
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useCustomersQuery({ active: true })
 * ```
 */
export function useCustomersQuery(options?: { active?: boolean }) {
  return trpc.customer.getAll.useQuery(
    { active: options?.active },
    {
      staleTime: 60 * 1000, // 1 minute cache
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Enable query by default
      enabled: true,
    }
  )
}

/**
 * Get active customers only
 * @returns tRPC query result with active customers
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useActiveCustomersQuery()
 * ```
 */
export function useActiveCustomersQuery() {
  return useCustomersQuery({ active: true })
}

/**
 * Get inactive customers only
 * @returns tRPC query result with inactive customers
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useInactiveCustomersQuery()
 * ```
 */
export function useInactiveCustomersQuery() {
  return useCustomersQuery({ active: false })
}

/**
 * Get all customers (active and inactive)
 * @returns tRPC query result with all customers
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useAllCustomersQuery()
 * ```
 */
export function useAllCustomersQuery() {
  return useCustomersQuery()
}

/**
 * Update customer status mutation
 * @returns tRPC mutation for updating customer status
 * 
 * @example
 * ```typescript
 * const updateStatus = useUpdateCustomerStatusMutation()
 * updateStatus.mutate({ id: 123, active: false })
 * ```
 */
export function useUpdateCustomerStatusMutation() {
  const utils = trpc.useUtils()
  
  return trpc.customer.updateStatus.useMutation({
    onSuccess: () => {
      // Invalidate and refetch customers queries
      utils.customer.getAll.invalidate()
    },
    onError: (error) => {
      console.error('Failed to update customer status:', error)
    }
  })
} 