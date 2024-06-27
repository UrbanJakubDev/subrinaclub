"use client"
import { ColumnDef, PaginationState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table"
import React from "react"
import Filter from "./baseTableFnc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faSort, faSortDown, faSortUp, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Button, Card, Input, Option, Select } from "@material-tailwind/react"



export default function MyTable({
   data,
   columns,
}: {
   data: any[]
   columns: ColumnDef<any>[]
}) {
   const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
   })
   const [columnVisibility, setColumnVisibility] = React.useState({})

   const table = useReactTable({
      columns,
      data,
      debugTable: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      onColumnVisibilityChange: setColumnVisibility,
      //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
      state: {
         pagination,
         columnVisibility,
      },
      // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
   })




   return (
      <div className="w-scrren mx-auto overflow-auto">
         <Card className="p-4 text-gray-900">

            <table className='text-sm basic-table'>
               <thead className='border-b text-black'>
                  {table.getHeaderGroups().map(headerGroup => (
                     <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                           return (
                              <th key={header.id} colSpan={header.colSpan}>
                                 <div className="flex items-center py-1">
                                    <div {...{ className: header.column.getCanSort() ? 'cursor-pointer select-none' : '', onClick: header.column.getToggleSortingHandler(), }}>
                                       {{
                                          asc: <FontAwesomeIcon icon={faSortUp} />,
                                          desc: <FontAwesomeIcon icon={faSortDown} />,
                                       }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? <FontAwesomeIcon icon={faSort} /> : null)
                                       }

                                    </div>
                                    {header.column.getCanFilter() ? (
                                       <Filter column={header.column} table={table} />

                                    ) : (
                                       <div className="mx-2">
                                          {flexRender(header.column.columnDef.header, header.getContext())}
                                       </div>
                                    )}

                                 </div>
                              </th>
                           );
                        })}
                     </tr>
                  ))}
               </thead>
               <tbody >
                  {/* Table body */}
                  {table.getRowModel().rows.map(row => {
                     return (
                        <tr key={row.id} className='text-left hover:bg-zinc-50 whitespace-nowrap'>
                           {row.getVisibleCells().map(cell => {
                              return (
                                 <td key={cell.id} className=" whitespace-nowrap text-center">
                                    {

                                       // If the cell value is true or false, render a checkmark or an X
                                       typeof cell.getValue() === 'boolean' ? (
                                          cell.getValue() ? (
                                             <FontAwesomeIcon icon={faCheck} style={{ color: "#00ff00", }} />
                                          ) : (
                                             <FontAwesomeIcon icon={faXmark} style={{ color: "#ff0000", }} />
                                          )
                                       ) : (
                                          flexRender(cell.column.columnDef.cell, cell.getContext())
                                       )


                                    }
                                 </td>
                              );
                           })}
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </Card>
         <div className="h-2" />
         <div className="flex justify-center gap-2 mx-auto ">
            <div className="flex gap-2">
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
            </div>
            <div className="flex items-baseline">
               <div>Page</div>
               <span className="w-2/3">

                  <strong>
                     {table.getState().pagination.pageIndex + 1} of{' '}
                     {table.getPageCount().toLocaleString()}
                  </strong>

                  | Go to page:
               </span>
               <div className="">
                  <Input
                     type="number"
                     defaultValue={table.getState().pagination.pageIndex + 1}
                     onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        table.setPageIndex(page)
                     }}

                  />
               </div>
            </div>
            <div>
               <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => { table.setPageSize(Number(e.target.value)) }}
               >
                  {[5, 10, 23, 30, 40, 50, 100, 150, 200, 300, 500].map(pageSize => (
                     <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                     </option>
                  ))}
               </select>
            </div>
         </div>
         <div className='mt-2'>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
         </div>
         {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
      </div>
   )
}