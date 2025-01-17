import { salesManagerAPI } from "@/lib/services/salesManager"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const salesManagerId = searchParams.get('salesManagerId')
    const year = searchParams.get('year')

    if (!salesManagerId || !year) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    try {
        const customersInfo = await salesManagerAPI.getCustomersCountsInfo(Number(salesManagerId), Number(year))
        return NextResponse.json(customersInfo)
    } catch (error) {
        console.error('Error fetching customers info:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
