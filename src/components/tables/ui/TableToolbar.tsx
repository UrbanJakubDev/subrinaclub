import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/button'
import { timestampToDate } from '@/lib/utils/dateFnc'
import { TableToolbarProps } from './types'

const TableToolbar = <T,>({
    table,
    tableName,
    addBtn,
    onAddClick,
    bulkActions,
    updatedTime,
    customToolbarContent,
}: TableToolbarProps<T>) => {
    const selectedRows = table.getSelectedRowModel().rows
    const hasSelectedRows = selectedRows.length > 0

    const exportData = (all = false) => {
        const timestamp = timestampToDate(new Date().toISOString())
        const XLSX = require('xlsx')

        // Get visible columns
        const visibleColumns = table.getAllColumns().filter(column => column.getIsVisible())

        // Get headers from visible columns
        const headers = visibleColumns.map(column => {
            const header = column.columnDef.header
            return typeof header === 'function' ? column.id : header
        })

        // Get rows based on whether we want all or filtered
        const rowsToExport = all ? table.getCoreRowModel().rows : table.getRowModel().rows

        // Transform row data
        const data = rowsToExport.map(row => {
            return visibleColumns.map(column => {
                const cellValue = row.getValue(column.id)
                // Handle different types of cell values
                if (cellValue === null || cellValue === undefined) return ''
                if (typeof cellValue === 'object') return JSON.stringify(cellValue)
                return cellValue
            })
        })

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])

        // Create workbook
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

        // Write file
        XLSX.writeFile(wb, `${tableName}-${timestamp}${all ? '-vše' : ''}.xlsx`)
    }

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between gap-16">
                <div>
                    <h1 className="text-2xl font-semibold">{tableName}</h1>
                    <p className="text-sm text-gray-500">
                        {updatedTime
                            ? `🕐 Poslední aktualizace: ${new Date(updatedTime).toLocaleString('cs-CZ')}`
                            : ''}
                    </p>
                </div>
                {customToolbarContent && (
                    <div className="mt-4 flex justify-start grow">{customToolbarContent}</div>
                )}
                <div className="flex gap-2 py-2">
                    {addBtn && (
                        <Button 
                            size="sm" 
                            icon={faPlus} 
                            onClick={onAddClick}
                        >
                            Přidat
                        </Button>
                    )}
                    <Button
                        onClick={() => table.reset()}
                        variant="ghost"
                        size="sm"
                        icon={faRotate}
                        title="Obnovit"
                    />
                    <Button
                        onClick={() => exportData(false)}
                        variant="ghost"
                        size="sm"
                        icon={faDownload}
                    >
                        Export
                    </Button>
                    <Button
                        onClick={() => exportData(true)}
                        variant="ghost"
                        size="sm"
                        icon={faDownload}
                    >
                        Export Vše
                    </Button>
                </div>
            </div>
            {hasSelectedRows && bulkActions && (
                <div className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">
                        Selected {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'}
                    </span>
                    <div className="flex gap-2">
                        {bulkActions.map((action, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    action.onClick(selectedRows.map(row => row.original))
                                }>
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TableToolbar
