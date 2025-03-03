'use client'
import { faListSquares, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable, { getFooterValue } from '../../tables/ui/baseTable'
import { Button } from '@material-tailwind/react'
import ActionButtons from '@/components/tables/ui/actionButtons'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function ReportObratTable({ defaultData, detailLinkPath }: Props) {


   // Change registrationNumber to string
   defaultData.forEach((row) => {
      row.registrationNumber = row.registrationNumber.toString()
   })




   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(() => {
      const currentYear = new Date().getFullYear();
      const startYear = 2011;
      
      const baseColumns: ColumnDef<any>[] = [
         {
            accessorKey: 'registrationNumber',
            header: 'Reg. číslo',
            cell: info => info.getValue(),
            footer: (props) => getFooterValue('count', props)
         },
         {
            accessorKey: 'fullName',
            header: 'Jméno',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'salonName',
            header: 'Salón',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'address',
            header: 'Adresa',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'town',
            header: 'Město',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'zip',
            header: 'PSČ',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'phone',
            header: 'Telefon',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'salesManager',
            header: 'Obchodní zástupce',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'dealer',
            header: 'Velkoobchod',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'clubScore',
            header: 'Klubové konto',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
      ];

      // Generate quarter columns dynamically
      const quarterColumns = Array.from({ length: 4 }, (_, index) => {
         const quarter = index + 1;
         return {
            accessorKey: `Q${quarter}`,
            header: `Q${quarter}`,
            cell: (info: any) => info.getValue(),
            enableColumnFilter: false,
            footer: (props: any) => getFooterValue('sum', props)
         };
      });

      // Combine base columns with quarter columns
      
      // Generate year columns dynamically
      const yearColumns = Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
         const year = currentYear - index;
         return {
            accessorKey: year.toString(),
            header: year.toString(),
            cell: (info: any) => info.getValue(),
            enableColumnFilter: false,
            footer: (props: any) => getFooterValue('sum', props)
         };
      });

      const actionColumn: ColumnDef<any>[] = [
         {
            accessorKey: "actions",
            header: "Akce",
            cell: (info) => (
               <ActionButtons id={info.row.original.id} detailLinkPath={detailLinkPath} hasStats={true} />
            ),
            enableColumnFilter: false,
         }
      ];

      return [...baseColumns, ...quarterColumns, ...yearColumns, ...actionColumn];
   }, 
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [])

   const [data, _setData] = React.useState(() => [...defaultData])

   if (!data) {
      return <div>Loading...</div>
   }

   return (
      <>
         <MyTable
            {...{
               data,
               columns,
               tableName: "Seznam obratu",
            }}
         />
      </>
   )
}