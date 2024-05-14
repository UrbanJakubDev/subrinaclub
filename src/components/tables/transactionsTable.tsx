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
            header: 'Rok',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'quarter',
            header: 'Kvartál',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'amount',
            header: 'Body',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'description',
            header: 'Poznámka',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'acceptedBonusOrder',
            header: 'Příjetí objednávky bonusu',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'sentBonusOrder',
            header: 'Bonus odeslán',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'bonusName',
            header: 'Jméno bonusu',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'bonusAmount',
            header: 'Cena bonusu',
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