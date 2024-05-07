const TextAreaField = ({ label,  value }: any) => {
   const inputClass = "border border-gray-300 rounded-md p-2 w-full"; // Add w-full class here

   return (
     <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-600">{label}</label>
       <textarea
         className={inputClass}
         rows={8}
         cols={80}
         defaultValue={value}
       />
     </div>
   );
 };

 export default TextAreaField;