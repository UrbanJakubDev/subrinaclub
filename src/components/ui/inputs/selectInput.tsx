const SelectField = ({ label, name, options, defaultValue, register }: any) => {
  const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <select
        className={inputClass}
        defaultValue={defaultValue}
        {...register(name)} // Register the select field with React Hook Form
      >
        <option value="">Vyberte...</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.fullName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;