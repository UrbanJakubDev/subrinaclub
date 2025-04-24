'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Link as LucideLink } from 'lucide-react'
import { useAccounts } from '@/lib/queries/account/queries'
import React, { Suspense } from 'react'
import Loader from '@/components/ui/loader'
import MyTable from '@/components/tables/ui/baseTable'
import NoData from '@/components/ui/noData'

// Define interface without causing name conflict
interface AccountData {
    id: string | number
    customer: {
        fullName: string
        registrationNumber: string
    }
    lifetimePoints?: number
    currentYearPoints?: number
}

// Table content with data fetching
export default function AccountTableWithData() {
    // All hooks must be called at the top level of the component
    const { data: accounts, isLoading } = useAccounts()
    const [data, setData] = React.useState<AccountData[]>([])

    // useEffect for updating data from accounts
    React.useEffect(() => {
        if (accounts) {
            setData(accounts as unknown as AccountData[])
        }
    }, [accounts])

    const columns = React.useMemo<ColumnDef<AccountData>[]>(
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
        <Suspense fallback={<Loader />}>
            <MyTable
                data={data}
                columns={columns as ColumnDef<unknown>[]}
                tableName="Seznam účtů"
                timeInfo={new Date().toLocaleString()}
            />
        </Suspense>
    )
}