import { getAllBonuses } from '@/db/queries/bonuses'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const bonuses = await getAllBonuses()
        return NextResponse.json(bonuses)
    } catch (error) {
        console.error('Error getting bonuses:', error)
        return NextResponse.json({ error: 'Error getting bonuses' }, { status: 500 })
    }
}
