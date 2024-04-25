'use client'
import { faListSquares, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from './ui/baseTable'
import Button from '../ui/button'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function TransactionsTable({ defaultData, detailLinkPath }: Props) {

   const getTotal = (data: any[]) => {
      return data.reduce((acc, row) => acc + row.amount, 0)
   }

   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: 'id',
            header: 'ID',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'year',
            header: 'year',
            cell: info => info.getValue(),
            filterFn: "auto",
            sortDescFirst: true
         },
         {
            accessorKey: 'quarter',
            header: 'quarter',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'amount',
            header: 'amount',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'description',
            header: 'description',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'acceptedBonusOrder',
            header: 'acceptedBonusOrder',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'sentBonusOrder',
            header: 'sentBonusOrder',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'bonusName',
            header: 'bonusName',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'bonusAmount',
            header: 'bonusAmount',
            cell: info => info.getValue(),
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

   return (
      <>
         <MyTable
            {...{
               data,
               columns,
            }}
         />
      </>
   )
}