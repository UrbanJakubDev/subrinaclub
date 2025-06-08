'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import MyTable from '../../tables/ui/baseTable'
import { useDeleteDealer } from '@/lib/queries/dealer/mutations'
import TableActions from '../../tables/ui/TableActions'
import { Dealer } from '@/types/dealer'

type DealerTableProps = {
    data: Dealer[]
    detailLinkPath?: string
    timeInfo?: string
}

export function DealerTable({ data, detailLinkPath, timeInfo }: DealerTableProps) {
    const router = useRouter()
    const { mutate: deleteDealer } = useDeleteDealer()

    const handleAdd = React.useCallback(() => {
        router.push('/dictionaries/dealers/new')
    }, [router])

    const handleDelete = React.useCallback(
        (id: string | number) => {
            deleteDealer(Number(id))
        },
        [deleteDealer],
    )

    const handleEdit = React.useCallback(
        (record: Dealer) => {
            router.push(`${detailLinkPath}/${record.id}`)
        },
        [router, detailLinkPath],
    )

    const columns = React.useMemo<ColumnDef<Dealer>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'fullName',
                header: 'Jméno',
                filterFn: 'auto' as any,
            },
            {
                accessorKey: 'note',
                header: 'Poznámka',
                filterFn: 'auto' as any,
            },
            {
                id: 'actions',
                header: 'Akce',
                cell: ({ row }) => (
                    <TableActions
                        record={row.original}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ),
                enableColumnFilter: false,
            },
        ],
        [detailLinkPath, handleDelete],
    )

    return (
        <MyTable
            data={data}
            columns={columns}
            addBtn
            onAddClick={handleAdd}
            tableName={''}
            timeInfo={timeInfo || ''}
        />
    )
}
