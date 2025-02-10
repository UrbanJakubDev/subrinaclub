
import { salesManagerAPI } from "@/lib/services/salesManager"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const salesManagerId = searchParams.get('salesManagerId')

    if (!salesManagerId ) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    try {
        const customers = await salesManagerAPI.getCustomersWithAccounts(Number(salesManagerId))
        return NextResponse.json(customers)
    } catch (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
