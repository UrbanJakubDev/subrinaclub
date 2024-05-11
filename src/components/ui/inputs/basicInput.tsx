type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  register: any;
  disabled?: boolean;
  errors?: any;
};

const InputField = ({ label, name, type, defaultValue, register, disabled, errors }: InputFieldProps) => {
  const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";
  const readOnlyClass = "bg-gray-100 cursor-not-allowed";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        className={inputClass + (disabled ? " " + readOnlyClass : "")}
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