'use client'

import { ISalesManager } from "@/interfaces/interfaces";
import { salesManagerValidationSchema } from "@/schemas/dealerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { Props } from "react-apexcharts";
import { useForm } from "react-hook-form";
import InputField from "../ui/inputs/basicInput";
import { Button, Card } from "@material-tailwind/react";
import InputDateFiled from "../ui/inputs/dateInput";
import InputSwitcher from "../ui/inputs/inputSwitcher";
import TextAreaField from "../ui/inputs/textareaInput";
import { toast } from "react-toastify";

export default function SalesManagerForm({ sales_manager }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [salesManagerData, setSalesManagerData] = React.useState<ISalesManager>(sales_manager);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(salesManagerValidationSchema),
  });

  const getSalesManagerById = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales-managers?id=${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSalesManagerData(result);
      setLoading(false);
    } catch (error) {
      toast.error("Něco se pokazilo");
    }
  };

  const handleUpdate = async (data: ISalesManager) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales-managers?id=${sales_manager.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Změny byly uloženy");
      setLoading(false);
    } catch (error) {
      toast.error("Něco se pokazilo");
    }
  }


  const onSubmit = async (data: ISalesManager) => {
    handleUpdate(data);
    toast.success("Změny byly uloženy");
    await getSalesManagerById(sales_manager.id);
  }


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
              defaultValue={salesManagerData.active}
              errors={errors}
            />

            <InputField
              label="Registrační číslo"
              type="number"
              name="registrationNumber"
              register={register}
              defaultValue={salesManagerData.registrationNumber.toString()}
              errors={errors}
              disabled
            />
            <InputField
              label="IČO"
              type="text"
              name="ico"
              register={register}
              defaultValue={salesManagerData.ico}
              errors={errors}
            />
            <InputDateFiled
              label="Registrace od"
              type="date"
              name="registratedSinceD"
              register={register}
              defaultValue={salesManagerData.registratedSinceD}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Jméno a příjmení"
              type="text"
              name="fullName"
              register={register}
              defaultValue={salesManagerData.fullName}
              errors={errors}
            />
            <InputDateFiled
              label="Datum narození"
              type="date"
              name="birthDateD"
              register={register}
              defaultValue={salesManagerData.birthDateD}
              errors={errors}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              register={register}
              defaultValue={salesManagerData.email}
              errors={errors}
            />

            <InputField
              label="Telefon"
              type="tel"
              name="phone"
              register={register}
              defaultValue={salesManagerData.phone}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Salón"
              type="text"
              name="salonName"
              register={register}
              defaultValue={salesManagerData.salonName}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Adresa"
              type="text"
              name="address"
              register={register}
              defaultValue={salesManagerData.address}
              errors={errors}
            />
            <InputField
              label="Město"
              type="text"
              name="town"
              register={register}
              defaultValue={salesManagerData.town}
              errors={errors}
            />
            <InputField
              label="PSČ"
              type="text"
              name="psc"
              register={register}
              defaultValue={salesManagerData.psc}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <TextAreaField
              label="Poznámka"
              name="note"
              register={register}
              defaultValue={salesManagerData.note}
            />
          </div>
         </div>
         <div className="w-full flex justify-end gap-3 mt-4">
          <Button onClick={handleSubmit(onSubmit)}>Uložit</Button>
          <Button color="red" onClick={() => router.push("/users")}>Zrušit</Button>
        </div>
      </form>
   </Card>
  )
}