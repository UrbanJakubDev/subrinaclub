"use client";

import { ICustomer } from "@/interfaces/interfaces";
import { useForm } from "react-hook-form";
import Button from "../ui/button";
import { updateCustomerById } from "@/db/queries/customers";
import React from "react";
import Loader from "../ui/loader";

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
  const { register, handleSubmit } = useForm<ICustomer>();

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
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type, ...rest }: any) => {
    const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";

    return (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <input
          className={inputClass}
          type={type}
          {...register(name)}
          defaultValue={customer[name]}
        />
      </div>
    );
  };

  const TextAreaField = ({ label, name }: any) => {
    const inputClass = "border border-gray-300 rounded-md p-2 w-full"; // Add w-full class here

    return (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <textarea
          className={inputClass}
          {...register(name)}
          defaultValue={customer[name]}
          rows={8}
          cols={80}
        />
      </div>
    );
  };

  const SelectField = ({ label, name, options, ...rest }: any) => {
    const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";

    return (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <select
          className={inputClass}
          {...register(name)}
          defaultValue={customer[name]}
        >
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.fullName}
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto">
      <form>
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-4">
            <InputField
              label="Reg. číslo"
              name="registrationNumber"
              type="text"
            />
            <InputField label="IČO" name="ico" type="text" />
            <InputField
              label="Registrace od"
              name="registratedSince"
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <InputField label="Jméno" name="fullName" type="text" />
            <InputField label="Datum narození" name="birthDate" type="text" />
          </div>
          <div className="flex gap-4">
            <InputField label="Email" name="email" type="email" />
            <InputField label="Telefon" name="phone" type="text" />
          </div>
          <div className="flex gap-4">
            <InputField label="Salón" name="salonName" type="text" />
          </div>
          <div className="flex gap-4">
            <InputField label="Adresa" name="address" type="text" />
            <InputField label="Město" name="town" type="text" />
            <InputField label="PSČ" name="psc" type="text" />
          </div>
          <div className="flex gap-4">
            <TextAreaField label="Poznámka" name="note" type="textarea" />
          </div>
          <hr />
          <div className="flex gap-4">
            <SelectField
              label="Prodejce"
              name="dealerId"
              options={dials.dealers}
            />
          </div>
          <hr />
          <div className="flex gap-4">
            <SelectField
              label="Obchodní zástupce"
              name="salesManagerId"
              options={dials.salesManagers}
            />
            <InputField label="Kvartál" name="salesManagerSinceQ" type="text" />
            <InputField label="Rok" name="salesManagerSinceYear" type="text" />
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>Uložit</Button>
      </form>
    </div>
  );
}
