"use client";
import { Select, Option } from "@material-tailwind/react";


type SelectFieldProps = {
  label: string;
  name: string;
  options: any[];
  defaultValue: string | number | undefined;
  register?: any;
  onChange?: any;
  errors?: any;
};

const SelectField = ({ label, name, options, defaultValue, register = null, onChange, errors }: SelectFieldProps) => {
  const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";

  if (!register) {
    return (
      <div className="flex flex-col">
        <Select
          label={label}
          className={inputClass}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          <Option value="0">Vyberte...</Option>
          {options.map((option: any) => (
            <Option key={option.id} value={option.id}>
              {option.name || option.fullName || option.title || option}
            </Option>
          ))}
        </Select>
        {errors && <span className="text-red-500 text-xs">{errors[name]?.message}</span>}
      </div>
    );
  }

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