'use client'
import { faListSquares, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   ColumnDef
} from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import MyTable from './ui/baseTable'
import Button from '../ui/button'
import { useModal } from '@/contexts/ModalContext'
import { toast } from 'react-toastify'
import Loader from '../ui/loader'
import { info } from 'console'
import formatThousandDelimiter from '@/utils/formatFncs'

type Props = {
   defaultData: any[]
   detailLinkPath?: string
}




export default function TransactionsTable({ defaultData, detailLinkPath }: Props) {

   const { handleOpenModal } = useModal();

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

   // Delete transaction 
   const deleteTransaction = async (id: number) => {
      try {
         const response = await fetch(`/api/transactions?transactionId=${id}`, {
            method: 'DELETE',
         })
         if (!response.ok) {
            throw new Error('Error deleting transaction')
         }
         const result = await response.json()
         console.log(result)
      } catch (error) {
         console.error('Error:', error)
      }

      toast.success('Transakce byla smazána')
   }



   // On edit button click open modal with form to edit transaction
   const onEdit = (id: number) => {
      handleOpenModal('transactionForm', id)
   }

   // On delete button click delete transaction
   const onDelete = (id: number) => {
      confirm('Opravdu chcete smazat tuto transakci?') && deleteTransaction(id)
   }


   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: 'id',
            header: 'ID transakce',
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
            footer: (info) => {
               const total = info.table.getFilteredRowModel().rows.reduce(
                  (sum, row) => sum + row.getValue<number>('amount'),
                  0
               );
               return `${total}`;
            },
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
            enableColumnFilter: false,
            footer: (info) => {
               const total = info.table.getFilteredRowModel().rows.reduce(
                  (sum, row) => sum + row.getValue<number>('bonusAmount'),
                  0
               );
               return formatThousandDelimiter(total);
            },
         },
         {
            accessorKey: 'action',
            header: 'Akce',
            cell: row => (
               <div className="flex justify-center gap-2">
                  <Button size='sm' onClick={() => onEdit(row.row.original.id)}>
                     <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button size='sm' onClick={() => onDelete(row.row.original.id)}>
                     <FontAwesomeIcon icon={faTrash} />
                  </Button>
               </div>
            ),
            enableColumnFilter: false
         },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

   const [data, _setData] = React.useState(() => [...defaultData])

   if (!data) {
      return <Loader />
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