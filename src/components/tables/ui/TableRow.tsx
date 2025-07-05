import React from 'react'
import { flexRender } from '@tanstack/react-table'
import { TableRowProps } from './types'

const TableRow = <T,>({ row, header }: TableRowProps<T>) => {
    return (
        <tr key={row.id} className="text-left hover:bg-zinc-50 whitespace-nowrap">
            {row.getVisibleCells().map(cell => {
                return (
                    <td
                        key={cell.id}
                        className="text-left whitespace-nowrap max-w-44 text-wrap px-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                )
            })}
        </tr>
    )
}

export default TableRow 