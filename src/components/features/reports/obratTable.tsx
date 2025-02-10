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
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
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
            accessorKey: 'salonName',
            header: 'Salón',
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
            header: 'Body',
            cell: info => info.getValue(),
            enableColumnFilter: false
         },
         {
            accessorKey: '2024',
            header: '2024',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2023',
            header: '2023',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2022',
            header: '2022',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2021',
            header: '2021',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2020',
            header: '2020',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2019',
            header: '2019',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props) 
         },
         {
            accessorKey: '2018',
            header: '2018',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)    
         },
         {
            accessorKey: '2017',
            header: '2017',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)       
         },
         {
            accessorKey: '2016',
            header: '2016',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)       
         },
         {
            accessorKey: '2015',
            header: '2015',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)       
         },
         {
            accessorKey: '2014', 
            header: '2014',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)          
         },
         {
            accessorKey: '2013',
            header: '2013',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)          
         },
         {
            accessorKey: '2012',
            header: '2012',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2011',
            header: '2011',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },
         {
            accessorKey: '2010',
            header: '2010',
            cell: info => info.getValue(),
            enableColumnFilter: false,
            footer: (props) => getFooterValue('sum', props)
         },

         {
            accessorKey: "actions",
            header: "Akce",
            cell: (info) => (
               <ActionButtons id={info.row.original.id} detailLinkPath={detailLinkPath} hasStats={true} />
            ),
            enableColumnFilter: false,
         }
        
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
               tableName: "Seznam obratu",
            }}
         />
      </>
   )
}