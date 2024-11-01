"use client"
import { Textarea } from "@material-tailwind/react";
import { useFormContext } from 'react-hook-form';

type TextAreaFieldProps = {
  label: string;
  name: string;
  defaultValue?: string | null | undefined;
};

const TextAreaField = ({ label, name, defaultValue }: TextAreaFieldProps) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col">
      <Textarea
        label={label}
        rows={2}
        cols={99}
        defaultValue={defaultValue}
        className="w-full"
        {...register(name)}
      />
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  );
};

export default TextAreaField;

