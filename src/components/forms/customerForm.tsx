"use client";

import { ICustomer } from "@/interfaces/interfaces";
import { useForm } from "react-hook-form";
import Button from "../ui/button";
import React from "react";
import Loader from "../ui/loader";
import InputField from "../ui/inputs/basicInput";
import TextAreaField from "../ui/inputs/textareaInput";
import SelectField from "../ui/inputs/selectInput";
import { yupResolver } from "@hookform/resolvers/yup"
import { customerValidationSchema } from "@/schemas/customerSchema";
import InputDateFiled from "../ui/inputs/dateInput";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { CustomerService } from "@/db/queries/customers";
import InputSwitcher from "../ui/inputs/inputSwitcher";


type Props = {
  customer: ICustomer;
  dials: any;
};

export default function CustomerForm({ customer, dials }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState<ICustomer>(customer);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(customerValidationSchema),
  })

  const getCustomerById = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers?id=${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCustomerData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }


  const handleUpdate = async (data: ICustomer) => {
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

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCustomerData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleCreate = async (data: ICustomer) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCustomerData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }


  const onSubmit = async (data: ICustomer) => {
    if (customer.id === 0) {
      handleCreate(data);
    } else {
      handleUpdate(data);
    }
    setLoading(false);
    toast.success("Zákazník byl uložen");

    await getCustomerById(customer.id);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto">
      <form>
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-4">
            <InputSwitcher
              label="Aktivní"
              name="active"
              register={register}
              defaultValue={customerData.active === 1 ? true : false}
              errors={errors}
              
            />

            <InputField
              label="Registrační číslo"
              type="number"
              name="registrationNumber"
              register={register}
              defaultValue={customerData.registrationNumber.toString()}
              errors={errors}
              disabled

            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="IČO"
              type="text"
              name="ico"
              register={register}
              defaultValue={customerData.ico}
              errors={errors}

            />
            <InputDateFiled
              label="Registrace od"
              type="date"
              name="registratedSinceD"
              register={register}
              defaultValue={customerData.registratedSinceD}

            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Jméno a příjmení"
              type="text"
              name="fullName"
              register={register}
              defaultValue={customerData.fullName}
              errors={errors}
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
              defaultValue={customerData.email}
              errors={errors}
            />

            <InputField
              label="Telefon"
              type="tel"
              name="phone"
              register={register}
              defaultValue={customerData.phone}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Salón"
              type="text"
              name="salonName"
              register={register}
              defaultValue={customerData.salonName}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <InputField
              label="Adresa"
              type="text"
              name="address"
              register={register}
              defaultValue={customerData.address}
              errors={errors}
            />
            <InputField
              label="Město"
              type="text"
              name="town"
              register={register}
              defaultValue={customerData.town}
              errors={errors}
            />
            <InputField
              label="PSČ"
              type="text"
              name="psc"
              register={register}
              defaultValue={customerData.psc}
              errors={errors}
            />
          </div>
          <div className="flex gap-4">
            <TextAreaField
              label="Poznámka"
              name="note"
              register={register}
              defaultValue={customerData.note}
            />
          </div>
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
              errors={errors}
            />
            <InputField
              label="Rok"
              type="number"
              name="salesManagerSinceYear"
              register={register}
              defaultValue={customerData.salesManagerSinceYear}
              errors={errors}
            />
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>Uložit</Button>
        <Button onClick={() => router.push("/users")}>Zrušit</Button>
      </form>
    </div>
  );
}
