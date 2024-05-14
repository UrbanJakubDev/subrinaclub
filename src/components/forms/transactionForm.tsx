"use client"

import { IAccount, ITransaction } from '@/interfaces/interfaces';
import React, { use, useEffect } from 'react'
import InputField from '../ui/inputs/basicInput';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionValidationSchema } from '@/schemas/customerSchema';
import Button from '../ui/button';
import SelectField from '../ui/inputs/selectInput';
import { quarterSelectOptions, yearSelectOptions } from '@/utils/dateFnc';
import { TransactionType } from '@prisma/client';
import InputDateFiled from '../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';

type Props = {
   accountId: number;
   onTransactionCreated: () => void;
}

const TransactionForm = (props: Props) => {
   const [transaction, setTransaction] = React.useState<ITransaction>()
   const [transactionType, setTransactionType] = React.useState<string>("DEPOSIT")
   const [loading, setLoading] = React.useState(false)
   const router = useRouter()


   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm({
      resolver: yupResolver(transactionValidationSchema),
   })

   const onSubmit = async (data: ITransaction) => {
      data.accountId = props.accountId

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
            throw new Error(result.message)
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
      <div>
         <form>
            <div className='flex flex-row gap-4'>
               <SelectField
                  label="Year"
                  name="year"
                  options={yearSelectOptions()}
                  defaultValue={new Date().getFullYear().toString()}
                  register={register}
                  errors={errors}

               />
               <SelectField
                  label="Quarter"
                  name="quarter"
                  options={quarterSelectOptions()}
                  defaultValue={Math.ceil((new Date().getMonth() + 1) / 3).toString()}
                  register={register}
                  errors={errors}
               />
               <SelectField
                  label="Type"
                  name="type"
                  options={[
                     { id: 'DEPOSIT', name: 'Vložení' },
                     { id: 'WITHDRAW', name: 'Výběr' },
                  ]}
                  defaultValue={transactionType}
                  register={register}
                  errors={errors}
               />
            </div>
            <div className='mb-4'>
               <InputField
                  label="Množství"
                  type="number"
                  name="amount"
                  register={register}
                  errors={errors}
               />
            </div>

            {transactionType === TransactionType.WITHDRAW && (
               <div className='mb-4'>
                  <InputField
                     label="Description"
                     type="text"
                     name="description"
                     register={register}
                     errors={errors}
                  />
                  <InputDateFiled
                     label="Přijetí objednávky"
                     name="acceptedBonusOrder"
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
                  />
                  <InputField
                     label="Bonus - jméno"
                     name="bonusName"
                     register={register}
                     errors={errors}
                  />
               </div>
            )}
            <Button variant='primary' onClick={handleSubmit(onSubmit)} >Submit</Button>
         </form >
      </div >
   )
}

export default TransactionForm