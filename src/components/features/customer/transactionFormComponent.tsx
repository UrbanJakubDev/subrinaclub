'use client';
import ModalComponent from '@/components/ui/modal';
import TransactionForm from '@/components/features/transactions/transactionForm';
import { Transaction } from '@/types/transaction';
import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useModalStore } from '@/stores/ModalStore';
import { useStatsStore } from '@/stores/CustomerStatsStore';

const newTransaction: Transaction = {
  id: 0,
  year: new Date().getFullYear(),
  quarter: 1,
  points: 1,
  acceptedBonusOrder: null,
  sentBonusOrder: null,
  bonusPrice: 0,
  bonusId: 0,
  description: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  accountId: 0,
  savingPeriodId: 0,
  type: 'DEPOSIT',
  quarterDateTime: new Date(),
  account: {} as any,
  bonus: null,
  savingPeriod: null,
  directSale: false
};

export default function TransactionFormComponent() {
  const { modalId, data: modalData, actions: modalActions } = useModalStore();
  const { customer, account, activeSavingPeriod } = useStatsStore(state => state);
  const savingPeriod = activeSavingPeriod;
  const [transaction, setTransaction] = useState<Transaction>(newTransaction);
  const [dials, setDials] = useState<any[]>([]);

 

  // Fetch bonus options
  useEffect(() => {
    if (modalId === 'transactionForm') {
      fetch('/api/bonuses/options')
        .then(res => res.json())
        .then(setDials)
        .catch((error) => {
          toast.error('Dial API not found');
        });
    }
  }, [modalId]);

  useEffect(() => {
    if (modalData?.id) {
      setTransaction(modalData as Transaction);
    } else {
      setTransaction(newTransaction);
    }
  }, [modalActions.openModal, modalData]);

  return (
    <ModalComponent
      modalId="transactionForm"
      title={transaction.id ? 'Editovat body' : 'Přidat / Vybrat body'}
    >
      {!customer || !savingPeriod ? (
        <div className="p-4 text-center">
          <p>Loading customer data...</p>
        </div>
      ) : (
        <div className='flex p-8'>
          <div className='flex flex-row gap-8'>
            <TransactionForm
              transaction={transaction}
              bonusesDial={dials}
            />

            <div className='p-8 flex justify-between'>
              <div>
                <Typography variant='h4'>Zákazník</Typography>
                <p>Jméno: {customer?.fullName}</p>
                <p>Registrační číslo: {customer?.registrationNumber}</p>

                <Typography variant='h5' className='mt-8' >Aktivní šetřící období</Typography>
                <p>{savingPeriod?.id}</p>
                <p>{`od: ${savingPeriod?.startYear}/${savingPeriod?.startQuarter} do: ${savingPeriod?.endYear}/${savingPeriod?.endQuarter}`}</p>

                <Typography variant='h5' className='mt-8'>Body v šetřícím období k dispozici</Typography>
                <p>{savingPeriod?.availablePoints}</p>

              </div>
              {/* <div>
                <Typography variant='h6'>Chyba</Typography>
                <p className='text-red-600 txt-xs'>Nelze zadat transakci mimo šetřící obdobé</p>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </ModalComponent>
  );
};
