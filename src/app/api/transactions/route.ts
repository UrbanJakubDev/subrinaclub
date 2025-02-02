import { NextResponse } from 'next/server';
import { transactionAPI } from '@/lib/services/transaction';


/**
 * Retrieves all transactions for a specified customer account
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing transactions or error message
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    if (!accountId) {
        return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
    const transactions = await transactionAPI.getTransactionsForCustomer(Number(accountId))
    return NextResponse.json(transactions)
}

/**
 * Creates a new transaction
 * @param {Request} request - The incoming HTTP request containing transaction data
 * @returns {Promise<NextResponse>} JSON response containing the created transaction or error message
 */
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

/**
 * Updates an existing transaction
 * @param {Request} request - The incoming HTTP request containing updated transaction data
 * @returns {Promise<NextResponse>} JSON response containing the updated transaction or error message
 */
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
