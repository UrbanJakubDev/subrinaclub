'use client';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import MyTable from '../../tables/baseTable';
import Button from '../../ui/button';
import formatThousandDelimiter from '@/lib/utils/formatFncs';
import { Transaction } from '@/types/transaction';
import TransactionFormComponent from '@/components/features/customer/transactionFormComponent';
import Skeleton from '@/components/ui/skeleton';
import React, { useState } from 'react';
import { useModalStore } from '@/stores/ModalStore';
import { formatDateToCz } from '@/lib/utils/dateFnc';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

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
         cell: (info) => formatDateToCz(info.getValue() as string | null),
      },
      {
         accessorKey: 'sentBonusOrder',
         header: 'Bonus odeslán',
         cell: (info) => formatDateToCz(info.getValue() as string | null),
      },
      {
         accessorKey: 'bonus.name',
         header: 'Jméno bonusu',
      },
      {
         accessorKey: 'bonusPrice',
         header: 'Cena bonusu',
         enableColumnFilter: false,
         footer: (info) => {
            const total = info.table.getFilteredRowModel().rows.reduce(
               (sum, row) => sum + (row.getValue<number>('bonusPrice') || 0),
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

   return (
      <div className="space-y-4">


         {!transactions?.length ? (
            <div className="p-4 text-center text-gray-500">
               Žádné transakce k zobrazení
            </div>
         ) : (
            <MyTable
               data={transactions}
               columns={columns}
               tableName={tableName}
            />
         )}

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

const TableActions = ({ transaction, onEdit, onDelete }: TableActionsProps) => {
   const [open, setOpen] = useState(false);

   const handleOpen = () => setOpen(!open);

   const handleDelete = () => {
      onDelete(transaction.id);
      setOpen(false);
   };

   const message = transaction.points < 0
      ? `Opravdu chcete smazat výběr bonusu "${transaction.bonus?.name || ''}" za ${Math.abs(transaction.points)} bodů?`
      : `Opravdu chcete smazat vklad ${transaction.points} bodů?`;

   return (
      <>
         <div className="flex justify-center gap-2">
            <Button size="sm" onClick={() => onEdit(transaction)}>
               <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button size="sm" onClick={handleOpen}>
               <FontAwesomeIcon icon={faTrash} />
            </Button>
         </div>

         <Dialog open={open} handler={handleOpen} size="xs">
            <DialogHeader>Potvrzení smazání</DialogHeader>
            <DialogBody divider className="text-center">
               {message}
            </DialogBody>
            <DialogFooter className="flex justify-center gap-2">
               <Button size="sm" onClick={handleOpen}>
                  Zrušit
               </Button>
               <Button size="sm" color="red" onClick={handleDelete}>
                  Smazat
               </Button>
            </DialogFooter>
         </Dialog>
      </>
   );
};
