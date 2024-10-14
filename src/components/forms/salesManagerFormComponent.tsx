"use client"

import React from 'react';
import { salesManagerValidationSchema } from "@/schemas/dealerSchema";
import { addSalesManager, refreshSalesManagersData, updateSalesManager } from "@/actions/salesManager";
import { ISalesManager } from "@/interfaces/interfaces";
import InputField from '@/components/ui/inputs/basicInput';
import InputSwitcher from '@/components/ui/inputs/inputSwitcher';
import TextAreaField from '@/components/ui/inputs/textareaInput';
import UniversalForm from '@/components/forms/universalForm';
import InputDateFiled from '@/components/ui/inputs/dateInput';
import { useRouter } from 'next/navigation';

const newSalesManager: ISalesManager = {
   fullName: "",
   email: "",
   phone: "",
   registrationNumber: 0,
   active: false,
   id: 0,
   publicId: '',
   birthDate: null,
   ico: '',
   registratedSince: null,
   salonName: '',
   address: '',
   town: '',
   psc: '',
   dealerId: 0,
};

type SalesManagerFormProps = {
   initialSalesManagerData?: any;
};

export default function SalesManagerFormComponent({ initialSalesManagerData }: SalesManagerFormProps) {
   const router = useRouter();
   const [salesManagerData, setSalesManagerData] = React.useState<ISalesManager>(initialSalesManagerData || newSalesManager);

   // Handle form submission
   const handleSubmit = async (data: ISalesManager) => {
      if (salesManagerData.id) {
         await updateSalesManager(salesManagerData.id.toString(), data);
      } else {
         await addSalesManager(data);
      }
      refreshSalesManagersData();
      router.refresh(); // This triggers a refresh of the current route
   };

   // If the initialSalesManagerData has changed, update the salesManagerData state and rerender the form
   React.useEffect(() => {
      setSalesManagerData(initialSalesManagerData || newSalesManager);
   }, [initialSalesManagerData]);

   return (
      <UniversalForm<ISalesManager>
         initialData={salesManagerData}
         validationSchema={salesManagerValidationSchema}
         onSubmit={handleSubmit}
         successMessage={salesManagerData.id ? "Prodejce byl úspěšně upraven." : "Prodejce byl úspěšně vytvořen."}
      >
         {() => (
            <div className="flex flex-col gap-6 my-6">
               <div className="flex gap-4">
                  <InputSwitcher
                     label="Aktivní"
                     name="active"
                     defaultValue={salesManagerData.active}
                  />
                  <InputField
                     label="Registrační číslo"
                     type="number"
                     name="registrationNumber"
                     defaultValue={salesManagerData.registrationNumber}
                  />
                  <InputField
                     label="IČO"
                     type="text"
                     name="ico"
                     defaultValue={salesManagerData.ico}
                  />
                  <InputDateFiled
                     label="Registrace od"
                     name="registratedSince"
                     defaultValue={salesManagerData?.registratedSince}
                  />
               </div>
               {/* Add more fields here, maintaining your desired structure and styling */}
               <div className="flex gap-4">
                  <InputField
                     label="Jméno a příjmení"
                     type="text"
                     name="fullName"
                     defaultValue={salesManagerData.fullName}
                  />
                  <InputDateFiled
                     label="Datum narození"
                     name="birthDate"
                     defaultValue={salesManagerData?.birthDate}
                  />
                  <InputField
                     label="Email"
                     type="email"
                     name="email"
                     defaultValue={salesManagerData.email}
                  />
                  <InputField
                     label="Telefon"
                     type="tel"
                     name="phone"
                     defaultValue={salesManagerData.phone}
                  />
               </div>
               <div className="flex gap-4">
                  <InputField
                     label="Adresa"
                     type="text"
                     name="address"
                     defaultValue={salesManagerData.address}
                  />
                  <InputField
                     label="Město"
                     type="text"
                     name="town"
                     defaultValue={salesManagerData.town}
                  />
                  <InputField
                     label="PSČ"
                     type="text"
                     name="psc"
                     defaultValue={salesManagerData.psc}
                  />
               </div>
               {/* Continue adding the rest of your fields */}
               <div className="flex gap-4">
                  <TextAreaField
                     label="Poznámka"
                     name="note"
                     defaultValue={salesManagerData.note}
                  />
               </div>
            </div>

         )}
      </UniversalForm>
   );
}