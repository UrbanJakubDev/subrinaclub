import { createTRPCRouter } from './trpc'
import { customerRouter } from './routers/customer'

/**
 * Main tRPC App Router - Verze 2
 * @description Root router that combines all feature routers
 * @version 2.0.0
 */
export const appRouter = createTRPCRouter({
  /**
   * Customer operations router
   * Verze 2: Modern customer management with type safety
   */
  customer: customerRouter,
  
  // TODO: Add other routers here as you migrate them
  // transaction: transactionRouter,
  // salesManager: salesManagerRouter,
  // etc.
})

/**
 * App Router Type Export - Verze 2
 * @description Type definition for the entire tRPC API
 * This type is used by the client to get full type safety
 * @version 2.0.0
 */
export type AppRouter = typeof appRouter 