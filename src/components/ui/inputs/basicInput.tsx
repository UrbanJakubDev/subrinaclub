"use client"
import { Input, Typography } from "@material-tailwind/react";
import { useFormContext } from 'react-hook-form';

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null | undefined;
  disabled?: boolean;
  customClass?: string;
  helperText?: string;
};

const InputField = ({ label, name, type = "text", defaultValue, disabled, customClass, helperText }: InputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={customClass}>
      <Input
        crossOrigin={undefined} size="md"
        error={!!errors[name]} // Check if there's an error for the field
        label={label}
        type={type}
        defaultValue={defaultValue} // Set default value
        {...register(name)} // Use register from useFormContext
        readOnly={disabled} />
      {helperText && (
        <span className="mt-2 flex items-center gap-1 font-normal">{helperText}</span>
      )}
      {errors[name] && <span className="text-red-500">{errors[name]?.message}</span>}
    </div>
  );
};

export default InputField;
