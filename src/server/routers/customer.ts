import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { CustomerServiceV2 } from '@/lib/services/customer/serviceV2'
import { CustomerRepositoryV2 } from '@/lib/repositories/CustomerRepositoryV2'
import { prisma } from '@/lib/db/pgDBClient'

// Initialize service with repository - Verze 2
const customerRepository = new CustomerRepositoryV2(prisma)
const customerService = new CustomerServiceV2(customerRepository)

/**
 * Customer tRPC Router - Verze 2
 * @description Type-safe customer operations with automatic validation
 * @version 2.0.0
 */
export const customerRouter = createTRPCRouter({
  /**
   * Get all customers with optional filtering
   * Verze 2: Replace REST API endpoint with type-safe tRPC procedure
   * 
   * @procedure getAll
   * @input { active?: boolean } - Optional active status filter
   * @output CustomerListResponseV2[] - Array of customers with relations
   * 
   * @example
   * ```typescript
   * // Frontend usage:
   * const { data: customers } = trpc.customer.getAll.useQuery({ active: true })
   * ```
   */
  getAll: publicProcedure
    .input(
      z.object({
        active: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const customers = await customerService.getAllCustomers(input.active)
        
        // Verze 2: Add timestamp to response for data validation display
        return {
          data: customers,
          timestamp: new Date().toISOString(),
          count: customers.length
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch customers',
          cause: error,
        })
      }
    }),

  /**
   * Update customer's active status
   * Verze 2: Type-safe mutation for customer status updates
   * 
   * @procedure updateStatus
   * @input { id: number, active: boolean } - Customer ID and new active status
   * @output CustomerBasicV2 - Updated customer basic info
   * 
   * @example
   * ```typescript
   * // Frontend usage:
   * const updateStatus = trpc.customer.updateStatus.useMutation({
   *   onSuccess: () => {
   *     trpc.customer.getAll.invalidate()
   *   }
   * })
   * updateStatus.mutate({ id: 123, active: false })
   * ```
   */
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number().positive('Customer ID must be positive'),
        active: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await customerService.updateCustomerStatus(input.id, input.active)
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
          })
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update customer status',
          cause: error,
        })
      }
    }),
}) 