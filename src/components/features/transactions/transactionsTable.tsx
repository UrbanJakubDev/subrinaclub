'use client'
import { ColumnDef } from '@tanstack/react-table'
import MyTable from '../../tables/ui/baseTable'
import formatThousandDelimiter from '@/lib/utils/formatFncs'
import { Transaction } from '@/types/transaction'
import TransactionFormComponent from '@/components/features/transactions/transactionFormComponent'
import Skeleton from '@/components/ui/skeleton'
import React from 'react'
import { formatDateToCz } from '@/lib/utils/dateFnc'
import { useTransactionsByAccount } from '@/lib/queries/transaction/queries'
import TableActions from '@/components/tables/ui/TableActions'

type TransactionsTableProps = {
    tableName?: string
    accountId: number
    onEdit: (transaction: Transaction) => void
    onDelete: (transactionId: number) => void
    timeInfo?: string
}

export default function TransactionsTable({
    tableName = 'Transakce',
    accountId,
    onEdit,
    onDelete,
    timeInfo,
}: TransactionsTableProps) {
    const { data: transactions, isLoading } = useTransactionsByAccount(accountId) as any

    // Column definitions
    const columns = React.useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID transakce',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'year',
                header: 'Rok',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'quarter',
                header: 'Kvartál',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'points',
                header: 'Body',
                footer: info => {
                    const total = info.table
                        .getFilteredRowModel()
                        .rows.reduce((sum, row) => sum + row.getValue<number>('points'), 0)
                    return `${total}`
                },
            },
            {
                accessorKey: 'acceptedBonusOrder',
                header: 'Příjetí objednávky bonusu',
                cell: info => formatDateToCz(info.getValue() as string | null),
            },
            {
                accessorKey: 'sentBonusOrder',
                header: 'Bonus odeslán',
                cell: info => formatDateToCz(info.getValue() as string | null),
            },
            {
                accessorKey: 'bonus.name',
                header: 'Jméno bonusu',
            },
            {
                accessorKey: 'bonusPrice',
                header: 'Cena bonusu',
                enableColumnFilter: false,
                footer: info => {
                    const total = info.table
                        .getFilteredRowModel()
                        .rows.reduce(
                            (sum, row) => sum + (row.getValue<number>('bonusPrice') || 0),
                            0,
                        )
                    return formatThousandDelimiter(total)
                },
            },
            {
                accessorKey: 'action',
                header: 'Akce',
                enableColumnFilter: false,
                cell: info => (
                    <TableActions
                        record={info.row.original}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ),
            },
        ],
        [onEdit, onDelete],
    )

    if (isLoading) {
        return <Skeleton type="table" />
    }

    return (
        <div className="space-y-4">
            {!transactions?.length ? (
                <div className="p-4 text-center text-gray-500">Žádné transakce k zobrazení</div>
            ) : (
                <MyTable
                    data={transactions}
                    columns={columns}
                    tableName={tableName}
                    timeInfo={timeInfo ?? new Date().toLocaleString()}
                />
            )}

            <TransactionFormComponent accountId={accountId} />
        </div>
    )
}
