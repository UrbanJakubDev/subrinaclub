'use client';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import MyTable from './ui/baseTable';
import Button from '../ui/button';
import { useModal } from '@/contexts/ModalContext';
import { toast } from 'react-toastify';
import formatThousandDelimiter from '@/utils/formatFncs';
import Loader from '../ui/loader';
import { useCustomer } from '@/contexts/CustomerContext';

type Props = {
   defaultData: any[];
   detailLinkPath?: string;
   tableName?: string;
};

export default function TransactionsTable({ defaultData, detailLinkPath, tableName }: Props) {
   const { handleOpenModal, setModalSubmitted} = useModal();
   const [data, setData] = useState(defaultData);
   const [loading, setLoading] = useState(false);

   // Delete transaction and update state
   const deleteTransaction = async (id: number) => {
      try {
         const response = await fetch(`/api/transactions?transactionId=${id}`, {
            method: 'DELETE',
         });
         if (!response.ok) {
            throw new Error('Error deleting transaction');
         }
         toast.success('Transakce byla smazána');

         // Update local data by filtering out the deleted transaction
         setData((prevData) => prevData.filter(transaction => transaction.id !== id));
      } catch (error) {
         console.error('Error:', error);
      }
   };

   // On edit button click, open modal with form to edit transaction
   const onEdit = (id: number) => {
      handleOpenModal('transactionForm', id);
   };

   // On delete button click, delete transaction and handle modal submission
   const onDelete = (id: number) => {
      if (confirm('Opravdu chcete smazat tuto transakci?')) {
         deleteTransaction(id);
         setModalSubmitted(true);
      }
   };


   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: 'id',
            header: 'ID transakce',
            cell: (info) => info.getValue(),
            enableColumnFilter: false,
         },
         {
            accessorKey: 'year',
            header: 'Rok',
            cell: (info) => info.getValue(),
            enableColumnFilter: false,
         },
         {
            accessorKey: 'quarter',
            header: 'Kvartál',
            cell: (info) => info.getValue(),
            enableColumnFilter: false,
         },
         {
            accessorKey: 'amount',
            header: 'Body',
            cell: (info) => info.getValue(),
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
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: 'sentBonusOrder',
            header: 'Bonus odeslán',
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: 'bonusName',
            header: 'Jméno bonusu',
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: 'bonusAmount',
            header: 'Cena bonusu',
            cell: (info) => info.getValue(),
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
            cell: (row) => (
               <div className="flex justify-center gap-2">
                  <Button size="sm" onClick={() => onEdit(row.row.original.id)}>
                     <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button size="sm" onClick={() => onDelete(row.row.original.id)}>
                     <FontAwesomeIcon icon={faTrash} />
                  </Button>
               </div>
            ),
            enableColumnFilter: false,
         },
      ],
      []
   );

   return (
      <>
         {loading ? <Loader /> :
            <MyTable
               {...{
                  data,
                  columns,
                  tableName: tableName || 'Transakce',
               }}
            />
         }
      </>
   );
}
