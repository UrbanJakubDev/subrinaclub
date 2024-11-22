import { NextResponse } from 'next/server';
import { transactionAPI } from '@/lib/services/transaction';

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
    try {
        const id = Number(params.id);
        await transactionAPI.deleteTransaction(id);
        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
    }
}
