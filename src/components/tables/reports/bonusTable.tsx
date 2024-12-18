'use client'
import { faListSquares, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from '../ui/baseTable'
import { Button } from '@material-tailwind/react'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function ReportBonusTable({ defaultData, detailLinkPath }: Props) {

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

   // Change year to string
   defaultData.forEach((row) => {
      row.year = row.year.toString()
      row.quarter = row.quarter.toString()
   })


   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: 'account.customer.registrationNumber',
            header: 'ID',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'account.customer.fullName',
            header: 'Jméno',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'account.customer.town',
            header: 'Město',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'account.customer.salesManager.fullName',
            header: 'Obchodní zástupce',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: 'year',
            header: 'Rok',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'quarter',
            header: 'Kvartál',
            cell: info => info.getValue(),
         },
         {
            accessorKey: 'amount',
            header: 'Body',
            cell: info => info.getValue(),
            enableColumnFilter: false
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
         {
            accessorKey: "actions",
            header: "Akce",
            cell: (info) => (
               <Link href={`/customers/${info.row.original.account.customer.id}`}>
                  <Button size="sm" className="font-light"><FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", }} /> Detail </Button>
               </Link>
            ),
            enableColumnFilter: false,
         },
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
               tableName: 'Premium bonusy'
            }}
         />
         <p>Celková bilance bodů: {getTotal(defaultData)}</p>
         <p>Celková bilance kladných bodů: {getTotal(defaultData, "positive")}</p>
         <p>Celková bilance záporných bodů: {getTotal(defaultData, "negative")}</p>
      </>
   )
}