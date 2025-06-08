'use client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import MyTable from '@/components/tables/ui/baseTable'
import { useRouter } from 'next/navigation'

// Table content with data fetching
export default function AccountsTable({ data, timeInfo }: { data: any[]; timeInfo: string }) {
    const router = useRouter()
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'customer.fullName',
                header: 'Jméno',
                filterFn: 'auto',
                cell: ({ row }) => (
                    <a
                        href={`/accounts/${row.original.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline">
                        {row.original.customer.fullName}
                    </a>
                ),
            },
            {
                accessorKey: 'customer.registrationNumber',
                header: 'Registrační číslo',
            },
            {
                accessorKey: 'lifetimePoints',
                header: 'Klubové konto',
                filterFn: 'auto',
            },
            {
                accessorKey: 'currentYearPoints',
                header: 'Roční konto',
                filterFn: 'auto',
            },
            {
                id: 'savingPeriods',
                header: 'Akce',
                cell: ({ row }) => (
                    <a
                        href={`/accounts/${row.original.id}/saving-periods`}
                        className="text-blue-600 hover:text-blue-800 hover:underline">
                        Šetřící období
                    </a>
                ),
            },
        ],
        [],
    )

    return (
        <MyTable
            data={data}
            columns={columns as ColumnDef<unknown>[]}
            tableName="Seznam účtů"
            timeInfo={timeInfo}
        />
    )
}
