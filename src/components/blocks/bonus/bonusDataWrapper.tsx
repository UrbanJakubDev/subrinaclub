'use client'
import BonusesTable from "@/components/tables/bonusesTable";
import Loader from "@/components/ui/loader";
import { useModal } from "@/contexts/ModalContext";
import { useEffect, useState } from "react";

type Props = {
   initalData: any[]
}

export default function BonusDataWrapper({ initalData }: Props) {
   const { modalSubmitted, setModalSubmitted } = useModal();

   const [bonusData, setBonusData] = useState(initalData);

   const fetchBonuses = async () => {
      const response = await fetch("/api/dictionaries/bonuses");
      if (response.ok) {
         const data = await response.json();
         return data;
      } else {
         console.error("Failed to fetch bonuses");
      }
   }

   // Fetch bonuses if modal was submitted
   useEffect(() => {
      if (modalSubmitted) {
         setBonusData(null);

         const fetchData = async () => {
            const data = await fetchBonuses();
            setBonusData(data);

         }

         fetchData();
         setModalSubmitted(false);

      }
   }
      , [modalSubmitted]);


   if (!bonusData) {
      return <Loader />
   }

   return (
      <>
         <BonusesTable defaultData={bonusData} />
      </>
   )
}