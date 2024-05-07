const InputField = ({ label, name, type, defaultValue, register, disabled }: any) => {
  const inputClass = "max-w-sm border border-gray-300 rounded-md p-2 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        className={inputClass}
        type={type}
        defaultValue={defaultValue} // Set default value
        {...register(name)} // Pass the register function
        disabled={disabled} // Disable the input field
      />
    </div>
  );
};



export default InputField;