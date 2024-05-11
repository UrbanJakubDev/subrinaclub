import React from 'react';

type SwitchFieldProps = {
  label: string;
  name: string;
  defaultValue?: boolean;
  register: any;
  disabled?: boolean;
  errors?: any;
};

const SwitchField = ({ label, name, defaultValue, register, disabled, errors }: SwitchFieldProps) => {
  const switchClass = "form-checkbox h-6 w-6 text-indigo-600 transition duration-150 ease-in-out";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        type="checkbox"
        className={switchClass}
        defaultChecked={defaultValue} // Set default value
        {...register(name)} // Pass the register function
        disabled={disabled}
      />
      {errors && errors[name] && <span className="text-red-500">{errors[name].message}</span>}
    </div>
  );
};

export default SwitchField;
