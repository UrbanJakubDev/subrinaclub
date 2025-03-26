"use client";
import { SubmitHandler } from "react-hook-form";
import InputField from "@/components/ui/inputs/basicInput";
import { useRouter } from "next/navigation";
import React from "react";
import { createBonusServerAction, refreshBonusesDataServerAction, updateBonusServerAction } from "@/actions/bonus";
import UniversalForm from "@/components/forms/universalForm";
import { bonusValidationSchema, CreateBonusDTO } from "@/lib/services/bonus/validation";
import { Bonus } from "@prisma/client";
import { BonusFormProps } from "@/lib/services/bonus/types";

const newBonusData: CreateBonusDTO = {
  name: "",
  points: 0,
  price: 0,
};

export default function BonusForm({ initialBonusData }: BonusFormProps) {
  const router = useRouter();
  const [bonusData, setBonusData] = React.useState<Bonus>(initialBonusData || newBonusData as Bonus);

  // Handle form submission
  const handleSubmit: SubmitHandler<Bonus> = async (data) => {
    
    if (bonusData.id) {
      await updateBonusServerAction(bonusData.id.toString(), data);
    }
    else {
      await createBonusServerAction(data);
      router.push("/dictionaries/bonus");
    }
    refreshBonusesDataServerAction();
    router.refresh(); // This triggers a refresh of the current route
  };

  // If the initialBonusData has changed, update the bonusData state and rerender the form
  React.useEffect(() => {
    setBonusData(initialBonusData || newBonusData as Bonus);
  }, [initialBonusData]);

  return (
    <UniversalForm<Bonus>
      initialData={bonusData}
      validationSchema={bonusValidationSchema}
      onSubmit={handleSubmit}
      successMessage={bonusData.id ? "Bonus byl upraven" : "Bonus byl vytvořen"}
    >
      {() => (
        <div className="flex flex-col gap-6 my-6 w-full">
          <p>
            Formulář pro vytvoření nebo úpravu bonusu
          </p>
          <InputField
            label="Jméno bonusu"
            type="text"
            name="name"
            customClass="min-w-[600px]"
            defaultValue={bonusData?.name}
          />
          <div className="flex flex-row gap-6 justify-between min-w-[600px]">

            <InputField
              label="Body"
              type="number"
              name="points"
              customClass="w-1/2"
              defaultValue={bonusData.points}
            />
            <InputField
              label="Hodnota"
              type="number"
              name="price"
              customClass="w-1/2"
              defaultValue={bonusData.price}
            />
          </div>
          <InputField
            label="Popis"
            type="text"
            name="description"
            customClass="min-w-[600px]"
            defaultValue={bonusData.description}
          />
        </div>
      )}


    </UniversalForm>
  );
}
