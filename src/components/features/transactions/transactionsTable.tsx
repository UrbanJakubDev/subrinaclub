'use client';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState, useCallback } from 'react';
import MyTable from '../../tables/ui/baseTable';
import Button from '../../ui/button';
import { useModal } from '@/contexts/ModalContext';
import { toast } from 'react-toastify';
import formatThousandDelimiter from '@/utils/formatFncs';
import Loader from '../../ui/loader';
import TransactionModalWrapper from '@/components/features/customer/transactionFormComponent';
import { useTransactions } from '@/contexts/TransactionContext';
import { useSavingPeriods } from '@/contexts/SavingPeriodContext';
import SavingPeriodModalWrapper from '../savingPeriod/savingPeriodModalWrapper';
import { Transaction } from '@/types/transaction';

type Props = {
   tableName?: string;
   accountId: number;
   transactions: Transaction[];
};

export default function TransactionsTable({ tableName, accountId }: Props) {
   const { handleOpenModal } = useModal();
   const { transactions, deleteTransaction, isLoading } = useTransactions();
   const { activeSavingPeriod, closeSavingPeriod, createSavingPeriod } = useSavingPeriods();

   const onNewTransaction = useCallback(() => {
      if (!activeSavingPeriod) {
         handleOpenModal('newSavingPeriodForm');
      } else {
         handleOpenModal('transactionForm');
      }
   }, [handleOpenModal, activeSavingPeriod]);

   const onEdit = useCallback((transaction: Transaction) => {
      handleOpenModal('transactionForm', { transaction });
   }, [handleOpenModal]);

   const onDelete = useCallback((id: number) => {
      if (confirm('Opravdu chcete smazat tuto transakci?')) {
         deleteTransaction(id);
      }
   }, [deleteTransaction]);

   const onCloseSavingPeriod = useCallback(async () => {
      try {
         await closeSavingPeriod();
         toast.success('Spořící období bylo uzavřeno');
         const now = new Date();
         const currentYear = now.getFullYear();
         const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
         await createSavingPeriod(currentYear, currentQuarter);
      } catch (error) {
         console.error('Error closing saving period:', error);
         toast.error('Failed to close saving period');
      }
   }, [closeSavingPeriod, createSavingPeriod]);

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
         {activeSavingPeriod && (
            <div className="mb-4">
               <h3>Aktivní spořící období: {activeSavingPeriod.startYear}Q{activeSavingPeriod.startQuarter} - Současnost</h3>
               <p>Dostupné body: {activeSavingPeriod.availablePoints}</p>
               <Button onClick={onCloseSavingPeriod}>Uzavřít spořící období</Button>
            </div>
         )}
         <div className="mb-4">
            <Button onClick={onNewTransaction}>
               <FontAwesomeIcon icon={faPlus} className="mr-2" />
               Nová transakce
            </Button>
         </div>
         {isLoading ? <Loader /> :
            <MyTable
               {...{
                  data: transactions,
                  columns,
                  tableName: tableName || 'Transakce',
               }}
            />
         }
         <TransactionModalWrapper accountId={accountId} />
         <SavingPeriodModalWrapper accountId={accountId} onCreateSavingPeriod={createSavingPeriod} />
      </>
   );
}