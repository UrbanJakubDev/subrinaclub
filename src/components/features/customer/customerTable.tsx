'use client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import MyTable from '../../tables/ui/baseTable'
import { Chip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import formatThousandDelimiter from '@/lib/utils/formatFncs'
import ActionButtons from '@/components/tables/ui/actionButtons'
import StatusChip from '@/components/tables/ui/statusChip'
import StatusIcon from '@/components/tables/ui/statusIcon'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useUpdateCustomer } from '@/lib/queries/customer/mutations'

interface Customer {
    id: string
    active: boolean
    registrationNumber: string
    fullName: string
    salonName: string
    address?: string
    town?: string
    psc?: string
    phone?: string
    ico?: string
    salesManager?: {
        fullName: string
    }
    dealer?: {
        fullName: string
    }
    account?: {
        currentYearPoints: number
        lifetimePoints: number
        lifetimePointsCorrection: number
        lifetimePointsCorrected: number
        savingPeriodAvailablePoints: number
    }
}

type Props = {
    defaultData: Customer[]
    detailLinkPath?: string
    timeInfo?: string
    refresh?: () => void
}

export default function CustomerTable({ defaultData, detailLinkPath, timeInfo, refresh }: Props) {
    const router = useRouter()
    const tableName = 'Přehled zákazníků'
    const [selectedRows, setSelectedRows] = React.useState<Customer[]>([])
    // Use ref to track previous selection to prevent infinite updates
    const previousSelectionRef = React.useRef<Customer[]>([])

    // Initialize the mutation
    const updateCustomerMutation = useUpdateCustomer()

    // Handle selected rows
    const handleSelectionChange = (rows: Customer[]) => {
        // Convert to strings for comparison to avoid reference issues
        const currentSelection = JSON.stringify(rows)
        const prevSelection = JSON.stringify(previousSelectionRef.current)

        // Only update state if selection has actually changed
        if (currentSelection !== prevSelection) {
            previousSelectionRef.current = rows
            setSelectedRows(rows)
        }
    }

    // Function to clear row selection - will be called after successful operations
    const clearRowSelection = () => {
        setSelectedRows([])
    }

    // Generic function to handle customer activation/deactivation
    const handleCustomerStatusChange = async (
        selectedRows: Customer[], 
        setActive: boolean, 
        filterFn: (customer: Customer) => boolean
    ) => {
        const filteredCustomers = selectedRows.filter(filterFn)
        const action = setActive ? 'aktivovat' : 'deaktivovat'
        const actionVerb = setActive ? 'Aktivace' : 'Deaktivace'
        const actionPast = setActive ? 'Aktivováno' : 'Deaktivováno'
        const actionSuccess = setActive ? 'aktivováno' : 'deaktivováno'
        
        if (filteredCustomers.length === 0) {
            toast.error(`Žádný z vybraných zákazníků nelze ${action}.`)
            return
        }

        const confirmAction = window.confirm(
            `Opravdu chcete ${action} ${filteredCustomers.length} zákazníků?`,
        )
        if (!confirmAction) return

        const loadingToastId = toast.loading(`${actionVerb} ${filteredCustomers.length} zákazníků...`)

        try {
            const results = await Promise.allSettled(
                filteredCustomers.map(customer =>
                    updateCustomerMutation.mutateAsync({
                        id: Number(customer.id),
                        data: { active: setActive },
                    }),
                ),
            )

            const succeeded = results.filter(r => r.status === 'fulfilled').length
            const failed = results.filter(r => r.status === 'rejected').length

            if (failed === 0) {
                toast.update(loadingToastId, {
                    render: `Úspěšně ${actionSuccess} ${succeeded} zákazníků`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                })
                clearRowSelection()
                refresh?.()
            } else {
                toast.update(loadingToastId, {
                    render: `${actionPast} ${succeeded} zákazníků, ${failed} se nezdařilo`,
                    type: 'warning',
                    isLoading: false,
                    autoClose: 5000,
                })

                results
                    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
                    .forEach(result => {
                        toast.error(result.reason.message)
                    })
            }
        } catch (error) {
            console.error(`Error ${action}ing customers:`, error)
            toast.update(loadingToastId, {
                render: `Nepodařilo se ${action} zákazníky. Zkuste to prosím znovu.`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            })
        }
    }

    // Handler functions that use the generic function
    const handleDeactivateCustomers = (rows: Customer[]) => 
        handleCustomerStatusChange(
            rows, 
            false, 
            customer => customer.active
        )
    
    const handleActivateCustomers = (rows: Customer[]) => 
        handleCustomerStatusChange(
            rows, 
            true, 
            customer => !customer.active
        )

    // Define bulk actions
    const bulkActions = [
        {
            label: 'Deaktivovat vybrané',
            onClick: handleDeactivateCustomers,
        },
        {
            label: 'Aktivovat vybrané',
            onClick: handleActivateCustomers,
        },
    ]

    // Render Chip
    const ChipComponent = React.useMemo(() => {
        return ({ value }: { value: any }) => {
            if (value > 2500) {
                return (
                    <div className="flex items-center">
                        <Chip value={value} className="text-center bg-royal-gold text-gray-900" />
                    </div>
                )
            } else if (value > 1200) {
                return (
                    <div className="flex items-center">
                        <Chip
                            value={value}
                            className="text-center bg-chrome-silver text-gray-900"
                        />
                    </div>
                )
            } else {
                return value
            }
        }
    }, [])

    // Change the data registrationNumber to a string
    defaultData.forEach(row => {
        row.registrationNumber = row.registrationNumber.toString()
    })

    // Column definitions
    const columns = React.useMemo<ColumnDef<Customer>[]>(
        () => [
            {
                accessorKey: 'active',
                header: 'Status',
                filterFn: 'auto',
                accessorFn: (row: Customer) => {
                    return row.active
                },
                cell: ({ getValue }) => <StatusIcon active={getValue() as boolean} />,
            },
            {
                accessorKey: 'registrationNumber',
                header: 'R.Č.',
                filterFn: 'auto',
            },
            {
                accessorKey: 'fullName',
                header: 'Jméno',
                filterFn: 'auto',
                cell: ({ row }) => (
                    <Link
                        href={`/customers/${row.original.id}/stats`}
                        className="text-blue-600 hover:text-blue-800 hover:underline">
                        {row.original.fullName}
                    </Link>
                ),
            },
            {
                accessorKey: 'salonName',
                header: 'Salón',
            },
            {
                accessorKey: 'address',
                header: 'Adresa',
            },
            {
                accessorKey: 'town',
                header: 'Město',
            },
            {
                accessorKey: 'psc',
                header: 'PSČ',
            },
            {
                accessorKey: 'phone',
                header: 'Telefon',
            },
            {
                accessorKey: 'ico',
                header: 'IČ',
            },
            {
                accessorFn: row => row.salesManager?.fullName ?? '',
                header: 'Obchodní zástupce',
                filterFn: 'includesString',
            },
            {
                accessorKey: 'dealer.fullName',
                header: 'Velkoobchod',
                filterFn: 'includesString',
            },
            {
                accessorKey: 'account.currentYearPoints',
                header: 'Roční konto',
                cell: info => info.getValue(),
                footer: info => {
                    const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => {
                        const points = row.original.account?.currentYearPoints ?? 0
                        return sum + points
                    }, 0)
                    return `${formatThousandDelimiter(total)}`
                },
            },
            {
                accessorKey: 'account.lifetimePointsCorrected',
                header: 'Klubové konto',
                cell: info => <ChipComponent value={info.getValue()} />,
                footer: info => {
                    const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => {
                        const points = row.original.account?.lifetimePointsCorrected ?? 0
                        return sum + points
                    }, 0)
                    return `${formatThousandDelimiter(total)}`
                },
            },
            {
                accessorKey: 'account.lifetimePointsCorrection',
                header: 'Korekce',
            },
            {
                accessorKey: 'account.savingPeriodAvailablePoints',
                header: 'Průběžné konto',
                footer: info => {
                    const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => {
                        const points = row.original.account?.savingPeriodAvailablePoints ?? 0
                        return sum + points
                    }, 0)
                    return `${formatThousandDelimiter(total)}`
                },
            },
            {
                accessorKey: 'hasCurrentYearPoints',
                header: 'Aktivní',
                accessorFn: (row: Customer) => {
                    const lifetimePoints = row.account?.currentYearPoints ?? 0
                    return lifetimePoints > 0
                },
                cell: ({ getValue }) => <StatusChip status={getValue() as boolean} />,
                filterFn: (
                    row: { getValue: (columnId: string) => any },
                    columnId: string,
                    filterValue: string,
                ) => {
                    const cellValue = row.getValue(columnId)
                    const boolFilterValue = filterValue === 'true'
                    return filterValue === '' || cellValue === boolFilterValue
                },
            },
            {
                accessorKey: 'action',
                header: '',
                cell: ({ row }) => (
                    <ActionButtons id={row.original.id} detailLinkPath={detailLinkPath} />
                ),
                enableColumnFilter: false,
                enableSorting: false,
            },
        ],
        [],
    )

    const [data, setData] = React.useState(() => [...defaultData])

    // Add this useEffect to update data when defaultData changes
    React.useEffect(() => {
        // Only update data if defaultData has actually changed (by reference)
        const dataStr = JSON.stringify(defaultData)
        const currentDataStr = JSON.stringify(data)

        if (dataStr !== currentDataStr) {
            setData([...defaultData])
            // Clear selection when data is refreshed
            setSelectedRows([])
        }
    }, [defaultData, data])

    return (
        <>
            <MyTable<Customer>
                {...{
                    data,
                    columns,
                    tableName,
                    timeInfo: 'Last loaded: ' + timeInfo,
                    addBtn: true,
                    onAddClick: () => {
                        router.push(`${detailLinkPath}/new`)
                    },
                    enableRowSelection: true,
                    onSelectionChange: handleSelectionChange,
                    bulkActions: bulkActions,
                }}
            />
        </>
    )
}
