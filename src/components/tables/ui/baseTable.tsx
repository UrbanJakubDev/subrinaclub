import { ColumnDef, PaginationState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table"
import React from "react"
import Filter from "./baseTableFnc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faSort, faSortDown, faSortUp, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons"



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
         <table className='text-sm basic-table'>
            <thead className='border-b-2'>
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
                                    // If the column is status, render a badge
                                    cell.column.id === 'status' ? (

                                       // If value is 1 render a green badge, 2 render a yellow badge, otherwise render a red badge
                                       cell.getValue() === 3 ? (
                                          <span className="badge badge-success">Zkontr.</span>
                                       ) : cell.getValue() === 2 ? (
                                          <span className="badge badge-warning">RV</span>
                                       ) : cell.getValue() === 1 ? (
                                          <span className="badge badge-error">Rozprac.</span>
                                       ) : (
                                          <span className="badge badge-secondary">Unknown</span>
                                       )




                                    ) : (
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
         <div className="h-2" />
         <div className="flex justify-center gap-2 mx-auto ">
            <button
               className="btn btn-sm btn-success"
               onClick={() => table.firstPage()}
               disabled={!table.getCanPreviousPage()}
            >
               {'<<'}
            </button>
            <button
               className="btn btn-sm btn-success"
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
            >
               {'<'}
            </button>
            <button
               className="btn btn-sm btn-success"
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
            >
               {'>'}
            </button>
            <button
               className="btn btn-sm btn-success"
               onClick={() => table.lastPage()}
               disabled={!table.getCanNextPage()}
            >
               {'>>'}
            </button>
            <span className="flex items-center gap-1">
               <div>Page</div>
               <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount().toLocaleString()}
               </strong>
            </span>
            <span className="flex items-center gap-1">
               | Go to page:
               <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                     const page = e.target.value ? Number(e.target.value) - 1 : 0
                     table.setPageIndex(page)
                  }}
                  className="border p-1 rounded w-16"
               />
            </span>
            <select
               value={table.getState().pagination.pageSize}
               onChange={e => {
                  table.setPageSize(Number(e.target.value))
               }}
            >
               {[5, 10, 23, 30, 40, 50, 100, 150, 200, 300, 500].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                     Show {pageSize}
                  </option>
               ))}
            </select>
         </div>
         <div className='mt-2'>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
         </div>
         {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
      </div>
   )
}