import { NextResponse } from 'next/server'
import { transactionAPI } from '@/lib/services/transaction'
import { revalidatePath } from 'next/cache'

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
    try {
        const id = Number(params.id)

        // Get transaction details before deletion to access customerId
        const { searchParams } = new URL(request.url)
        const customerId = searchParams.get('customerId')

        await transactionAPI.deleteTransaction(id)

        // Invalidate customer stats page if customerId is available
        if (customerId) {
            revalidatePath(`/customers/${customerId}/stats`)
            revalidatePath(`/customers/${customerId}`)
        }

        return NextResponse.json({ message: 'Transaction deleted successfully' })
    } catch (error) {
        console.error('Error deleting transaction:', error)
        return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 })
    }
}
