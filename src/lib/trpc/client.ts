import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { type AppRouter } from '@/server/root'
import superjson from 'superjson'

/**
 * tRPC React Client - Verze 2
 * @description Type-safe React hooks for tRPC procedures
 * @version 2.0.0
 * 
 * This creates the main tRPC client that provides React hooks
 * for all your tRPC procedures with full type safety.
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Get base URL for tRPC requests
 * Verze 2: Environment-aware URL resolution
 * 
 * @returns Base URL for API requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

/**
 * tRPC Client Configuration - Verze 2
 * @description Client configuration with batching and logging
 * @version 2.0.0
 */
export const trpcConfig = {
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      // Optional: add headers
      headers() {
        return {
          // Add any custom headers here
        }
      },
    }),
  ],
  transformer: superjson,
} 