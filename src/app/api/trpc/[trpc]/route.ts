import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest } from 'next/server'

import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/server/trpc'

/**
 * tRPC API Route Handler - Verze 2
 * @description Handles all tRPC requests in Next.js App Router
 * @version 2.0.0
 * 
 * This file handles all tRPC requests for the application.
 * It processes both GET and POST requests and routes them to the appropriate tRPC procedures.
 * 
 * @route /api/trpc/[trpc]
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : undefined,
  })

/**
 * Export handlers for both GET and POST requests
 * Verze 2: Support for all HTTP methods used by tRPC
 */
export { handler as GET, handler as POST } 