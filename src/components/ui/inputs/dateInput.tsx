'use client'
import React from "react";
import { useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Typography } from "@material-tailwind/react";
import { format, parseISO, isValid, isDate } from "date-fns";

type InputDateFieldProps = {
   label: string;
   name: string;
   defaultValue?: string | null | undefined | Date;
   helperText?: string;
   errors?: any;
};

const InputDateField = ({ label, name, defaultValue, helperText, errors }: InputDateFieldProps) => {
   const { register, setValue, getValues } = useFormContext();

   // Ensure that defaultValue is a valid string before parsing
   const initialDate = defaultValue && typeof defaultValue === 'string' && isValid(parseISO(defaultValue)) 
      ? parseISO(defaultValue) 
      : null;

   const handleDateChange = (date: Date | null) => {
      setValue(name, date ? format(date, "yyyy-MM-dd") : "");  // Format the date or set it to an empty string if null
   };

   const currentValue = getValues(name);

   // Ensure that the value returned by getValues is a valid string before parsing
   const parsedDate = currentValue && typeof currentValue === 'string' && isValid(parseISO(currentValue))
      ? parseISO(currentValue)
      : (isDate(currentValue) ? currentValue : null);

   return (
      <div>
         <DatePicker
            selected={parsedDate || initialDate}
            onChange={(date) => handleDateChange(date)}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            placeholderText="YYYY-MM-DD"
            customInput={
               <Input
                  crossOrigin={undefined} size="md"
                  label={label}
                  error={errors?.[name]}
                  {...register(name)} />
            }
         />
         {helperText && <Typography variant="small">{helperText}</Typography>}
         {errors?.[name] && <Typography color="red">{errors[name]?.message}</Typography>}
      </div>
   );
};

export default InputDateField;
