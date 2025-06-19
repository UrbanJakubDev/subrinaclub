'use client';
import ModalComponent from '@/components/ui/modal';
import TransactionForm from '@/components/features/transactions/transactionForm';
import { Typography } from '@material-tailwind/react';
import { useModalStore } from '@/stores/ModalStore';
import { useAccount } from '@/lib/queries/account/queries';
import Skeleton from '@/components/ui/skeleton';
import { TransactionInfoPanel } from './transactionInfoPanel';

export default function TransactionFormComponent({ accountId }: { accountId: number }) {
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId);
  const { data: modalData } = useModalStore();
  
  // Let the form handle its own data management
  const existingTransaction = modalData?.id ? modalData : null;

  if (isAccountLoading || !account?.data) {
    return <Skeleton type="chart" />;
  }

  return (
    <ModalComponent
      modalId="transactionForm"
      title={existingTransaction?.id ? 'Editovat body' : 'Přidat / Vybrat body'}
    >
      <div className='flex p-8'>
        <div className='flex flex-row gap-8'>
          <TransactionForm
            existingTransaction={existingTransaction}
            account={account.data}
          />
          <TransactionInfoPanel account={account.data} />
        </div>
      </div>
    </ModalComponent>
  );
}