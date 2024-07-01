import { NextResponse } from 'next/server';
import { getAccountById, updateAccountById } from '../../../db/queries/accounts';

// GET Account by ID
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const account = await getAccountById(Number(id));

    return NextResponse.json(account);
}

// Update Account by ID
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    const updatedAccount = await updateAccountById(Number(id), body);

    return NextResponse.json(updatedAccount);
}
