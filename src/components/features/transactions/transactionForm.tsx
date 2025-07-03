"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import InputField from '../../ui/inputs/basicInput';
import InputDateFiled from '../../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import { Typography, Select, Option } from '@material-tailwind/react';
import UniversalForm from '../../forms/universalForm';
import SelectField from '../../ui/inputs/selectInput';
import { quarterSelectOptions, yearSelectOptions } from '@/lib/utils/dateFnc';
import { Transaction } from '@/types/transaction';
import { transactionValidationSchema } from '@/lib/services/transaction/validation';
import Skeleton from '@/components/ui/skeleton';
import { useStatsStore } from '@/stores/CustomerStatsStore';
import { useModalStore } from '@/stores/ModalStore';
import SwitchField from '@/components/ui/inputs/inputSwitcher';

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
   const [dateRangeError, setDateRangeError] = useState<string | null>(null);

   useEffect(() => {
      setTransactionData(transaction);
   }, [transaction]);

   const handleFormChange = (formMethods: any) => {
      const bonusId = formMethods.watch('bonusId');
      const points = formMethods.watch('points');
      const year = formMethods.watch('year');
      const quarter = formMethods.watch('quarter');

      // Only validate if we have all the necessary data
      if (activeSavingPeriod && year && quarter) {
         // Simple year-quarter comparison instead of date objects
         const selectedYQ = year * 10 + quarter;
         const startYQ = activeSavingPeriod.startYear * 10 + activeSavingPeriod.startQuarter;
         const endYQ = activeSavingPeriod.endYear * 10 + activeSavingPeriod.endQuarter;
         
         if (selectedYQ < startYQ || selectedYQ > endYQ) {
            const errorMsg = `Vybrané období (${year}/${quarter}) je mimo rozsah aktivního šetřícího období (${activeSavingPeriod.startYear}/${activeSavingPeriod.startQuarter} - ${activeSavingPeriod.endYear}/${activeSavingPeriod.endQuarter})`;
            setDateRangeError(errorMsg);
         } else {
            setDateRangeError(null);
         }
      } else {
         // Clear error if we don't have enough data to validate
         setDateRangeError(null);
      }

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

         return await response.json();
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
            setTransactionData(transaction);
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
         customError={dateRangeError}
      >
         {(formMethods) => {
            React.useEffect(() => {
               // Initialize form values
               if (transactionData) {
                  formMethods.setValue('year', transactionData.year);
                  formMethods.setValue('quarter', transactionData.quarter);
               }
               
               const subscription = formMethods.watch((value, { name }) => {
                  if (name === 'bonusId' || name === 'points' || name === 'year' || name === 'quarter') {
                     handleFormChange(formMethods);
                  }
               });
               
               // Initial validation check
               handleFormChange(formMethods);
               
               return () => subscription.unsubscribe();
            }, [formMethods, transactionData]);

            return (
               <div className='gap-4 mt-8'>
                  <div className="flex flex-row gap-4">
                     {/* Material Tailwind styled select for year */}
                     <div className="w-1/2">
                        <Select
                           label="Rok"
                           value={(formMethods.watch('year')?.toString() || '')}
                           onChange={(value) => {
                              if (value) {
                                 const yearValue = parseInt(value);
                                 formMethods.setValue('year', yearValue, { shouldValidate: true });
                                 handleFormChange(formMethods);
                              }
                           }}
                        >
                           {yearDial.map(option => (
                              <Option key={option.value} value={option.value.toString()}>
                                 {option.label}
                              </Option>
                           ))}
                        </Select>
                     </div>

                     {/* Material Tailwind styled select for quarter */}
                     <div className="w-1/2">
                        <Select
                           label="Čtvrtletí"
                           value={(formMethods.watch('quarter')?.toString() || '')}
                           onChange={(value) => {
                              if (value) {
                                 const quarterValue = parseInt(value);
                                 formMethods.setValue('quarter', quarterValue, { shouldValidate: true });
                                 handleFormChange(formMethods);
                              }
                           }}
                        >
                           {quarterDial.map(option => (
                              <Option key={option.value} value={option.value.toString()}>
                                 {option.label}
                              </Option>
                           ))}
                        </Select>
                     </div>
                  </div>
                  
                  {dateRangeError && (
                     <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-500 text-sm">
                        {dateRangeError}
                     </div>
                  )}

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
                        <SwitchField
                           label="Přímý prodej"
                           name="directSale"
                           defaultValue={transactionData.directSale}
                        />
                     </div>
                  </div>
               </div>
            );
         }}
      </UniversalForm>
   );
}

export default TransactionForm;

