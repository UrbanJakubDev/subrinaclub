"use client"

import { resolve } from "path"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useModal } from "@/contexts/ModalContext"
import InputField from "../ui/inputs/basicInput"
import { Button } from "@material-tailwind/react"


type BonusData = {
   id?: number
   active?: boolean
   name: string
   description?: string
   points?: number
   price?: number
}

type Props = {
   bonusData?: BonusData
}

const schema = yup.object().shape({
   name: yup.string().required('Název je povinný'),
   points: yup.number().nullable(),
   price: yup.number().nullable(),
})

export default function BonusForm({ bonusData }: Props) {

   const { handleModalSubmitted } = useModal();

   const [loading, setLoading] = useState(false)
   const [formData, setFormData] = useState<BonusData | null>(
      bonusData || {
         active: true,
         name: '',
         points: 0,
         price: 0
      }
   )

   useEffect(() => {
      if (bonusData) setFormData(bonusData);
   }, [bonusData]);


   // React hook form definition
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
   } = useForm({
      resolver: yupResolver(schema),
   });


   // Handle update bonus
   const updateBonus = async (data: BonusData) => {
      try {
         const response = await fetch(`/api/dictionaries/bonuses/${data.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         })
         if (!response.ok) {
            throw new Error('Error updating bonus')
         }
         const result = await response.json()
         console.log(result)

         handleModalSubmitted()
      } catch (error) {
         console.error('Error:', error)
      }
   }

   // Handle create bonus
   const createBonus = async (data: BonusData) => {
      try {
         const response = await fetch(`/api/dictionaries/bonuses`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         })
         if (!response.ok) {
            throw new Error('Error creating bonus')
         }
         const result = await response.json()
         console.log(result)
      } catch (error) {
         console.error('Error:', error)
      }
   }

   // Handle form submit
   const onSubmit: SubmitHandler<BonusData> = (data) => {

      const dataToSend = { ...data, id: formData?.id || undefined }

      if (formData?.id) {
         updateBonus(dataToSend)
      } else {
         createBonus(dataToSend)
      }
   }


   if (loading || !formData) {
      return <div>Loading...</div>
   }

   return (
      <div>
         {errors && (
            <pre>
               {JSON.stringify(errors, null, 2)}

            </pre>
         )}
         {formData && (
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="flex">
                  <InputField
                     label="Jméno bonusu"
                     type="text"
                     name="name"
                     register={register}
                     errors={errors}
                     defaultValue={formData.name}
                  />
                  <InputField
                     label="Body"
                     type="number"
                     name="points"
                     register={register}
                     errors={errors}
                     defaultValue={formData.points}
                  />
                  <InputField
                     label="Hodnota"
                     type="number"
                     name="price"
                     register={register}
                     errors={errors}
                     defaultValue={formData.price}
                  />
               </div>
               <div className="flex justify-end">
                  <Button type="submit">Uložit</Button>
               </div>
            </form>
         )}
      </div>
   )

}