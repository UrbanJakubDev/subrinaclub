"use client"
import { dbDateToInputDate } from "@/utils/dateFnc";
import { Input, Typography } from "@material-tailwind/react";

const InputDateFiled = ({ label, name, type, defaultValue, register, errors, onChange, helperText }: any) => {


   let inputVal = dbDateToInputDate(defaultValue);

   // If not default value, set it to Postrges null date
   (!defaultValue) && (inputVal = "0000-00-00");
  

   if (!register) return (
      <div className="flex flex-col">
         <Input
            label={label}
            type="text"
            defaultValue={inputVal} // Set default value
            onChange={(e) => { onChange(e.target.value) }}
         />
         <Typography
            variant="small"
            color="gray"
            className="mt-2 flex justify-end gap-1 font-normal text-[0.7rem]"
         >
            {helperText}
         </Typography>
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
         <Typography
            variant="small"
            color="gray"
            className="mt-2 flex justify-end gap-1 font-normal text-[0.7rem]"
         >
            {helperText}
         </Typography>
      </div>
   );
};



export default InputDateFiled;