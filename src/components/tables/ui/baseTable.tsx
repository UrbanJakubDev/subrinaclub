"use client"
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
  Table,
  Header,
  HeaderGroup,
  Row,
  Cell
} from "@tanstack/react-table"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faDownload,
  faRotate,
  faSort,
  faSortDown,
  faSortUp
} from "@fortawesome/free-solid-svg-icons"
import { Button, ButtonGroup, Card, Input, Checkbox } from "@material-tailwind/react"
import { timestampToDate } from "@/lib/utils/dateFnc"
import Filter from "./baseTableFnc"
import Link from "next/link"

// Add utility function for number formatting
const formatNumber = (value: any): string => {
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const num = Number(value)
    return num.toLocaleString('cs-CZ')
  }
  return value
}

// Extend ColumnDef type to include formatNumber option
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    formatNumber?: boolean
  }
}

interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  tableName: string
  addBtn?: boolean
  onAddClick?: () => void
  enableRowSelection?: boolean
  onSelectionChange?: (rows: T[]) => void
  bulkActions?: {
    label: string
    onClick: (selectedRows: T[]) => void
  }[]
}

// Add built-in footer function types
export type FooterFunctionType = 'sum' | 'count' | 'average'

// Helper functions for footer calculations
const footerFunctions = {
  sum: (rows: any[], accessor: string) => {
    const total = rows.reduce(
      (sum, row) => sum + (parseFloat(row.getValue(accessor)) || 0),
      0
    )
    return `${total.toLocaleString('cs-CZ')}`
  },
  count: (rows: any[]) => {
    return `Počet: ${rows.length.toLocaleString('cs-CZ')}`
  },
  average: (rows: any[], accessor: string) => {
    if (rows.length === 0) return 'Průměr: 0'
    const total = rows.reduce(
      (sum, row) => sum + (parseFloat(row.getValue(accessor)) || 0),
      0
    )
    return `${(total / rows.length).toLocaleString('cs-CZ')}`
  }
}

// Helper function to get footer value
export const getFooterValue = (type: FooterFunctionType, props: any) => {
  const rows = props.table.getFilteredRowModel().rows
  const accessor = props.column.id

  return footerFunctions[type](rows, accessor)
}

interface TableHeaderProps<T> {
  headerGroup: HeaderGroup<T>
  table: Table<T>
}

interface SortIconProps<T> {
  header: Header<T, unknown>
}

interface PaginationProps<T> {
  table: Table<T>
}

interface TableToolbarProps<T> {
  table: Table<T>
  tableName: string
  timeInfo: string
  addBtn?: boolean
  onAddClick?: () => void
  bulkActions?: {
    label: string
    onClick: (selectedRows: T[]) => void
  }[]
}

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef<HTMLInputElement>(null)
  const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement>

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate ?? false
    }
  }, [resolvedRef, indeterminate])

  return (
    <input
      type="checkbox"
      ref={resolvedRef}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...rest}
    />
  )
})
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

// Separate components for better organization
const TableHeader = <T,>({ headerGroup, table }: TableHeaderProps<T>) => (
  <React.Fragment key={headerGroup.id}>
    <tr className="bg-gray-100 border-b border-gray-300">
      {headerGroup.headers.map(header => (
        <th key={header.id} colSpan={header.colSpan} className="text-center border-r border-gray-200 px-3 py-2">
          <div className="font-medium text-gray-800">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        </th>
      ))}
    </tr>
    <tr className="bg-gray-50">
      {headerGroup.headers.map(header => (
        <th key={header.id} colSpan={header.colSpan} className="border-r border-gray-200 px-2 py-1">
          <div className="flex items-center justify-between">
            {header.column.getCanSort() && (
              <SortIcon header={header} />
            )}
            {header.column.getCanFilter() ? (
              <Filter column={header.column} table={table} />
            ) : (
              <div className="mx-2"></div>
            )}
          </div>
        </th>
      ))}
    </tr>
  </React.Fragment>
)

