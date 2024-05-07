const InputField = ({ label, name, type, defaultValue, register }: any) => {
   const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";
 
   return (
     <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-600">{label}</label>
       <input
         className={inputClass}
         type={type}
         defaultValue={defaultValue} // Set default value
         {...register(name)} // Pass the register function
       />
     </div>
   );
 };
 
 

export default InputField;