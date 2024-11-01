import { createBonus, getAllBonuses, getBonusById } from '@/lib/db/queries/bonuses'
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

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const bonus = await createBonus(body)
        return NextResponse.json(bonus)
    } catch (error) {
        console.error('Error creating bonus:', error)
        return NextResponse.json({ error: 'Error creating bonus' }, { status: 500 })
    }
}