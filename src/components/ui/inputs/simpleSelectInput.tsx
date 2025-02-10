"use client";
import React from "react";
import { Select, Option } from "@material-tailwind/react";

type SimpleSelectInputProps = {
  label: string;
  options: { value: number | string; label: string }[];
  onChange: (value: number) => void;
  value: string | number;
};

const SimpleSelectInput = ({
  label,
  options,
  onChange,
  value
}: SimpleSelectInputProps) => {
  const handleChange = (val: string | undefined) => {
    if (val) {
      onChange(Number(val));
    }
  };

  return (
    <div className="flex flex-col">
      <Select
        label={label}
        value={String(value)}
        onChange={handleChange}
      >
        {options.map((option) => (
          <Option key={option.value} value={String(option.value)}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SimpleSelectInput;
