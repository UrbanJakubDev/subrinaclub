import { Textarea } from "@material-tailwind/react";

const TextAreaField = ({ label,  value }: any) => {
   return (
     <div className="flex flex-col">
       <Textarea 
        label={label}
        rows={2}
        cols={99}
        value={value}
        className="w-full"
        />
     </div>
   );
 };

 export default TextAreaField;