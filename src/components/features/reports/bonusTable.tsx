'use client'
import { faListSquares, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from '../../tables/baseTable'
import { Button } from '@material-tailwind/react'
import { getFooterValue, FooterFunctionType } from '../../tables/baseTable'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
   tableName?: string
}

export default function ReportBonusTable({ defaultData, detailLinkPath, tableName }: Props) {



   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(() => [
      {
         accessorKey: "registrationNumber",
         header: "Reg. číslo",
      },
      {
         accessorKey: "customerName",
         header: "Jméno",
         filterFn: "auto",
         cell: ({ row }) => (
             <Link href={`/customers/${row.original.customerId}/stats`} className="text-blue-600 hover:text-blue-800 hover:underline">
                 {row.original.customerName}
             </Link>
         ),
     },
      {
         accessorKey: 'salesManagerName',
         header: 'Sales Manager',
         cell: ({ row }) => (
            <Link href={`/sales-managers/${row.original.salesManagerId}/stats`} className="text-blue-600 hover:text-blue-800 hover:underline">
                {row.original.salesManagerName}
            </Link>
        ),
      },
      {
         accessorKey: 'dealerName',
         header: 'Dealer',
      },
      {
         accessorKey: 'bonusName',
         header: 'Bonus',
      },
      {
         accessorKey: 'points',
         header: 'Body',
         meta: { formatNumber: true },
         footer: (props) => getFooterValue('sum', props)
      },
      {
         accessorKey: 'acceptedBonusOrder',
         header: 'Přijato',
         cell: ({ row }) => {
            return <div>{row.original.acceptedBonusOrder ? new Date(row.original.acceptedBonusOrder).toLocaleDateString() : '-'}</div>
         }
      },
      {
         accessorKey: 'bonusPrice',
         header: 'Cena',
         meta: { formatNumber: true },
         footer: (props) => getFooterValue('sum', props)
      },
      {
         accessorKey: 'link',
         header: 'Detail',
         cell: ({ row }) => {
            return <Link href={`/customers/${row.original.customerId}/stats/`}><FontAwesomeIcon icon={faPenToSquare} /></Link>
         }
      }
   ], [])

   const [data, setData] = React.useState(() =>
      Array.isArray(defaultData) ? defaultData : []
   )

   // Add this effect to update data when defaultData changes
   React.useEffect(() => {
      setData(Array.isArray(defaultData) ? defaultData : [])
   }, [defaultData])

   if (!data?.length) return <div>No bonus data available</div>

   return (
      <>
         <MyTable
            {...{
               data,
               columns,
               tableName: tableName ?? 'Premium bonus - přehled za období'
            }}
         />
      </>
   )
}