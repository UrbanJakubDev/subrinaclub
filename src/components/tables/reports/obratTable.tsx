'use client'
import { faListSquares, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from '../ui/baseTable'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function ReportObratTable({ defaultData, detailLinkPath }: Props) {

   const getTotal = (data: any[], type?: any) => {

      switch (type) {
         case 'positive':
            return data.reduce((acc, row) => row.amount > 0 ? acc + row.amount : acc, 0)
         case 'negative':
            return data.reduce((acc, row) => row.amount < 0 ? acc + row.amount : acc, 0)
         default:
            return data.reduce((acc, row) => acc + row.amount, 0)
      }
   }

   // Change registrationNumber to string
   defaultData.forEach((row) => {
      row.registrationNumber = row.registrationNumber.toString()
   })




   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: 'registrationNumber',
            header: 'ID',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'fullName',
            header: 'Jméno',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'town',
            header: 'Město',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'salonName',
            header: 'Obchodní zástupce',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'clubScore',
            header: 'Body',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },

         {
            accessorKey: '2024',
            header: '2024',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2023',
            header: '2023',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2022',
            header: '2022',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2021',
            header: '2021',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2020',
            header: '2020',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2019',
            header: '2019',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2018',
            header: '2018',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2017',
            header: '2017',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2016',
            header: '2016',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2015',
            header: '2015',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2014',
            header: '2014',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2013',
            header: '2013',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2012',
            header: '2012',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2011',
            header: '2011',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2010',
            header: '2010',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },




         // {
         //    accessorKey: 'action',
         //    header: 'Akce',
         //    cell: row => (
         //       <div className="flex justify-center gap-2">
         //          <Link
         //             href={`${detailLinkPath}/${row.row.original.id}`}
         //             className="text-center"
         //          >
         //             <Button variant='danger' >
         //             <FontAwesomeIcon icon={faPenToSquare} />
         //             {/* {row.row.original.id} */}
         //             </Button>
         //          </Link>
         //       </div>
         //    ),
         //    enableColumnFilter: false
         // },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

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
            }}
         />
         <p>Celková bilance bodů: {getTotal(defaultData)}</p>
         <p>Celková bilance kladných bodů: {getTotal(defaultData, "positive")}</p>
         <p>Celková bilance záporných bodů: {getTotal(defaultData, "negative")}</p>
      </>
   )
}