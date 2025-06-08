import { useCallback } from "react";
import TransactionsTable from "./transactionsTable";
import { useAccount } from "@/lib/queries/account/queries";
import { Transaction } from "@prisma/client";
import { useModalStore } from "@/stores/ModalStore";
import { toast } from "react-toastify";
import { useDeleteTransaction } from "@/lib/queries/transaction/mutations";
import { queryClient } from "@/lib/config/query";
import { transactionKeys } from "@/lib/queries/transaction/queries";

export default function TransactionDataView({ accountId }: { accountId: number }) {
    const { data: account } = useAccount(accountId);
    const { actions } = useModalStore();
    const { mutate: deleteTransaction } = useDeleteTransaction();

    const handleEdit = useCallback((transaction: Transaction) => {
        actions.openModal('transactionForm', transaction)
    }, []);

    const handleDelete = useCallback((transactionId: number) => {
        deleteTransaction(transactionId, {
            onSuccess: () => {
                toast.success('Transakce byla úspěšně smazána');
                queryClient.invalidateQueries({ queryKey: transactionKeys.byAccount(accountId) });
            },
            onError: () => {
                toast.error('Nepodařilo se smazat transakci');
            }
        });
    }, [accountId, deleteTransaction]);

    return (
        <TransactionsTable
            tableName={`Transakce ${account?.data?.customer?.fullName || ''}`}
            accountId={accountId}
            onEdit={(transaction: any) => handleEdit(transaction as Transaction)} 
            onDelete={handleDelete}
        />
    )
}