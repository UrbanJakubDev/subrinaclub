import { customerAPI } from "@/lib/services/customer"
import { NextRequest, NextResponse } from "next/server"


// Get customers belonging to the sales manager
export async function GET(request: NextRequest) {
    try {
        // Get the active parameter from the URL
        const { searchParams } = new URL(request.url)
        const activeParam = searchParams.get('active')
        
        // Convert string parameter to boolean if present
        const active = activeParam ? activeParam === 'true' : undefined

        const customers = await customerAPI.getAllCustomers(active)
        return NextResponse.json(customers)
    } catch (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        )
    }
}