"use client"
import { Card, Input } from '@material-tailwind/react'
import React from 'react'
import InputField from '../ui/inputs/basicInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { savingPeriodValidationSchema } from '../../schemas/customerSchema'
import { Button } from '@material-tailwind/react'


type Props = {
   savingPeriod: any
}

const SavingPeriodForm = ({ savingPeriod }: Props) => {

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm({
      resolver: yupResolver(savingPeriodValidationSchema),
   });

   const onSubmit = async (data: any) => {
      console.log(data)
   }

   return (
      <Card className='flex flex-row p-4 gap-4 items-baseline'>
         <div>

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
         <Button onClick={handleSubmit(onSubmit)} >Uložit</Button>
      </Card>
   )
}

export default SavingPeriodForm