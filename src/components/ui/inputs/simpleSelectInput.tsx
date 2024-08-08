"use client";
import React, { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";

type SimpleSelectInputProps = {
  label: string;
  options: { id: number | string; name: string }[];
  onChange: (value: number) => void;
  value: string | number | undefined;
};

const SimpleSelectInput = ({
  label,
  options,
  onChange,
  value
}: SimpleSelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(String(value));
    }
  }, [value]);

  const handleChange = (val: string) => {
    setSelectedValue(val);
    onChange(parseInt(val));
  };

  return (
    <div className="flex flex-col">
      <Select
        label={label}
        value={selectedValue}
        onChange={(val) => handleChange(val)}
      >
        {options.map((option) => (
          <Option key={option.id} value={String(option.id)}>
            {option.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SimpleSelectInput;
