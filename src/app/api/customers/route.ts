import { customerAPI } from "@/lib/services/customer"
import { NextRequest, NextResponse } from "next/server"


// Get customers belonging to the sales manager
export async function GET(request: NextRequest) {
    try {
        // Get the active parameter from the URL
        const { searchParams } = new URL(request.url)
        const activeParam = searchParams.get('active')
        
        // Convert string to boolean properly
        const isActive = activeParam === null ? undefined : activeParam.toLowerCase() === 'true'
        
        const customers = await customerAPI.getAllCustomers(isActive)
        return NextResponse.json(customers)
    } catch (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        )
    }
}