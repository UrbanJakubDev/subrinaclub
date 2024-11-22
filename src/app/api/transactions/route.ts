import { NextResponse } from 'next/server';
import { transactionAPI } from '@/lib/services/transaction';


// Get all transactions for a customer account
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    if (!accountId) {
        return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
    const transactions = await transactionAPI.getTransactionsForCustomer(Number(accountId))
    return NextResponse.json(transactions)
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const transaction = await transactionAPI.createTransaction(body);
        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const transaction = await transactionAPI.updateTransaction(body);
        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
    }
}
