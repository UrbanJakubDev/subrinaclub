import { dbDateToInputDate } from "@/utils/dateFnc";

const InputDateFiled = ({ label, name, type, defaultValue, register, errors }: any) => {
   const inputClass = "max-w-sm border border-gray-300 rounded-md p-2";

   let inputVal = dbDateToInputDate(defaultValue);

   return (
      <div className="flex flex-col">
         <label className="text-sm font-semibold text-gray-600">{label}</label>
         <input
            className={inputClass}
            type="date"
            // value={customer[name] ? new Date(customer[name]).toISOString().split('T')[0] : ''}
            defaultValue={inputVal} // Set default value
            {...register(name)} // Pass the register function
         />
         {/* {errors[name] && <span className="text-red-500">{errors[name].message}</span>} */}
      </div>
   );
};



export default InputDateFiled;