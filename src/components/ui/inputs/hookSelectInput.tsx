"use client";
import React from "react";
import { Select, Option } from "@material-tailwind/react";

type HookSelectInputProps = {
  label: string;
  name: string;
  options: { id: string | number; name: string }[];
  defaultValue: string | number | undefined;
  value: string | number | undefined;
  errors?: any;
  onChange: (value: string) => void;
};

const HookSelectInput = ({
  label,
  name,
  options,
  defaultValue,
  value,
  errors,
  onChange,
}: HookSelectInputProps) => {
  const handleChange = (val: any) => {
    // Call the onChange function provided by the Controller
    onChange(val);
  };

  return (
    <div className="flex flex-col">
      <Select
        label={label}
        value={String(value ?? defaultValue)}
        onChange={handleChange} // Use our custom handleChange
      >
        <Option value="0">Vyberte...</Option>
        {options.map((option) => (
          <Option key={option.id} value={String(option.id)}>
            {option.name}
          </Option>
        ))}
      </Select>
      {errors && <span className="text-red-500 text-xs">{errors[name]?.message}</span>}
    </div>
  );
};

export default HookSelectInput;
