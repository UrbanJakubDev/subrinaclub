'use client'
import { faListSquares, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from '../../tables/ui/baseTable'
import { Button } from '@material-tailwind/react'
import { getFooterValue, FooterFunctionType } from '../../tables/ui/baseTable'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
   tableName?: string
}

export default function ReportBonusTable({ defaultData, detailLinkPath, tableName }: Props) {



   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(() => [
      {
         accessorKey: 'customerName',
         header: 'Zákazník',
         footer: (props) => getFooterValue('count', props)
      },
      {
         accessorKey: 'salesManagerName',
         header: 'Sales Manager',
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