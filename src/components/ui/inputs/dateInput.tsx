import { dbDateToInputDate } from "@/utils/dateFnc";
import { Input } from "@material-tailwind/react";

const InputDateFiled = ({ label, name, type, defaultValue, register, errors, onChange }: any) => {


   let inputVal = dbDateToInputDate(defaultValue);

   if (!register) return (
      <div className="flex flex-col">
         <label className="text-sm font-semibold text-gray-600">{label}</label>
         <input
            type="date"
            defaultValue={inputVal} // Set default value
            onChange={(e) => { onChange(e.target.value) }}
         />
      </div>
   );


   return (
      <div className="flex flex-col">
         <Input
            label={label}
            type="text"
            defaultValue={inputVal} // Set default value
            {...register(name)} // Pass the register function
         />
      </div>
   );
};



export default InputDateFiled;