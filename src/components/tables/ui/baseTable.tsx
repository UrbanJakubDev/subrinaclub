"use client"
import { ColumnDef, PaginationState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, getFacetedRowModel } from "@tanstack/react-table"
import React from "react"
import Filter from "./baseTableFnc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faDownload, faRotate, faSort, faSortDown, faSortUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup, Card, Chip, Input } from "@material-tailwind/react";
import { timestampToDate } from "@/utils/dateFnc"
import { useModal } from "@/contexts/ModalContext";



export default function MyTable({
   data,
   columns,
   tableName,
   addBtn,
   onAddClick,
}: {
   data: any[]
   columns: ColumnDef<any>[]
   tableName: string
   addBtn?: boolean
   onAddClick?: () => void
}) {
   const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
   })
   const [columnVisibility, setColumnVisibility] = React.useState({})

   // Get modal context for the table

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



   // Export table to xlsx file, this function is called when the export button is clicked, use column.header to get the column name
   const exportTable = () => {
      // Get timestamp now in format: YYYY-MM-DD-HH-MM with timezone 
      const timestamp = timestampToDate(new Date().toISOString());


      const header = table.getHeaderGroups().map(headerGroup => {
         return headerGroup.headers.map(header => header.column.columnDef.header)
      }).flat()

      const data = table.getRowModel().rows.map(row => {
         return row.getAllCells().map(cell => cell.getValue())
      })

      // Create a new workbook
      const XLSX = require('xlsx');
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${tableName}-${timestamp}.xls`);

   }

   const exportAll = () => {
      // Get timestamp now
      const timestamp = timestampToDate(new Date().toISOString());

      // Extract all headers
      const header = table.getAllColumns().map(column => column.columnDef.header);

      // Extract all row data
      const data = table.getCoreRowModel().rows.map(row => {
         return row.getAllCells().map(cell => cell.getValue());
      });

      // Create a new workbook
      const XLSX = require('xlsx');
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${tableName}-${timestamp}-vše.xls`);
   }

   const handleAddClick = () => {
      if (onAddClick) {
         onAddClick()
      }
   }

   return (
      <div className="mx-auto overflow-auto w-fit">
         <Card className="p-4 text-gray-900">
            <div className="flex justify-between gap-2">
               {addBtn ? <Button size="sm" className="font-light" onClick={handleAddClick}>Přidat</Button> : <span></span>}
               <ButtonGroup size="sm">
                  <Button onClick={() => table.reset()} ><FontAwesomeIcon icon={faRotate} size="lg" style={{ color: "#fff", }} /></Button>
                  <Button onClick={exportTable} className="font-light" ><FontAwesomeIcon icon={faDownload} style={{ color: "#ffffff", }} /> Export</Button>
                  <Button onClick={exportAll} color="blue" className="font-light" ><FontAwesomeIcon icon={faDownload} style={{ color: "#ffffff", }} /> Export Vše</Button>
               </ButtonGroup>
            </div>
            <table className='text-sm basic-table !text-gray-800'>
               <thead className='border-b '>
                  {table.getHeaderGroups().map(headerGroup => (
                     <React.Fragment key={headerGroup.id}>
                        <tr>
                           {headerGroup.headers.map(header => (
                              <th key={header.id} colSpan={header.colSpan}>
                                 <div className="py-1">
                                    <div className="mx-2">
                                       {flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                 </div>
                              </th>
                           ))}
                        </tr>
                        <tr>
                           {headerGroup.headers.map(header => (
                              <th key={header.id} colSpan={header.colSpan}>
                                 <div className="flex items-center py-1">
                                    <div {...{ className: header.column.getCanSort() ? 'cursor-pointer select-none' : '', onClick: header.column.getToggleSortingHandler() }}>
                                       {{
                                          asc: <FontAwesomeIcon icon={faSortUp} />,
                                          desc: <FontAwesomeIcon icon={faSortDown} />,
                                       }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? <FontAwesomeIcon icon={faSort} /> : null)}
                                    </div>
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
                  ))}
               </thead>
               <tbody >
                  {/* Table body */}
                  {table.getRowModel().rows.map(row => {
                     return (
                        <tr key={row.id} className='text-left hover:bg-zinc-50 whitespace-nowrap'>
                           {row.getVisibleCells().map(cell => {
                              return (
                                 <td key={cell.id} className="text-left whitespace-nowrap max-w-44 text-wrap px-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </td>
                              );
                           })}
                        </tr>
                     );
                  })}
               </tbody>
               <tfoot>
                  <>
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
                  </>
               </tfoot>
            </table>
         </Card>

         <div className="flex justify-center gap-2 mx-auto mt-6">
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
                  {[5, 10, 23, 30, 40, 50, 100, 150, 200, 300, 500, 5000].map(pageSize => (
                     <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                     </option>
                  ))}
               </select>
            </div>
         </div>
         <div className='mt-2'>
            {`Zobrazeno ${table.getRowModel().rows.length} z ${table.getRowCount()} záznamů.`}
         </div>
      </div>
   )
}