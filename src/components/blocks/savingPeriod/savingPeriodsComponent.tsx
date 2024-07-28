"use client"
import React from 'react'
import SavingPeriodCard from './savingPeriodCard';
import { Button, Card } from '@material-tailwind/react';
import ModalComponent from '@/components/ui/modal';
import SavingPeriodForm from '@/components/forms/savingPeriodForm';
import { useModal } from '@/contexts/ModalContext';

type Props = {
   savingPeriods: any;
   account: any;
}

const SavingPeriodsComponent = ({ savingPeriods, account }: Props) => {

   // Sorting saving periods by date of creation
   savingPeriods.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
   })

   const activeSavingPeriod = savingPeriods.find((savingPeriod: any) => savingPeriod.active)

   const { handleOpenModal } = useModal();

   return (
      <Card className='p-4 my-4'>
         <div className='flex justify-between'>
            <h2 className="text-lg font-semibold">Přehled šetřících období</h2>
            <Button onClick={() => handleOpenModal('savingPeriodForm')}>Ukončit šetřící období</Button>
         </div>
         <div className='w-full'>
            {savingPeriods.map((savingPeriod: any) => (
               <SavingPeriodCard key={savingPeriod.id} savingPeriod={savingPeriod} />
            ))}
         </div>
         <ModalComponent
            modalId='savingPeriodForm'
            title='Nové šetřící období'
            description='Vyplňte formulář pro vytvoření nového šetřícího období'
         >
            <SavingPeriodForm savingPeriod={{}} previousSavingPeriod={activeSavingPeriod} account_id={account.id} userName={account.customer.fullName} />
         </ModalComponent>
      </Card>
   )
}

export default SavingPeriodsComponent