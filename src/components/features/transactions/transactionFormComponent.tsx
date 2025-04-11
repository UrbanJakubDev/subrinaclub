'use client';
import ModalComponent from '@/components/ui/modal';
import TransactionForm from '@/components/features/transactions/transactionForm';
import { Transaction } from '@/types/transaction';
import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useModalStore } from '@/stores/ModalStore';
import { useStatsStore } from '@/stores/CustomerStatsStore';
import { useAccount } from '@/lib/queries/account/queries';
import { useSavingPeriod } from '@/lib/queries/savingPeriod/queries';
import { useCustomer } from '@/lib/queries/customer/queries';
import Skeleton from '@/components/ui/skeleton';
import { useBonusesForSelect } from '@/lib/queries/bonus/queries';



export default function TransactionFormComponent({ accountId }: { accountId: number }) {

  const { data: account, isLoading: isAccountLoading } = useAccount(accountId) as any;
  
  const { modalId, data: modalData, actions: modalActions } = useModalStore();
  const [transaction, setTransaction] = useState<Transaction>();

  if (isAccountLoading) return <Skeleton type="chart" />;

  useEffect(() => {
    if (modalData?.id) {
      setTransaction(modalData as Transaction);
    } else {

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
        accountId: accountId,
        savingPeriodId: account?.savingPeriods[0]?.id,
        type: 'DEPOSIT',
        quarterDateTime: new Date(),
        account: account as any,
        bonus: null,
        savingPeriod: account?.savingPeriods[0] as any,
        directSale: false
      };

      setTransaction(newTransaction);
    }
  }, [modalActions.openModal, modalData]);

  return (
    <ModalComponent
      modalId="transactionForm"
      title={transaction.id ? 'Editovat body' : 'Přidat / Vybrat body'}
    >

      <div className='flex p-8'>
        <div className='flex flex-row gap-8'>
          <TransactionForm
            transaction={transaction}
            account={account}
          />

          <div className='p-8 flex justify-between'>
            <div>
              <Typography variant='h4'>Zákazník</Typography>
              <p>Jméno: {account?.data?.customer?.fullName}</p>
              <p>Registrační číslo: {account?.data?.customer?.registrationNumber}</p>

              <Typography variant='h5' className='mt-8' >Aktivní šetřící období</Typography>
              <p>{account?.data?.savingPeriods[0]?.id}</p>
              <p>{`od: ${account?.data?.savingPeriods[0]?.startYear}/${account?.data?.savingPeriods[0]?.startQuarter} do: ${account?.data?.savingPeriods[0]?.endYear}/${account?.data?.savingPeriods[0]?.endQuarter}`}</p>

              <Typography variant='h5' className='mt-8'>Body v šetřícím období k dispozici</Typography>
              <p>{account?.data?.savingPeriods[0]?.availablePoints}</p>

            </div>
            {/* <div>
                <Typography variant='h6'>Chyba</Typography>
                <p className='text-red-600 txt-xs'>Nelze zadat transakci mimo šetřící obdobé</p>
              </div> */}
          </div>
        </div>
      </div>

    </ModalComponent>
  );
};
