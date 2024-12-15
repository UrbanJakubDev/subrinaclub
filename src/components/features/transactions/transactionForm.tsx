"use client";
import { useEffect, useState, useCallback } from 'react';
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


const newTransaction: Transaction = {
   year: 0,
   quarter: 0,
   points: 1,
   acceptedBonusOrder: null,
   sentBonusOrder: null,
   bonusPrice: 0,
   bonusId: 0,
   description: '',
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



   const handleSubmit = async (data: Transaction) => {
      try {
         // Your API call or data handling logic here
         await saveTransaction(data);  // assuming you have this function
         toast.success('Transakce byla uložena');
         notifyTransactionChange();
         actions.closeModal()
      } catch (error) {
         toast.error('Chyba při ukládání transakce transaction Form component');
         console.error(error);
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
         {() => (
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
                     label="Množství"
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
                     defaultValue={transactionData.bonusId || "0"}
                  />
               </div>

            </div>

         )}
      </UniversalForm>
   );
}

export default TransactionForm;

