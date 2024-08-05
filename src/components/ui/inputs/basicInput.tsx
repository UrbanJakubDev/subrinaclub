"use client"
import { Input, Typography } from "@material-tailwind/react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  register: any;
  disabled?: boolean;
  errors?: any;
  customClass?: string;
  helperText?: string;
};

const InputField = ({ label, name, type, defaultValue, register, disabled, errors, customClass, helperText }: InputFieldProps) => {

  return (
    <div className={customClass}>
      <Input
        size="md"
        error={errors[name] ? true : false}
        label={label}
        type={type ? type : "text"}
        defaultValue={defaultValue} // Set default value
        {...register(name)} // Pass the register function
        readOnly={disabled}
      />
      <span className="mt-2 flex items-center gap-1 font-normal" >{helperText}</span>
      {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
    </div>
  );
};





export default InputField;