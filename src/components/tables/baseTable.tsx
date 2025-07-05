'use client'
import React from 'react'
import {
    ColumnDef,
    PaginationState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowSelectionState,
} from '@tanstack/react-table'
import { Card } from '@material-tailwind/react'
import {
    TableProps,
    TableToolbar,
    TableHeader,
    TableRow,
    Pagination,
    IndeterminateCheckbox,
} from './ui'

export default function BaseTable<T>({
    data,
    columns,
    tableName,
    addBtn = false,
    onAddClick,
    enableRowSelection = false,
    onSelectionChange,
    bulkActions,
    updatedTime,
    customToolbarContent,
}: TableProps<T>) {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    })
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const selectionColumn: ColumnDef<T> = {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <IndeterminateCheckbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
        enableSorting: false,
        enableColumnFilter: false,
    }

    const finalColumns = React.useMemo(
        () => (enableRowSelection ? [selectionColumn, ...columns] : columns),
        [columns, enableRowSelection],
    )

    const table = useReactTable({
        columns: finalColumns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        enableRowSelection,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination,
            columnVisibility,
            rowSelection,
        },
    })

    React.useEffect(() => {
        if (onSelectionChange) {
            const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
            onSelectionChange(selectedRows)
        }
    }, [rowSelection, onSelectionChange])

    return (
        <div className="mx-auto w-full">
            <Card className="p-4 text-gray-900 rounded-sm overflow-x-auto">
                <TableToolbar
                    table={table}
                    tableName={tableName}
                    addBtn={addBtn}
                    onAddClick={onAddClick}
                    bulkActions={bulkActions}
                    updatedTime={updatedTime}
                    customToolbarContent={customToolbarContent}
                />

                <table className="text-sm basic-table !text-gray-800">
                    <thead className="border-b">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableHeader
                                key={headerGroup.id}
                                headerGroup={headerGroup}
                                table={table}
                            />
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} row={row} header={table.getHeaderGroups()[0]} />
                        ))}
                    </tbody>
                    <tfoot>
                        {table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id} className="pt-4 font-semibold border-t">
                                {footerGroup.headers.map(footer => (
                                    <td
                                        key={footer.id}
                                        colSpan={footer.colSpan}
                                        className="text-left">
                                        <div className="py-1">
                                            <div className="mx-2">
                                                {flexRender(
                                                    footer.column.columnDef.footer,
                                                    footer.getContext(),
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </Card>

            <Pagination table={table} />

            <div className="mt-2">
                {`Zobrazeno ${table.getRowModel().rows.length} z ${table.getRowCount()} záznamů.`}
            </div>
        </div>
    )
}

// Re-export utilities for convenience
export * from './ui'
