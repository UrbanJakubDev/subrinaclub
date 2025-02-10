"use client"
import InputField from '../ui/inputs/basicInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@material-tailwind/react'
import { toast } from 'react-toastify'
import { useModal } from '@/contexts/ModalContext'


type Props = {
   savingPeriod: any
   previousSavingPeriod?: any
   account_id?: number
   userName?: string
}

const SavingPeriodForm = ({ savingPeriod, previousSavingPeriod }: Props) => {

   return (
      <div className='flex p-4 gap-4 items-baseline m-4'>
         <div className='grid grid-cols-2'>
            <InputField
               label="Začátek šetřícího období"
               type='text'
               name='savingStartDate'
            />
            <InputField
               label="Konec šetřícího období"
               type='text'
               name='savingEndDate'
            />
            <InputField
               label="Aktivní"
               type='text'
               name='active'
            />
            <InputField
               label="Částka"
               type='text'
               name='balance'
            />
         </div>
      </div>
   )
}

export default SavingPeriodForm