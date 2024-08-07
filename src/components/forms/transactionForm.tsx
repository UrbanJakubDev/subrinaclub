"use client";
import { ICustomer, ITransaction } from '@/interfaces/interfaces';
import React, { Suspense, use, useEffect } from 'react';
import InputField from '../ui/inputs/basicInput';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionValidationSchema } from '@/schemas/customerSchema';
import Button from '../ui/button';
import { quarterSelectOptions, yearSelectOptions } from '@/utils/dateFnc';
import InputDateFiled from '../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';
import { Card, Typography } from '@material-tailwind/react';
import SimpleSelectInput from '../ui/inputs/simpleSelectInput';
import ModalComponent from '../ui/modal';
import { useModal } from '@/contexts/ModalContext';

type Props = {
   accountId: number;
   customer: ICustomer
   savingPeriod: any
   transactionId?: number
}

const TransactionForm = (props: Props) => {
   const [transactionType, setTransactionType] = React.useState<string>()
   const [loading, setLoading] = React.useState(false)
   const [defaultValues, setDefaultValues] = React.useState<ITransaction>()
   const [showForm, setShowForm] = React.useState(false)

   const modalTitle = `Transakce pro ${props.customer.fullName}`
   const formTitle = `Aktivní šetřící období: ${props.savingPeriod.savingStartDate} - ${props.savingPeriod.savingEndDate}`

   const { modalData, openModal } = useModal()

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      control,
      reset,
   } = useForm({
      defaultValues: async () => fetch(`/api/transactions?transactionId=${props.accountId}`),
      resolver: yupResolver(transactionValidationSchema),
   })



   const getTransaction = async (id: number) => {
      try {
         const response = await fetch(`/api/transactions?transactionId=${id}`)
         const result = await response.json()

         if (!response.ok) {
            throw new Error(result.message)
         }

         setDefaultValues(result)
      } catch (error) {
         console.error('Error:', error)
      }
   }


   useEffect(() => {
      if (props.transactionId) {
         setDefaultValues(undefined)
         getTransaction(props.transactionId)
      }
   }, [props.transactionId])


   useEffect(() => {
      if (modalData.transactionId) {
         setDefaultValues(undefined)
         reset()
         getTransaction(modalData.transactionId)
      }
   }
      , [modalData.transactionId])


   // On modal close reset form
   useEffect(() => {
      if (!openModal) {
         setDefaultValues(undefined)
         reset()
      }
   }, [openModal])


   // Show form if defaultValues are set or if no transactionId is set in modalData this means that we are creating new transaction
   useEffect(() => {
      if (defaultValues || !modalData.transactionId) {
         setShowForm(true)
      }
   }
      , [defaultValues, modalData.transactionId])


   const onSubmit = async (data: ITransaction) => {
      data.accountId = props.accountId

      if (props.transactionId) {
         try {
            setLoading(true)
            const response = await fetch(`/api/transactions?transactionId=${props.transactionId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
               throw new Error(result.message)
            }
            setLoading(false)
            toast.success('Transakce byla úspěšně upravena')
         }
         catch (error) {
            console.error('Error:', error)
         }

      }

      try {
         setLoading(true)
         const response = await fetch(`/api/transactions`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         })

         const result = await response.json()

         if (!response.ok) {
            toast.error(result.error)
         }
         setLoading(false)
         toast.success('Transakce byla úspěšně vytvořena')
      } catch (error) {
         console.error('Error:', error)
      }
   }

   useEffect(() => {
      setTransactionType(watch('type'))
   }
      , [watch('type')])


   if (loading) {
      return <Loader />
   }

   return (
      <ModalComponent
         modalId='transactionForm'
         title={modalTitle}
         description={formTitle} >

         <Suspense fallback={<Loader />}>
            {/* If  */}
            {showForm && (
               <div className='p-4'>
                  <form>
                     <div className='flex flex-row gap-4'>
                        <Controller
                           name="year"
                           control={control}
                           defaultValue={defaultValues?.year || new Date().getFullYear()}
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
                           defaultValue={defaultValues?.quarter || 1}
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

                        <Controller
                           name="type"
                           control={control}
                           defaultValue={defaultValues?.type || "DEPOSIT"}
                           rules={{ required: "Type is required" }}
                           render={({ field }) => (
                              <div>
                                 <SimpleSelectInput
                                    label="Vybrat Typ..."
                                    options={[
                                       { id: "DEPOSIT", name: "Vklad" },
                                       { id: "WITHDRAW", name: "Výběr" },
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                 />
                                 {errors.type && (
                                    <span className="text-red-500 text-xs">
                                       {errors.type.message}
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
                           defaultValue={defaultValues?.amount}
                        />
                     </div>


                     {/* If transaction type = 2 or defaultValues.type = "WTHDRAW" open the form */}
                     {transactionType === "WITHDRAW" || defaultValues?.type === "WITHDRAW" && (
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
                     <Button onClick={handleSubmit(onSubmit)} >Uložit</Button>

                  </form >
               </div>
            )}
         </Suspense>
      </ModalComponent>
   )
}

export default TransactionForm