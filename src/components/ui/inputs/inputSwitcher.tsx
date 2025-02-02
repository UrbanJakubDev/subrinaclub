import React from 'react';
import { Checkbox } from "@material-tailwind/react";
import { useFormContext } from 'react-hook-form';

type SwitchFieldProps = {
  label: string;
  name: string;
  defaultValue?: boolean;
  disabled?: boolean;
};

const SwitchField = ({ label, name, defaultValue, disabled }: SwitchFieldProps) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const value = watch(name, defaultValue);
  const switchClass = "form-checkbox h-6 w-6 text-indigo-600 transition duration-150 ease-in-out";
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col w-[200px]">
      <Checkbox
        crossOrigin={undefined} 
        label={label}
        className={switchClass}
        checked={value}
        {...register(name)}
        disabled={disabled}
      />
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
    </div>
  );
};

export default SwitchField;
