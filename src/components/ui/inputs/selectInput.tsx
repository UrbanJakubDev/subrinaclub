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
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <select
        className={inputClass}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        <option value="0">Vyberte...</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.name || option.fullName || option.title || option}
          </option>
        ))}
      </select>
      {errors && <span className="text-red-500 text-xs">{errors[name]?.message}</span>}
    </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <select
        className={inputClass}
        defaultValue={defaultValue}
        {...register(name) } // Register the select field with React Hook Form
      >
        <option value="0">Vyberte...</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.name || option.fullName || option.title || option}
          </option>
        ))}
      </select>
      {errors && <span className="text-red-500 text-xs">{errors[name]?.message}</span>}
    </div>
  );
};

export default SelectField;