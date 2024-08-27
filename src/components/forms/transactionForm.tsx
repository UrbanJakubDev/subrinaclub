"use client";
import { ITransaction } from '@/interfaces/interfaces';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import InputField from '../ui/inputs/basicInput';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionValidationSchema } from '@/schemas/customerSchema';
import Button from '../ui/button';
import { quarterSelectOptions, yearSelectOptions } from '@/utils/dateFnc';
import InputDateFiled from '../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';
import { Typography } from '@material-tailwind/react';
import SimpleSelectInput from '../ui/inputs/simpleSelectInput';
import ModalComponent from '../ui/modal';
import { useModal } from '@/contexts/ModalContext';
import { useCustomer } from '@/contexts/CustomerContext';

type Props = {
   transactionId?: number;
};

const TransactionForm = ({ transactionId }: Props) => {
   const { customer, account, activeSavingPeriod } = useCustomer();
   const { modalData, openModal, handleModalSubmitted } = useModal();

   const [loading, setLoading] = useState(false);
   const [bonusesDial, setBonusesDial] = useState<any>(null);
   const [transactionType, setTransactionType] = useState('DEPOSIT');

   const savingPeriod = useMemo(() => activeSavingPeriod, [activeSavingPeriod]);
   const accountId = useMemo(() => account?.id, [account]);
   const modalTitle = `Transakce pro ${customer?.fullName}`;
   const formTitle = `Aktivní šetřící období: ${savingPeriod?.savingStartDate} - ${savingPeriod?.savingEndDate}`;

   const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm({
      resolver: yupResolver(transactionValidationSchema),
      defaultValues: {
         amount: 0,
         bonusAmount: 0,
      },
   });

   // Fetch bonuses and transaction data
   const fetchBonuses = useCallback(async () => {
      try {
         const response = await fetch(`/api/dictionaries/bonuses/options`);
         if (!response.ok) throw new Error('Failed to fetch bonuses');
         setBonusesDial(await response.json());
      } catch (error) {
         console.error('Error fetching bonuses:', error);
      }
   }, []);

   const fetchTransaction = useCallback(async (id: number) => {
      try {
         const response = await fetch(`/api/transactions?transactionId=${id}`);
         if (!response.ok) throw new Error('Failed to fetch transaction');
         const result = await response.json();
         reset(result); // Reset form with fetched data
      } catch (error) {
         console.error('Error fetching transaction:', error);
      }
   }, [reset]);

   // Determine transaction type based on amount
   useEffect(() => {
      const amount = watch('amount');
      if (amount < 0) {
         setTransactionType('WITHDRAW');
      } else {
         setTransactionType('DEPOSIT');
      }
   }, [watch]);

   // Initial setup when modal opens
   useEffect(() => {
      if (openModal) {
         fetchBonuses();
         if (modalData.transactionId) {
            fetchTransaction(modalData.transactionId);
         } else {
            reset({
               year: new Date().getFullYear(),
               quarter: 1,
               type: "DEPOSIT",
               amount: 0,
            });
         }
      }
   }, [openModal, modalData.transactionId, fetchBonuses, fetchTransaction, reset]);

   const onSubmit = async (data: ITransaction) => {
      data.accountId = accountId;
      setLoading(true);

      try {
         const method = modalData.transactionId ? 'PUT' : 'POST';
         const endpoint = modalData.transactionId ? `/api/transactions?transactionId=${modalData.transactionId}` : '/api/transactions';

         const response = await fetch(endpoint, {
            method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            const result = await response.json();
            toast.error(result.message || 'Chyba při zpracování transakce');
            throw new Error(result.message);
         }

         handleModalSubmitted();
         toast.success(`Transakce byla úspěšně ${method === 'PUT' ? 'upravená' : 'vytvořena'}`);
      } catch (error) {
         console.error('Error submitting transaction:', error);
      } finally {
         setLoading(false);
      }
   };

   if (loading || !customer || !customer.accounts.length || !savingPeriod) {
      return <Loader />;
   }

   return (
      <ModalComponent modalId="transactionForm" title={modalTitle} description={formTitle}>
         {bonusesDial && (
            <div className="p-4">
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-row gap-4">
                     <Controller
                        name="year"
                        control={control}
                        render={({ field }) => (
                           <SimpleSelectInput
                              label="Vybrat Rok..."
                              options={yearSelectOptions()}
                              value={field.value}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     {errors.year && <span className="text-red-500 text-xs">{errors.year.message}</span>}

                     <Controller
                        name="quarter"
                        control={control}
                        render={({ field }) => (
                           <SimpleSelectInput
                              label="Vybrat Kvartál..."
                              options={quarterSelectOptions()}
                              value={field.value}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     {errors.quarter && <span className="text-red-500 text-xs">{errors.quarter.message}</span>}
                  </div>

                  <div className="my-4">
                     <InputField
                        label="Množství"
                        type="number"
                        name="amount"
                        register={register}
                        errors={errors}
                     />
                     <InputDateFiled
                        label="Přijetí objednávky"
                        name="acceptedBonusOrder"
                        register={register}
                        errors={errors}
                     />
                  </div>


                  <div className="mb-4">
                     <Typography>Vyběr bodů</Typography>
                     <InputField
                        label="Popis"
                        type="text"
                        name="description"
                        register={register}
                        errors={errors}
                     />

                     <InputDateFiled
                        label="Odeslání Bonusu"
                        name="sentBonusOrder"
                        register={register}
                        errors={errors}
                     />
                     <InputField
                        label="Bonus - cena"
                        type="number"
                        name="bonusAmount"
                        register={register}
                        errors={errors}
                        defaultValue={0}
                     />
                     <Controller
                        name="bonusId"
                        control={control}
                        render={({ field }) => (
                           <SimpleSelectInput
                              label="Vybrat Bonus..."
                              options={bonusesDial}
                              value={field.value}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     {errors.bonusId && <span className="text-red-500 text-xs">{errors.bonusId.message}</span>}
                  </div>


                  <Button type="submit">Uložit</Button>
               </form>
            </div>
         )}
      </ModalComponent>
   );
};

export default TransactionForm;
