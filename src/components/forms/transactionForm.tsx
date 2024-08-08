"use client";
import { ICustomer, ITransaction } from '@/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
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

type Props = {
   accountId: number;
   customer: ICustomer;
   savingPeriod: any;
   transactionId?: number;
};

const TransactionForm = (props: Props) => {
   const [loading, setLoading] = useState(false);
   const [defaultValues, setDefaultValues] = useState<any>(null);
   const [showForm, setShowForm] = useState(false);
   const [transactionType, setTransactionType] = useState('DEPOSIT');

   const modalTitle = `Transakce pro ${props.customer.fullName}`;
   const formTitle = `Aktivní šetřící období: ${props.savingPeriod.savingStartDate} - ${props.savingPeriod.savingEndDate}`;

   const { modalData, openModal, handleCloseModal } = useModal();

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      control,
      reset,
   } = useForm({
      resolver: yupResolver(transactionValidationSchema),
   });

   const getTransaction = async (id: number) => {
      try {
         const response = await fetch(`/api/transactions?transactionId=${id}`);
         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message);
         }

         setDefaultValues(result);
         reset(result); // Reset form with fetched data
      } catch (error) {
         console.error('Error:', error);
      }
   };


   // Reset form when modal is opneed for new transaction that means no transactionId is passed
   useEffect(() => {
      if (openModal && !modalData.transactionId) {
         const initialValues = {
            year: new Date().getFullYear(),
            quarter: 1,
            type: "DEPOSIT",
            amount: 0,
         };
         setDefaultValues(initialValues);
         reset(initialValues); // Reset form with initial values
      }
   }, [openModal, modalData.transactionId, reset]);



   // Reset form and fetch data after modal is opened
   useEffect(() => {
      if (openModal) {
         getTransaction(modalData.transactionId);
      }
   }, [openModal, modalData.transaction]);

   // Reset form after modal is closed
   useEffect(() => {
      if (!openModal) {
         reset();
      }
   }, [openModal, reset]);


   // Show form after default values are set
   useEffect(() => {
      if (defaultValues) {
         setShowForm(true);
      }
   }, [defaultValues]);


   // watch the amount input field and defaultValues.amount and set transaction type based on the amount value negative is withdraw and positive is deposit
   const amount = watch('amount');
   useEffect(() => {
      if (amount || defaultValues?.amount) {
         if (amount < 0 || defaultValues?.amount < 0) {
            setTransactionType('WITHDRAW');
         } else {
            setTransactionType('DEPOSIT');
         }
      }
   }, [amount]);




   const onSubmit = async (data: ITransaction) => {
      data.accountId = props.accountId;

      if (defaultValues.id) {
         try {
            setLoading(true);
            const response = await fetch(`/api/transactions?transactionId=${defaultValues.id}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
               throw new Error(result.message);
            }
            setLoading(false);
            toast.success('Transakce byla úspěšně upravena');
            handleCloseModal();
         } catch (error) {
            console.error('Error:', error);
            toast.error('Chyba při úpravě transakce');
            setLoading(false);
         }
         return;
      } else {

         try {
            setLoading(true);
            const response = await fetch(`/api/transactions`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
               toast.error(result.error);
               setLoading(false);
               return;
            }
            setLoading(false);
            toast.success('Transakce byla úspěšně vytvořena');
            handleCloseModal();

         } catch (error) {
            console.error('Error:', error);
            toast.error('Chyba při vytváření transakce');
            setLoading(false);
         }
      }
   };

   if (loading) {
      return <Loader />;
   }

   return (
      <ModalComponent
         modalId='transactionForm'
         title={modalTitle}
         description={formTitle}
      >
         {showForm && defaultValues && (
            <div className='p-4'>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex flex-row gap-4'>
                     <Controller
                        name="year"
                        control={control}
                        defaultValue={defaultValues.year}
                        rules={{ required: "Year is required" }}
                        render={({ field }) => (
                           <div>
                              <SimpleSelectInput
                                 label="Vybrat Rok..."
                                 options={yearSelectOptions()}
                                 value={field.value}
                                 onChange={field.onChange}
                              />
                              {errors.year && (
                                 <span className="text-red-500 text-xs">
                                    {errors.year.message}
                                 </span>
                              )}
                           </div>
                        )}
                     />

                     <Controller
                        name="quarter"
                        control={control}
                        defaultValue={defaultValues.quarter}
                        rules={{ required: "Quarter is required" }}
                        render={({ field }) => (
                           <div>
                              <SimpleSelectInput
                                 label="Vybrat Kvartál..."
                                 options={quarterSelectOptions()}
                                 value={field.value}
                                 onChange={field.onChange}
                              />
                              {errors.quarter && (
                                 <span className="text-red-500 text-xs">
                                    {errors.quarter.message}
                                 </span>
                              )}
                           </div>
                        )}
                     />
                  </div>
                  <div className='my-4'>
                     <InputField
                        label="Množství"
                        type="number"
                        name="amount"
                        register={register}
                        errors={errors}
                        defaultValue={defaultValues.amount}
                     />
                  </div>

                  {transactionType === 'WITHDRAW' && (
                     <div className='mb-4'>
                        <Typography children="Pole pro Výber bodů" />
                        <InputField
                           label="Description"
                           type="text"
                           name="description"
                           register={register}
                           errors={errors}
                           defaultValue={defaultValues.description}
                        />
                        <InputDateFiled
                           label="Přijetí objednávky"
                           name="acceptedBonusOrder"
                           register={register}
                           errors={errors}
                           defaultValue={defaultValues.acceptedBonusOrder}
                        />
                        <InputDateFiled
                           label="Odeslání Bonusu"
                           name="sentBonusOrder"
                           register={register}
                           errors={errors}
                           defaultValue={defaultValues.sentBonusOrder}
                        />
                        <InputField
                           label="Bonus - cena"
                           type="number"
                           name="bonusAmount"
                           register={register}
                           errors={errors}
                           defaultValue={defaultValues.bonusAmount}
                        />
                        <InputField
                           label="Bonus - jméno"
                           name="bonusName"
                           register={register}
                           errors={errors}
                           defaultValue={defaultValues.bonusName}
                        />
                     </div>
                  )}

                  <Button type="submit">Uložit</Button>
               </form>
            </div>
         )}
         {
            errors && (
               <pre>
                  {JSON.stringify(errors, null, 2)}
               </pre>
            )
         }
      </ModalComponent>
   );
};

export default TransactionForm;