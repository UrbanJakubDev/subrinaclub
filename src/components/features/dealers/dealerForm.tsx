'use client'

import { useRouter } from "next/navigation";
import React from "react";
import InputSwitcher from "../../ui/inputs/inputSwitcher";
import InputField from "../../ui/inputs/basicInput";
import InputDateFiled from "../../ui/inputs/dateInput";
import TextAreaField from "../../ui/inputs/textareaInput";
import { updateDealerServerAction, addDealerServerAction, refreshDealersDataServerAction } from "@/actions/dealer";
import UniversalForm from "../../forms/universalForm";
import { DealerFormProps } from "@/lib/services/dealer/types";
import { Dealer } from "@/types/dealer";
import { CreateDealerDTO, dealerValidationSchema } from "@/lib/services/dealer/validation";

const newDealer: CreateDealerDTO = {
  ico: "",
  fullName: "",
  phone: null,
  email: null,
  registratedSince: null,
  address: null,
  town: null,
  psc: null,
  note: null,
};


export default function DealerForm({ initialDealerData }: DealerFormProps) {
  const router = useRouter();
  const [dealerData, setDealerData] = React.useState<Dealer>(initialDealerData || newDealer as Dealer);

  // Handle form submission
  const handleSubmit = async (data: Dealer): Promise<Dealer> => {
    console.log(data);
    if (data.id) {
      await updateDealerServerAction(data.id.toString(), data);
    } else {
      await addDealerServerAction(data);
    }
    refreshDealersDataServerAction();
    router.refresh(); // This triggers a refresh of the current route
    return data;
  }

  // If the initialDealerData has changed, update the dealerData state and rerender the form
  React.useEffect(() => {
    setDealerData(initialDealerData || newDealer as Dealer);
  }, [initialDealerData]);



  return (
    <UniversalForm<Dealer>
      initialData={dealerData}
      validationSchema={dealerValidationSchema}
      onSubmit={handleSubmit}
      successMessage={dealerData.id ? "Velkoobchod byl úspěšně upraven." : "Velkoobchod byl úspěšně vytvořen."}
    >
      {() => (
        <div className="flex flex-col gap-6 my-6">
          <div className="flex gap-4">
            <InputSwitcher
              label="Aktivní"
              name="active"
              // If customer is active set default value to true, otherwise false or if customer is new set default value to true
              defaultValue={dealerData.active}
            />
            <InputField
              label="Registrační číslo"
              type="number"
              name="registrationNumber"
              defaultValue={dealerData.registrationNumber}
            />
            <InputField
              label="IČO"
              type="text"
              name="ico"
              defaultValue={dealerData.ico}
            />
            <InputDateFiled
              label="Registrace od"
              name="registratedSinceD"
              defaultValue={dealerData.registratedSince}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Jméno a příjmení"
              type="text"
              name="fullName"

              defaultValue={dealerData.fullName}

            />
        
          
            <InputField
              label="Email"
              type="email"
              name="email"

              defaultValue={dealerData.email}

            />

            <InputField
              label="Telefon"
              type="tel"
              name="phone"

              defaultValue={dealerData.phone}

            />
          </div>

          <div className="flex gap-4">
            <InputField
              label="Adresa"
              type="text"
              name="address"

              defaultValue={dealerData.address}

            />
            <InputField
              label="Město"
              type="text"
              name="town"

              defaultValue={dealerData.town}

            />
            <InputField
              label="PSČ"
              type="text"
              name="psc"

              defaultValue={dealerData.psc}

            />
          </div>
          <div className="flex gap-4">
            <TextAreaField
              label="Poznámka"
              name="note"

              defaultValue={dealerData.note}
            />
          </div>
          {dealerData && (
            <pre>
              {JSON.stringify(dealerData, null, 2)}
            </pre>
          )}
        </div>
      )}
    </UniversalForm>
  );
}