import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'

/**
 * tRPC Context - Verze 2
 * @description Context available in all tRPC procedures
 * @version 2.0.0
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    headers: opts.req.headers,
    // Add more context here as needed (database, auth, etc.)
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * tRPC Instance - Verze 2
 * @description Core tRPC instance with SuperJSON transformer and Zod error formatting
 * @version 2.0.0
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Public Procedure - Verze 2
 * @description Base procedure available to all users
 * @version 2.0.0
 */
export const publicProcedure = t.procedure

/**
 * Router Creator - Verze 2
 * @description Function to create new tRPC routers
 * @version 2.0.0
 */
export const createTRPCRouter = t.router

/**
 * Middleware Creator - Verze 2
 * @description Function to create tRPC middleware
 * @version 2.0.0
 */
export const middleware = t.middleware 