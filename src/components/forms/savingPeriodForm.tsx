"use client"
import { Card, Input } from '@material-tailwind/react'
import React from 'react'
import InputField from '../ui/inputs/basicInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { savingPeriodValidationSchema } from '../../schemas/customerSchema'
import { Button } from '@material-tailwind/react'
import { createSavingPeriod, updateSavingPeriod } from '@/db/queries/savingPeridos'


type Props = {
   savingPeriod: any
   account_id?: number
}

const SavingPeriodForm = ({ savingPeriod, account_id }: Props) => {

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm({
      resolver: yupResolver(savingPeriodValidationSchema),
   });


   const addSavingPeriod = async (account_id: any, data: any) => {
      const response = await fetch(`/api/saving-periods?account_id=${account_id}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         throw new Error(response.statusText);
      }

      return response.json();

   }

   const updateSavingPeriod = async (id: any, data: any) => {
      const response = await fetch(`/api/saving-periods?id=${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         throw new Error(response.statusText);
      }

      return response.json();

   }



   const onSubmit = async (data: any) => {
      if (savingPeriod.id) {
         updateSavingPeriod(savingPeriod.id, data)
      } else {
         addSavingPeriod(account_id, data)
      }
   }


   return (
      <div className='flex p-4 gap-4 items-baseline m-4'>
         {account_id && <span>Účet: {account_id}</span>}
         <div className='grid grid-cols-2'>
            <InputField
               label="Začátek šetřícího období"
               type='text'
               name='savingStartDate'
               register={register}
               errors={errors}
               defaultValue={savingPeriod.savingStartDate}
            />
            <InputField
               label="Konec šetřícího období"
               type='text'
               name='savingEndDate'
               register={register}
               errors={errors}
               defaultValue={savingPeriod.savingEndDate}
            />
            <InputField
               label="Aktivní"
               type='text'
               name='active'
               register={register}
               errors={errors}
               defaultValue={savingPeriod.active}
            />
            <InputField
               label="Částka"
               type='text'
               name='balance'
               register={register}
               errors={errors}
               defaultValue={savingPeriod.balance}
            />
         </div>
         {savingPeriod.id && <Button onClick={handleSubmit(onSubmit)} >Uložit</Button>}
         {!savingPeriod.id && <Button onClick={handleSubmit(onSubmit)}>Vytvořit</Button>}
      </div>
   )
}

export default SavingPeriodForm