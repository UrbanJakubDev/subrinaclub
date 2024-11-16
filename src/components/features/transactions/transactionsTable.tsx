'use client';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import MyTable from '../../tables/ui/baseTable';
import Button from '../../ui/button';
import formatThousandDelimiter from '@/lib/utils/formatFncs';
import Loader from '../../ui/loader';
import TransactionModalWrapper from '@/components/features/customer/transactionFormComponent';
import { Transaction } from '@/types/transaction';
import { useStatsStore } from '@/stores/CustomerStatsStore';
import TransactionFormComponent from '@/components/features/customer/transactionFormComponent';
import { useModal } from '@/contexts/ModalContext';
import { useModalStore } from '@/stores/ModalStore';
import Skeleton from '@/components/ui/skeleton';

type Props = {
   tableName?: string;
   accountId: number;
   transactions: Transaction[];
};

export default function TransactionsTable({ tableName, accountId }: Props) {
   const transactions = useStatsStore(state => state.transactions)
   const isLoading = useStatsStore(state => state.isLoading)
   const { actions } = useModalStore();

   const onEdit = (transaction: Transaction) => {
      actions.openModal('transactionForm', transaction);
   }
   const onDelete = () => console.log('delete');


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
            accessorKey: 'points',
            header: 'Body',
            cell: (info) => info.getValue(),
            footer: (info) => {
               const total = info.table.getFilteredRowModel().rows.reduce(
                  (sum, row) => sum + row.getValue<number>('points'),
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
            cell: (info) => (
               <div className="flex justify-center gap-2">
                  <Button size="sm" onClick={() => onEdit(info.row.original)}>
                     <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button size="sm" onClick={() => onDelete(info.row.original.id)}>
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
         {isLoading ? <Skeleton /> :
      
            <MyTable
               {...{
                  data: transactions,
                  columns,
                  tableName: tableName || 'Transakce',
               }}
            />
         }
         <TransactionFormComponent />


      </>
   );
}
