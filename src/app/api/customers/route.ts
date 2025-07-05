import { customerAPI } from '@/lib/services/customer'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/customers
 *
 * Retrieves a list of customers with optional filtering by active status.
 *
 * @param request - NextRequest object containing the request details
 * @param request.url - The request URL which may include query parameters
 * @param request.url.searchParams.active - Optional boolean parameter to filter customers by active status
 *
 * @returns Promise<NextResponse> - JSON response containing:
 *   - Success: Array of customer objects
 *   - Error: Error object with message
 *
 * @example
 * GET /api/customers - Returns all customers
 * GET /api/customers?active=true - Returns only active customers
 * GET /api/customers?active=false - Returns only inactive customers
 *
 * @throws {Error} When customer data cannot be retrieved from the database
 */
export async function GET(request: NextRequest) {
    try {
        // Get the active parameter from the URL
        const { searchParams } = new URL(request.url)
        const activeParam = searchParams.get('active')

        // Convert string to boolean properly
        const isActive = activeParam === null ? undefined : activeParam.toLowerCase() === 'true'

        const customers = await customerAPI.getAllCustomers(isActive)
        return NextResponse.json(customers, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            },
        })
    } catch (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                },
            },
        )
    }
}
