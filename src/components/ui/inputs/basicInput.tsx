"use client"
import { Input } from "@material-tailwind/react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  register: any;
  disabled?: boolean;
  errors?: any;
  customClass?: string;
};

const InputField = ({ label, name, type, defaultValue, register, disabled, errors, customClass }: InputFieldProps) => {
  // const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";
  // const readOnlyClass = "bg-gray-100 cursor-not-allowed";

  return (
    <div className={customClass}>
      {/* <label className="text-sm font-semibold text-gray-600">{label}</label> */}
      <Input
        size="md"
        error={errors[name] ? true : false}
        label={label}
        // className={inputClass + (disabled ? " " + readOnlyClass : "")}
        type={type ? type : "text"}
        defaultValue={defaultValue} // Set default value
        {...register(name)} // Pass the register function
        readOnly={disabled}
      />
      {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
    </div>
  );
};





export default InputField;