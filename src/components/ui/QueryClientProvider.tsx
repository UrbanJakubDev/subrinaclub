'use client'
import { QueryClient, QueryClientProvider as RQProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryClientProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return <RQProvider client={queryClient}>{children}</RQProvider>
}
