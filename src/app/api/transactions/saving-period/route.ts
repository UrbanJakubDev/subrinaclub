import { getTransactionsByAccountIdAndDate } from '@/db/queries/transactions'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    try {
        const transactions = await getTransactionsByAccountIdAndDate(Number(accountId), from, to)
        return NextResponse.json(transactions)
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 })
    }
}
