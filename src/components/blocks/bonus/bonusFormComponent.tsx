"use client";

import { useEffect, useState } from "react";
import BonusForm from "@/components/forms/bonusForm";
import ModalComponent from "@/components/ui/modal";
import { useModal } from "@/contexts/ModalContext";
import { toast } from "react-toastify";

export default function BonusFormComponent() {
   const [formData, setFormData] = useState<any>(null);
   const { modalData, handleModalSubmitted } = useModal();

   // Set default values for a new bonus
   const defaultBonusData = {
      name: "",
      points: 0,
      price: 0,
      active: true,
      description: "",
   };

   useEffect(() => {
      // If modalData contains a transactionId, it's an edit; otherwise, it's a new record
      setFormData(modalData.transactionId || defaultBonusData);
   }, [modalData]);

   const handleFormSubmit = async (data: any) => {
      const isUpdate = !!data.id;
      const endpoint = isUpdate
         ? `/api/dictionaries/bonuses/${data.id}`
         : `/api/dictionaries/bonuses`;

      const method = isUpdate ? "PUT" : "POST";

      try {
         const response = await fetch(endpoint, {
            method,
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            throw new Error(`Error ${isUpdate ? "updating" : "creating"} bonus`);
         }

         await response.json();
         if (isUpdate) {
            toast.success("Bonus byl upraven");

         } else {
            toast.success("Bonus byl vytvořen");

         }
      } catch (error) {
         toast.error(`Chyba při ${isUpdate ? "úpravě" : "vytvoření"} bonusu ${error}`);
      } finally {
         handleModalSubmitted();
      }
   };

   return (
      <ModalComponent
         modalId="bonusFormModal"
         title={formData?.id ? "Upravit bonus" : "Nový bonus"}
         description={formData?.id ? "Upravte existující bonus" : "Zadejte nový bonus"}
      >
         {/* The key prop is set to trigger re-render when formData changes */}
         <BonusForm
            key={formData?.id || "new"}
            bonusData={formData}
            onSubmit={handleFormSubmit}
         />
      </ModalComponent>
   );
}
