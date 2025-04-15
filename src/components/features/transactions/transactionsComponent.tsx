import { Customer } from "@/types/customer";
import TransactionsTable from "./transactionsTable";
import { Account } from "@/types/types";
import { Transaction } from "@/types/transaction";
import { useTransactionsByAccount } from "@/lib/queries/transaction/queries";

type TransactionsComponentProps = {
    customer: Customer
    account: Account
}

export default function TransactionsComponent({ customer, account }: TransactionsComponentProps) {

    const { data: transactions, isLoading } = useTransactionsByAccount(account.id) as any;


    const handleEdit = (transaction: Transaction) => {
        console.log(transaction)
    }

    const handleDelete = (transactionId: number) => {
        console.log(transactionId)
    }


    return (
        <TransactionsTable
                  tableName={`Transakce ${customer.fullName || ''}`}
                  accountId={account?.id}
                  transactions={transactions}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  timeInfo={transactions?.metadata?.loadedAt}
               />
    )
}