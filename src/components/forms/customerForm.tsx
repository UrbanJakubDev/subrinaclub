"use client";

import { ICustomer } from "@/interfaces/interfaces";
import { useForm } from "react-hook-form";
import Button from "../ui/button";
import { updateCustomerById } from "@/db/queries/customers";
import React from "react";
import Loader from "../ui/loader";
import InputField from "../ui/inputs/basicInput";
import TextAreaField from "../ui/inputs/textareaInput";
import SelectField from "../ui/inputs/selectInput";
import { yupResolver } from "@hookform/resolvers/yup"
import { customerValidationSchema } from "@/schemas/customerSchema";
import InputDateFiled from "../ui/inputs/dateInput";

type Props = {
  customer: ICustomer;
  dials: any;
};

type InputFieldProps = {
  label: string;
  name: string;
  type: string;
};

export default function CustomerForm({ customer, dials }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState<ICustomer>(customer);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(customerValidationSchema),
  })

  const onSubmit = async (data: ICustomer) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers?id=${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Result:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto">
      <pre>
        {JSON.stringify(customerData, null, 2)}
      </pre>
      <form>
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-4">
            <InputField
              label="Registrační číslo"
              type="number"
              name="registrationNumber"
              register={register}
              defaultValue={customerData.registrationNumber}
            />
            <InputField
              label="IČO"
              type="text"
              name="ico"
              register={register}
              defaultValue={customerData.ico}
            />
            <InputDateFiled
              label="Registrace od"
              type="date"
              name="registratedSinceD"
              register={register}
              defaultValue={customerData.registratedSinceD}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Jméno a příjmení"
              type="text"
              name="fullName"
              register={register}
              defaultValue={customerData.fullName}
            />
            <InputDateFiled
              label="Datum narození"
              type="date"
              name="birthDateD"
              register={register}
              defaultValue={customerData.birthDateD}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Email"
              type="email"
              name="email"
              register={register}
              defaultValue={customerData.email} />
            <InputField
              label="Telefon"
              type="text"
              name="phone"
              register={register}
              defaultValue={customerData.phone}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Salón"
              type="text"
              name="salonName"
              register={register}
              defaultValue={customerData.salonName}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Adresa"
              type="text"
              name="address"
              register={register}
              defaultValue={customerData.address}
            />
            <InputField
              label="Město"
              type="text"
              name="town"
              register={register}
              defaultValue={customerData.town}
            />
            <InputField
              label="PSČ"
              type="text"
              name="psc"
              register={register}
              defaultValue={customerData.psc}
            />
          </div>
          <div className="flex gap-4">
            <TextAreaField
              label="Poznámka"
              name="note"
              register={register}
              defaultValue={customerData.note}
            />
          </div>x
          <hr />
          <div className="flex gap-4">
            <SelectField
              label="Prodejce"
              options={dials.dealers}
              name="dealerId"
              register={register}
              defaultValue={customerData.dealerId}
            />
          </div>
          <hr />
          <div className="flex gap-4">
            <SelectField
              label="Obchodní zástupce"
              options={dials.salesManagers}
              name="salesManagerId"
              register={register}
              defaultValue={customerData.salesManagerId}
            />
            <InputField
              label="Kvartál"
              type="number"
              name="salesManagerSinceQ"
              register={register}
              defaultValue={customerData.salesManagerSinceQ}
            />
            <InputField
              label="Rok"
              type="number"
              name="salesManagerSinceYear"
              register={register}
              defaultValue={customerData.salesManagerSinceYear}
            />
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>Uložit</Button>
      </form>
    </div>
  );
}
