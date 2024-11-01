"use client"
import {
  ColumnDef,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
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
import { Button, ButtonGroup, Card, Input } from "@material-tailwind/react"
import { timestampToDate } from "@/utils/dateFnc"
import Filter from "./baseTableFnc"

interface TableProps {
  data: any[]
  columns: ColumnDef<any>[]
  tableName: string
  addBtn?: boolean
  onAddClick?: () => void
}

// Separate components for better organization
const TableHeader = ({ headerGroup, table }) => (
  <React.Fragment key={headerGroup.id}>
    <tr>
      {headerGroup.headers.map(header => (
        <th key={header.id} colSpan={header.colSpan}>
          <div className="py-1">
            <div className="mx-2 text-left text-gray-700">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          </div>
        </th>
      ))}
    </tr>
    <tr>
      {headerGroup.headers.map(header => (
        <th key={header.id} colSpan={header.colSpan}>
          <div className="flex items-center py-1 text-left">
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

const SortIcon = ({ header }) => {
  if (!header.column.getCanSort()) return null

  const sortDirection = header.column.getIsSorted() as string
  const icons = {
    asc: <FontAwesomeIcon icon={faSortUp} />,
    desc: <FontAwesomeIcon icon={faSortDown} />,
    default: <FontAwesomeIcon icon={faSort} />
  }

  return (
    <div
      className="cursor-pointer select-none"
      onClick={header.column.getToggleSortingHandler()}
    >
      {icons[sortDirection] || icons.default}
    </div>
  )
}

const Pagination = ({ table }) => (
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

const TableToolbar = ({ table, tableName, addBtn, onAddClick }) => {
  const exportData = (all = false) => {
    const timestamp = timestampToDate(new Date().toISOString())
    const XLSX = require('xlsx')

    const headers = all
      ? table.getAllColumns().map(column => column.columnDef.header)
      : table.getHeaderGroups().map(group =>
        group.headers.map(header => header.column.columnDef.header)
      ).flat()

    const rows = all
      ? table.getCoreRowModel().rows
      : table.getRowModel().rows

    const data = rows.map(row => row.getAllCells().map(cell => cell.getValue()))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${tableName}-${timestamp}${all ? '-vše' : ''}.xls`)
  }

  return (
    <div className="flex justify-between gap-2 mb-4">
      <div>
        <h1 className="text-2xl font-semibold">{tableName}</h1>
        <p className="text-sm text-gray-500">some text</p>
      </div>
      <div className="flex gap-2 py-2">
        {addBtn && (
          <Button size="sm" className="font-light" onClick={onAddClick}>
            Přidat
          </Button>
        )}
        <Button onClick={() => table.reset()} variant="outlined" size="sm" className="font-light ">
          <FontAwesomeIcon icon={faRotate} size="lg" className="text-gray-800" />
        </Button>
        <Button onClick={() => exportData(false)} variant="outlined" size="sm" className="font-light ">
          <FontAwesomeIcon icon={faDownload} className="text-gray-800" /> Export
        </Button>
        <Button onClick={() => exportData(true)} variant="outlined" size="sm" className="font-light ">
          <FontAwesomeIcon icon={faDownload} className="text-gray-800" /> Export Vše
        </Button>
      </div>
    </div>
  )
}

export default function BaseTable({
  data,
  columns,
  tableName,
  addBtn = false,
  onAddClick
}: TableProps) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })
  const [columnVisibility, setColumnVisibility] = React.useState({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination,
      columnVisibility,
    },
  })

  return (
    <div className="mx-auto overflow-auto w-fit">
      <Card className="p-4 text-gray-900">
        <TableToolbar
          table={table}
          tableName={tableName}
          addBtn={addBtn}
          onAddClick={onAddClick}
        />

        <table className="text-sm basic-table !text-gray-800">
          <thead className="border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <TableHeader key={headerGroup.id} headerGroup={headerGroup} table={table} />
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="text-left hover:bg-zinc-50 whitespace-nowrap">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="text-left whitespace-nowrap max-w-44 text-wrap px-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
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