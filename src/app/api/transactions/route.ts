import { NextResponse } from 'next/server'
import { transactionAPI } from '@/lib/services/transaction'
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db/pgDBClient';
import { TransactionRepository } from '@/lib/repositories/TransactionRepository';


// Get all transactions for a customer account
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const transactions = await transactionAPI.getTransactionsForCustomer(customerId)
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
