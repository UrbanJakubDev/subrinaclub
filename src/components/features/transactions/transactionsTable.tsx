'use client';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import MyTable from '../../tables/ui/baseTable';
import Button from '../../ui/button';
import formatThousandDelimiter from '@/lib/utils/formatFncs';
import { Transaction } from '@/types/transaction';
import TransactionFormComponent from '@/components/features/customer/transactionFormComponent';
import Skeleton from '@/components/ui/skeleton';
import React from 'react';

type TransactionsTableProps = {
   tableName?: string;
   accountId: number;
   transactions?: Transaction[];
   isLoading?: boolean;
   onEdit: (transaction: Transaction) => void;
   onDelete: (transactionId: number) => void;
};

export default function TransactionsTable({ 
   tableName = 'Transakce',
   transactions,
   isLoading = false,
   onEdit,
   onDelete 
}: TransactionsTableProps) {
   
   // Column definitions
   const columns = React.useMemo<ColumnDef<Transaction>[]>(() => [
      {
         accessorKey: 'id',
         header: 'ID transakce',
         enableColumnFilter: false,
      },
      {
         accessorKey: 'year',
         header: 'Rok',
         enableColumnFilter: false,
      },
      {
         accessorKey: 'quarter',
         header: 'Kvartál',
         enableColumnFilter: false,
      },
      {
         accessorKey: 'points',
         header: 'Body',
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
      },
      {
         accessorKey: 'sentBonusOrder',
         header: 'Bonus odeslán',
      },
      {
         accessorKey: 'bonusName',
         header: 'Jméno bonusu',
      },
      {
         accessorKey: 'bonusAmount',
         header: 'Cena bonusu',
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
         enableColumnFilter: false,
         cell: (info) => (
            <TableActions 
               transaction={info.row.original}
               onEdit={onEdit}
               onDelete={onDelete}
            />
         ),
      },
   ], [onEdit, onDelete]);

   if (isLoading) {
      return <Skeleton type="table" />;
   }

   if (!transactions?.length) {
      return (
         <div className="p-4 text-center text-gray-500">
            Žádné transakce k zobrazení
         </div>
      );
   }

   return (
      <div className="space-y-4">
         <h2>Přehled všech transakcí</h2>
         <MyTable
            data={transactions}
            columns={columns}
            tableName={tableName}
         />
         <TransactionFormComponent />
      </div>
   );
}

// Extracted action buttons into a separate component
type TableActionsProps = {
   transaction: Transaction;
   onEdit: (transaction: Transaction) => void;
   onDelete: (transactionId: number) => void;
};

const TableActions = ({ transaction, onEdit, onDelete }: TableActionsProps) => (
   <div className="flex justify-center gap-2">
      <Button size="sm" onClick={() => onEdit(transaction)}>
         <FontAwesomeIcon icon={faPenToSquare} />
      </Button>
      <Button size="sm" onClick={() => onDelete(transaction.id)}>
         <FontAwesomeIcon icon={faTrash} />
      </Button>
   </div>
);
