'use client';
import { useModal } from '@/contexts/ModalContext';
import { ITransaction } from '@/types/interfaces';
import { useTransactions } from '@/contexts/TransactionContext';
import ModalComponent from '@/components/ui/modal';
import TransactionForm from '@/components/features/transactions/transactionForm';

interface Props {
  accountId: number;
  transaction?: ITransaction | null;
}

const TransactionModalWrapper: React.FC<Props> = ({ accountId, transaction }) => {
  const { openModal, handleCloseModal } = useModal();
  const { addTransaction, updateTransaction, isLoading, error } = useTransactions();

  const handleSubmit = async (data: ITransaction) => {
    if (data.id) {
      await updateTransaction(data);
    } else {
      await addTransaction(data);
    }
    handleCloseModal();
  };

  if (openModal !== 'transactionForm') return null;

  return (
    <ModalComponent
      modalId="transactionForm"
      title={transaction ? 'Edit Transaction' : 'New Transaction'}
    >
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : (
        <TransactionForm
          transaction={transaction || {
            id: 0,
            accountId,
            year: new Date().getFullYear(),
            quarter: Math.floor((new Date().getMonth() + 3) / 3),
            amount: 0,
            acceptedBonusOrder: null,
            sentBonusOrder: null,
            bonusAmount: 0,
            bonusId: 0,
            description: '',
          }}
          onSubmit={handleSubmit}
        />
      )}
    </ModalComponent>
  );
};

export default TransactionModalWrapper;