const SortIcon = <T,>({ header }: SortIconProps<T>) => {
  if (!header.column.getCanSort()) return null

  const sortDirection = header.column.getIsSorted()
  const icon = sortDirection === false
    ? <FontAwesomeIcon icon={faSort} />
    : sortDirection === 'asc'
      ? <FontAwesomeIcon icon={faSortUp} />
      : <FontAwesomeIcon icon={faSortDown} />

  return (
    <div
      className="cursor-pointer select-none m-2 text-xl"
      onClick={header.column.getToggleSortingHandler()}
    >
      {icon}
    </div>
  )
}

const Pagination = <T,>({ table }: PaginationProps<T>) => (
  <div className="flex justify-center gap-2 mx-auto mt-6">
    <ButtonGroup>
      <Button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </Button>
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </Button>
      <Button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </Button>
    </ButtonGroup>

    <div className="flex items-baseline gap-2">
      <span>
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
        <strong>{table.getPageCount().toLocaleString()}</strong>
      </span>
      <span>Go to page:</span>
      <Input
        type="number"
        defaultValue={table.getState().pagination.pageIndex + 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          table.setPageIndex(page)
        }}
        containerProps={{ className: "w-20" }} crossOrigin={undefined} />
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => table.setPageSize(Number(e.target.value))}
        className="px-2 py-1 border rounded"
      >
        {[5, 10, 23, 30, 40, 50, 100, 150, 200, 300, 500, 5000].map(size => (
          <option key={size} value={size}>Show {size}</option>
        ))}
      </select>
    </div>
  </div>
)

const TableToolbar = <T,>({ table, tableName,timeInfo, addBtn, onAddClick, bulkActions }: TableToolbarProps<T>) => {
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
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{tableName}</h1>
          <p className="text-sm text-gray-500">{timeInfo}</p>
        </div>
        <div className="flex gap-2 py-2">
          {addBtn && (
            <Button size="sm" className="font-light" onClick={onAddClick}>
              Přidat
            </Button>
          )}
          <Button onClick={() => table.reset()} variant="outlined" size="sm" className="font-light">
            <FontAwesomeIcon icon={faRotate} size="lg" className="text-gray-800" />
          </Button>
          <Button onClick={() => exportData(false)} variant="outlined" size="sm" className="font-light">
            <FontAwesomeIcon icon={faDownload} className="text-gray-800" /> Export
          </Button>
          <Button onClick={() => exportData(true)} variant="outlined" size="sm" className="font-light">
            <FontAwesomeIcon icon={faDownload} className="text-gray-800" /> Export Vše
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
                variant="outlined"
                onClick={() => action.onClick(selectedRows.map(row => row.original))}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface TableRowProps<T> {
  row: Row<T>
  header: HeaderGroup<T>
}

const TableRow = <T,>({ row, header }: TableRowProps<T>) => {
  return (
    <tr key={row.id} className="text-left hover:bg-zinc-50 whitespace-nowrap">
      {row.getVisibleCells().map(cell => {
        return (
          <td key={cell.id} className="text-left whitespace-nowrap max-w-44 text-wrap px-2">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};

export default function BaseTable<T>({
  data,
  columns,
  tableName,
  timeInfo,
  addBtn = false,
  onAddClick,
  enableRowSelection = false,
  onSelectionChange,
  bulkActions
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
    [columns, enableRowSelection]
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
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, onSelectionChange])

  return (
    <div className="mx-auto w-full">
      <Card className="p-4 text-gray-900 rounded-sm overflow-x-auto">
        <TableToolbar
          table={table}
          tableName={tableName}
          timeInfo={timeInfo}
          addBtn={addBtn}
          onAddClick={onAddClick}
          bulkActions={bulkActions}
        />

        <table className="text-sm basic-table !text-gray-800">
          <thead className="border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <TableHeader key={headerGroup.id} headerGroup={headerGroup} table={table} />
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
                  <td key={footer.id} colSpan={footer.colSpan} className="text-left">
                    <div className="py-1">
                      <div className="mx-2">
                        {flexRender(footer.column.columnDef.footer, footer.getContext())}
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