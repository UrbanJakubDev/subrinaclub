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
  const { register, formState: { errors } } = useFormContext();
  const switchClass = "form-checkbox h-6 w-6 text-indigo-600 transition duration-150 ease-in-out";

  return (
    <div className="flex flex-col w-[200px]">
      <Checkbox
        crossOrigin={undefined} label={label}
        className={switchClass}
        defaultChecked={defaultValue} // Set default value
        {...register(name)} // Use register from useFormContext
        disabled={disabled}      />
      {errors && errors[name] && <span className="text-red-500">{errors[name]?.message}</span>}
    </div>
  );
};

export default SwitchField;
