"use client"
import React from 'react'
import { KpiCard } from '../ui/stats/KpiCard';
import InputField from '../ui/inputs/basicInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountValidationSchema } from '@/schemas/customerSchema';
import { Button, Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';

type Props = {
  account: any;
  customer: any;
}

const AccountForm = ({ account, customer }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [accountData, setAccountData] = React.useState(account);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(accountValidationSchema),
  })

  // Get account by id
  const getAccountById = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/accounts?id=${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setAccountData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/accounts?id=${account.id}`, {
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

      setAccountData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }


  const onSubmit = async (data: any) => {
    handleUpdate(data);
    toast.success("Účet byl úspěšně upraven");

    await getAccountById(account.id);
  }


  if (loading || !account) {
    return <Loader />
  }


  return (
    <Card className="mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Účet pro zákzaníka - {customer.fullName}</h1>
      <form>
        <div className="flex flex-col gap-6 my-6">
          <InputField
            label="Balance"
            type='number'
            name='balance'
            register={register}
            errors={errors}
            defaultValue={accountData.balance}
          />
          <InputField
            label="Korekce bodů"
            type='number'
            name='balancePointsCorrection'
            register={register}
            errors={errors}
            defaultValue={accountData.balancePointsCorrection}
          />
        </div>
        <div className="w-full flex justify-end gap-3 mt-4">
          <Button onClick={handleSubmit(onSubmit)} >Uložit</Button>
        </div>
      </form>
    </Card>
  )
}

export default AccountForm