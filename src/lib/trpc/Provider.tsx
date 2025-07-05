'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { trpc, trpcConfig } from './client'

/**
 * tRPC Provider Component - Verze 2
 * @description Provides tRPC client and React Query to the app
 * @version 2.0.0
 * 
 * This component wraps your app and provides the tRPC client
 * along with React Query for data fetching and caching.
 */
export function TRPCProvider({
  children,
}: {
  children: React.ReactNode
}) {
  /**
   * Create Query Client instance
   * Verze 2: Optimized default configuration
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  )

  /**
   * Create tRPC Client instance
   * Verze 2: Using centralized configuration
   */
  const [trpcClient] = useState(() => trpc.createClient(trpcConfig))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
} 