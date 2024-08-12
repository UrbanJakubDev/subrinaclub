"use client"

import BonusForm from "@/components/forms/bonusForm"
import ModalComponent from "../../ui/modal"
import { useModal } from "@/contexts/ModalContext"
import { useEffect, useState } from "react";

export default function BonusFormComponent() {

   const [formData, setFormData] = useState<any>()
   const { modalData, modalSubmitted }: { modalData: any } = useModal() as { modalData: any };



   // Get formData from modalData
   useEffect(() => {
      setFormData(modalData.transactionId)
   }, [modalData])


   // Fetch bonuses data on modal subitted
   const getAllBonuses = async () => {
      const response = await fetch('/api/dictionaries/bonuses');
      return await response.json();
   }

   // Fetch all bonuses on modal submitted
   useEffect(() => {
      if (modalSubmitted) {
         const bonuses = getAllBonuses();
         setFormData(bonuses);
      }
   }
      , [modalSubmitted])


   return (
      <>
         <pre>
            {JSON.stringify(modalData, null, 2)}
         </pre>
         <pre>
            {JSON.stringify(modalSubmitted, null, 2)}
         </pre>
         <ModalComponent
            modalId='bonusFormModal'
            title='Nový bonus'
            description='Zadejte nový bonus'
         >

            {/* TransactionId is object data ned to rename */}
            <BonusForm bonusData={formData} />
         </ModalComponent>
      </>
   )
}