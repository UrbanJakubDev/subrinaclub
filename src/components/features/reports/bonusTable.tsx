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

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function ReportBonusTable({ defaultData, detailLinkPath }: Props) {

   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(() => [
      {
         accessorKey: 'customerName',
         header: 'Zákazník',
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
      },
      {
         accessorKey: 'bonusPrice',
         header: 'Cena',
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
               tableName: 'Premium bonus - přehled za období'
            }}
         />
      </>
   )
}