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

type Props = {
   defaultData: any[]
   detailLinkPath?: string
   tableName?: string
}




export default function FullReportBonusTable({ defaultData, detailLinkPath, tableName }: Props) {

   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(() => [
      {
         accessorKey: 'bonusName',
         header: 'Bonus',
         footer: (props) => getFooterValue('count', props)
      },
      {
         accessorKey: 'totalPoints',
         header: 'Body celkem',
         footer: (props) => getFooterValue('sum', props),
         meta: { formatNumber: true }
      },
      {
         accessorKey: 'price',
         header: 'Cena celkem',
         footer: (props) => getFooterValue('sum', props),
         meta: { formatNumber: true }
      },
      {
         accessorKey: 'count',
         header: 'Počet celkem',
         meta: { formatNumber: true },
      },
      {
         accessorKey: 'pointsThisSeason',
         header: 'Body za období',
         footer: (props) => getFooterValue('sum', props),
         meta: { formatNumber: true }
      },
      {
         accessorKey: 'priceThisSeason',
         header: 'Cena za období',
         footer: (props) => getFooterValue('sum', props),
         meta: { formatNumber: true }
      },
      {
         accessorKey: 'countThisSeason',
         header: 'Počet za období',
         meta: { formatNumber: true },
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
               tableName: tableName ?? 'Premium bonus - přehled celkem'
            }}
         />

      </>
   )
}