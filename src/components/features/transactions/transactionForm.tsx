"use client";
import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import InputField from '../../ui/inputs/basicInput';
import InputDateFiled from '../../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import Loader from '../../ui/loader';
import { Typography } from '@material-tailwind/react';
import UniversalForm from '../../forms/universalForm';
import SelectField from '../../ui/inputs/selectInput';
import { quarterSelectOptions, yearSelectOptions } from '@/lib/utils/dateFnc';
import { Transaction } from '@/types/transaction';
import { transactionValidationSchema } from '@/lib/services/transaction/validation';
import Skeleton from '@/components/ui/skeleton';
import { useStatsStore } from '@/stores/CustomerStatsStore';
import { TransactionType } from '@prisma/client';
import { useModalStore } from '@/stores/ModalStore';
import QuarterSlider from '@/components/ui/inputs/quarterSlider';
import { Account, SavingPeriod } from '@/types/types';
import { Bonus } from '@/types/bonus';


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
   type: TransactionType.DEPOSIT,
   quarterDateTime: new Date(),
   account: {} as Account,
   bonus: {} as Bonus,
   savingPeriod: {} as SavingPeriod,
   directSale: false
};


type Props = {
   transaction: Transaction
   bonusesDial?: any
};



const TransactionForm = ({ transaction, bonusesDial }: Props) => {
   const { account, activeSavingPeriod, notifyTransactionChange } = useStatsStore();
   const [transactionData, setTransactionData] = useState<Transaction>();
   const yearDial = yearSelectOptions();
   const quarterDial = quarterSelectOptions();
   const { actions } = useModalStore()

   useEffect(() => {
      if (transaction) {
         setTransactionData(transaction);
      } else {
         setTransactionData(newTransaction);
      }
   }, [transaction]);

   const handleFormChange = (formMethods: any) => {
      const bonusId = formMethods.watch('bonusId');
      const points = formMethods.watch('points');

      if (bonusId > 0 && points > 0) {
         formMethods.setValue('points', -Math.abs(points));
      }
   };

   const saveTransaction = async (data: Transaction) => {
      const isNewTransaction = !data.id;
      const url = '/api/transactions';
      const method = isNewTransaction ? 'POST' : 'PUT';

      const transactionData = {
         ...data,
         accountId: account?.id,
         savingPeriodId: activeSavingPeriod?.id,
         type: data.points > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
         quarterDateTime: new Date(data.year, (data.quarter - 1) * 3, 1)
      };

      try {
         const response = await fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const savedTransaction = await response.json();
         return savedTransaction;
      } catch (error) {
         console.error('Error saving transaction:', error);
         throw error;
      }
   };



   const handleSubmit = async (data: Transaction): Promise<Transaction> => {
      try {
         const savedTransaction = await saveTransaction(data);
         toast.success('Transakce byla uložena');
         notifyTransactionChange();

         if (data.points > 0) {
            actions.closeModal();
         }
         
         if (data.points < 0) {
            setTransactionData(newTransaction);
         }

         return savedTransaction;
      } catch (error) {
         toast.error('Chyba při ukládání transakce transaction Form component');
         console.error(error);
         throw error;
      }
   }


   if (!bonusesDial || !transactionData) {
      return <Skeleton />;
   }

   return (
      <UniversalForm<Transaction>
         initialData={transactionData}
         validationSchema={transactionValidationSchema}
         onSubmit={handleSubmit}
      >
         {(formMethods) => {
            React.useEffect(() => {
               const subscription = formMethods.watch((value, { name }) => {
                  if (name === 'bonusId' || name === 'points') {
                     handleFormChange(formMethods);
                  }
               });
               return () => subscription.unsubscribe();
            }, [formMethods]);

            return (
               <div className='gap-4 mt-8'>
                  <div className="flex flex-row gap-4">
                     <SelectField
                        label="Rok"
                        name="year"
                        options={yearDial}
                        defaultValue={transactionData.year || new Date().getFullYear()}
                     />

                     <SelectField
                        label="Čtvrtletí"
                        name="quarter"
                        options={quarterDial}
                        defaultValue={transactionData.quarter || 1}
                     />
                  </div>

                  <div className="my-4 flex flex-col gap-4">
                     <InputField
                        label="Body"
                        type="number"
                        name="points"
                        defaultValue={transactionData.points}
                     />
                     <InputDateFiled
                        label="Přijetí objednávky"
                        name="acceptedBonusOrder"
                     />
                  </div>

                  <div className="mb-4 flex flex-col gap-4">
                     <Typography>Vyběr bodů</Typography>
                     <InputField
                        label="Popis"
                        type="text"
                        name="description"
                     />

                     <InputDateFiled
                        label="Odeslání Bonusu"
                        name="sentBonusOrder"
                     />
                     <InputField
                        label="Bonus - cena"
                        type="number"
                        name="bonusPrice"
                        defaultValue={0}
                     />
                     <SelectField
                        label="Bonus"
                        name="bonusId"
                        options={bonusesDial}
                        defaultValue={transactionData.bonusId || 0}
                     />
                     <div className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           id="directSale"
                           {...formMethods.register('directSale')}
                           className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="directSale" className="text-sm font-medium text-gray-700">
                           Přímý prodej
                        </label>
                     </div>
                  </div>
               </div>
            );
         }}
      </UniversalForm>
   );
}

export default TransactionForm;

