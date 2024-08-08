import {
    addTransaction,
    getQuarterPointsByAccountIdAndYear,
    getTransactionById,
    getTransactionsByAccountId,
    removeTransactionById,
    updateTransactionById,
} from '@/db/queries/transactions'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const transactionId = searchParams.get('transactionId')
    const year = searchParams.get('year')
    const type = searchParams.get('type')

    if (transactionId) {
        const transaction = await getTransactionById(Number(transactionId))
        return NextResponse.json(transaction)
    }

    if (accountId && year && type === 'quarter') {
        const transactions = await getQuarterPointsByAccountIdAndYear(
            Number(accountId),
            Number(year),
        )
        return NextResponse.json(transactions)
    }

    const transaction = await getTransactionsByAccountId(Number(accountId))

    return NextResponse.json(transaction)
}

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const transaction = await addTransaction(body)
        return NextResponse.json(transaction)
    } catch (error) {
        console.error('Error creating transaction:', error)
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 })
    }
}

// PUT /api/transactions?transactionId=1
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    const body = await request.json()

    try {
        const transaction = await updateTransactionById(Number(transactionId), body)
        return NextResponse.json(transaction)
    } catch (error) {
        console.error('Error updating transaction:', error)
        return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 })
    }
}

// DELETE /api/transactions?transactionId=1
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    const transaction = await removeTransactionById(Number(transactionId))

    return NextResponse.json({ message: 'Transaction deleted' })
}
