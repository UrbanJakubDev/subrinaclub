import { NextResponse } from 'next/server'
import { getBonusById, updateBonusById } from '@/db/queries/bonuses'
import { propTypesResize } from '@material-tailwind/react/types/components/input'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const bonus = await getBonusById(Number(params.id))
    if (!bonus) {
        return NextResponse.json({ message: 'Bonus not found' }, { status: 404 })
    }
    return NextResponse.json(bonus)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const data = await request.json()

    try {
        const bonus = await updateBonusById(Number(params.id), data)
        return NextResponse.json(bonus)
    } catch (error) {
        console.error('Error updating bonus:', error)
        return NextResponse.json({ error: 'Error updating bonus' }, { status: 500 })
    }
}
