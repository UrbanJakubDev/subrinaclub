'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ColumnDef } from '@tanstack/react-table'
import ActionButtons from '@/components/tables/ui/TableActions'
import MyTable from '@/components/tables/ui/baseTable'
import { queryClient } from '@/lib/config/query'
import { useDeleteBonus } from '@/lib/queries/bonus/mutations'
import TableActions from '@/components/tables/ui/TableActions'
import { Bonus } from '@/types/bonus'



type Props = {
    data: Bonus[]
    detailLinkPath?: string
    timeInfo?: string
}

export default function BonusesTable({ data, detailLinkPath, timeInfo }: Props) {
    const router = useRouter()
    const { mutateAsync: deleteBonus } = useDeleteBonus()

    const handleAddClick = React.useCallback(() => {
        router.push('/dictionaries/bonuses/new')
    }, [router])

    const handleDelete = React.useCallback(
        (id: string | number) => {
            deleteBonus(Number(id))
        },
        [deleteBonus],
    )

    const handleEdit = React.useCallback(
        (record: Bonus) => {
            router.push(`${detailLinkPath}/${record.id}`)
        },
        [router, detailLinkPath],
    )

    const columns = React.useMemo<ColumnDef<Bonus>[]>(
        () => [
            { accessorKey: 'id', header: 'ID', filterFn: 'auto' },
            { accessorKey: 'name', header: 'Název', filterFn: 'auto' },
            { accessorKey: 'description', header: 'Popis' },
            { accessorKey: 'points', header: 'Body' },
            { accessorKey: 'price', header: 'Hodnota' },
            {
                accessorKey: 'action',
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
        [detailLinkPath],
    )


    return (
        <MyTable
            data={data}
            columns={columns}
            tableName="Seznam bonusů"
            addBtn={true}
            onAddClick={handleAddClick}
            timeInfo={timeInfo || ''}
        />
    )
}
