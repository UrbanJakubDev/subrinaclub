'use client'

import { IDealer } from "@/interfaces/interfaces";
import { dealerValidationSchema } from "@/schemas/dealerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import InputSwitcher from "../ui/inputs/inputSwitcher";
import InputField from "../ui/inputs/basicInput";
import InputDateFiled from "../ui/inputs/dateInput";
import TextAreaField from "../ui/inputs/textareaInput";

type Props = {
   dealer: IDealer;
   dials: any;
};

export default function DealerForm({ dealer, dials }: Props) {
   const [loading, setLoading] = React.useState(false);
   const [dealerData, setDealerData] = React.useState<IDealer>(dealer);
   const router = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm({
      resolver: yupResolver(dealerValidationSchema),
   });


   const getDealerById = async (id: number) => {
      try {
         setLoading(true);
         const response = await fetch(`/api/dealers?id=${id}`);
         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message);
         }

         setDealerData(result);
         setLoading(false);
      } catch (error) {
         console.error("Error:", error);
      }
   };

   const onSubmit = async (data: IDealer) => {
      console.log(data);
   };

   return (
      <Card className="mx-auto p-4">
         <form>
         <div className="flex flex-col gap-6 my-6">
          <div className="flex gap-4">
            <InputSwitcher
              label="Aktivní"
              name="active"
              register={register}
              // If customer is active set default value to true, otherwise false or if customer is new set default value to true
              defaultValue={dealerData.active}
              errors={errors}
            />

            <InputField
              label="Registrační číslo"
              type="number"
              name="registrationNumber"
              register={register}
              defaultValue={dealerData.registrationNumber.toString()}
              errors={errors}
              disabled
            />
            <InputField
              label="IČO"
              type="text"
              name="ico"
              register={register}
              defaultValue={dealerData.ico}
              errors={errors}
            />
            <InputDateFiled
              label="Registrace od"
              type="date"
              name="registratedSinceD"
              register={register}
              defaultValue={dealerData.registratedSinceD}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Jméno a příjmení"
              type="text"
              name="fullName"
              register={register}
              defaultValue={dealerData.fullName}
              errors={errors}
            />
            <InputDateFiled
              label="Datum narození"
              type="date"
              name="birthDateD"
              register={register}
              defaultValue={dealerData.birthDateD}
              errors={errors}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              register={register}
              defaultValue={dealerData.email}
              errors={errors}
            />

            <InputField
              label="Telefon"
              type="tel"
              name="phone"
              register={register}
              defaultValue={dealerData.phone}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Salón"
              type="text"
              name="salonName"
              register={register}
              defaultValue={dealerData.salonName}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Adresa"
              type="text"
              name="address"
              register={register}
              defaultValue={dealerData.address}
              errors={errors}
            />
            <InputField
              label="Město"
              type="text"
              name="town"
              register={register}
              defaultValue={dealerData.town}
              errors={errors}
            />
            <InputField
              label="PSČ"
              type="text"
              name="psc"
              register={register}
              defaultValue={dealerData.psc}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <TextAreaField
              label="Poznámka"
              name="note"
              register={register}
              defaultValue={dealerData.note}
            />
          </div>
        
        </div>

        <div className="w-full flex justify-end gap-3 mt-4">
          <Button onClick={handleSubmit(onSubmit)}>Uložit</Button>
          <Button color="red" onClick={() => router.push("/users")}>Zrušit</Button>
        </div>
         </form>
      </Card>
   );
}