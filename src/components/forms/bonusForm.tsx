"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "@/components/ui/inputs/basicInput";
import { Button } from "@material-tailwind/react";

type BonusData = {
  id?: number;
  active?: boolean;
  name: string;
  description?: string;
  points?: number;
  price?: number;
};

type Props = {
  bonusData?: BonusData;
  onSubmit: SubmitHandler<BonusData>;
};

const schema = yup.object().shape({
  name: yup.string().required("Název je povinný"),
  points: yup.number().nullable(),
  price: yup.number().nullable(),
});

export default function BonusForm({ bonusData, onSubmit }: Props) {


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BonusData>({
    resolver: yupResolver(schema),
    defaultValues: bonusData,
  });

  // Reset form whenever bonusData changes
  useEffect(() => {
    reset(bonusData);
  }, [bonusData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        <InputField
          label="Jméno bonusu"
          type="text"
          name="name"
          register={register}
          errors={errors}
        />
        <InputField
          label="Body"
          type="number"
          name="points"
          register={register}
          errors={errors}
        />
        <InputField
          label="Hodnota"
          type="number"
          name="price"
          register={register}
          errors={errors}
        />
        <InputField
          label="Popis"
          type="text"
          name="description"
          register={register}
          errors={errors}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Uložit</Button>
      </div>
    </form>
  );
}
