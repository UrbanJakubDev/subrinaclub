'use client';
import ModalComponent from '@/components/ui/modal';
import TransactionForm from '@/components/features/transactions/transactionForm';
import { Transaction } from '@/types/transaction';
import { Card, Typography } from '@material-tailwind/react';
import Skeleton from '@/components/ui/skeleton';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useModalStore } from '@/stores/ModalStore';
import { useStatsStore } from '@/stores/CustomerStatsStore';



export default function TransactionFormComponent() {

  const { modalId, data: modalData, actions: modalActions } = useModalStore();
  const { customer, account, activeSavingPeriod } = useStatsStore(state => state);
  const savingPeriod = activeSavingPeriod
  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
    }
  }
    , [modalActions.openModal, modalData]);

  if (!customer || !savingPeriod || !dials) {
    return <Skeleton />;
  }

  return (
    <ModalComponent
      modalId="transactionForm"
      title={transaction ? 'Editovat body' : 'Přidat / Vybrat body'}
    >
      <div className='flex p-8'>
        <div className='flex flex-row gap-8'>
          <TransactionForm
            transaction={transaction}
            bonusesDial={dials}
          />

          <Card className='p-8 flex justify-between'>
            <div>
              <Typography variant='h4'>Zákazník</Typography>
              <p>Jméno: {customer?.fullName}</p>
              <p>Registrační číslo: {customer?.registrationNumber}</p>

              <Typography variant='h5' className='mt-8' >Aktivní šetřící období</Typography>
              <p>{`od: ${savingPeriod?.startYear}/${savingPeriod?.startQuarter} do: ${savingPeriod?.endYear}/${savingPeriod?.endQuarter}`}</p>

              <Typography variant='h5' className='mt-8'>Body v šetřícím období k dispozici</Typography>
              <p>{savingPeriod?.availablePoints}</p>

            </div>
            <div>
              <Typography variant='h6'>Chyba</Typography>
              <p className='text-red-600 txt-xs'>Nelze zadat transakci mimo šetřící obdobé</p>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <p>Transaction</p>
        <pre>
          {JSON.stringify(transaction, null, 2)}
        </pre>
        {dials && (
          <>
            <p>Dials</p>
            <pre>
              {JSON.stringify(dials, null, 2)}
            </pre>
          </>
        )}
        <p>Customer</p>
        <pre>
          {JSON.stringify(customer, null, 2)}
        </pre>

        {modalData && (
          <>
            <p>Modal Data</p>
            <pre>
              {JSON.stringify(modalData, null, 2)}
            </pre>
          </>
        )}
        <p>SP</p>
        <pre>
          {JSON.stringify(savingPeriod, null, 2)}
        </pre>
      </div>
    </ModalComponent>
  );
};
