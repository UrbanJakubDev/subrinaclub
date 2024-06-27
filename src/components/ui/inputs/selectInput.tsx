"use client";
import { Select, Option } from "@material-tailwind/react";
import { ChangeEvent } from "react";


type SelectFieldProps = {
  label: string;
  name?: string;
  options: any[];
  defaultValue: string | number | undefined;
  register?: any;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  errors?: any;
  value?: any;
};

const SelectField = ({ label, name, options, defaultValue, register, onChange, errors, value }: SelectFieldProps) => {
  return (
    <div className="flex flex-col">
      <Select
        label={label}
        value={defaultValue}
        {...register(name)} // Register the select field with React Hook Form
      >
        {options.map((option: any) => (
          <Option key={option.id} value={option.id}>
            {option.name || option.fullName || option.title || option}
          </Option>
        ))}
      </Select>
      {errors && <span className="text-red-500 text-xs">{errors[name]?.message}</span>}
    </div>
  );
};

export default SelectField;