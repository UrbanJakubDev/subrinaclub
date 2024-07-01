import { Textarea } from "@material-tailwind/react";

type TextAreaFieldProps = {
  label: string;
  name: string;
  register?: any;
  defaultValue?: string;
};

const TextAreaField = ({ label, name, register, defaultValue }: any) => {

  if (!register) {
    return (
      <div className="flex flex-col">
        <Textarea
          label={label}
          rows={2}
          cols={99}
          defaultValue={defaultValue}
          className="w-full"
        />
      </div>
    );
  }


  return (
    <div className="flex flex-col">
      <Textarea
        label={label}
        rows={2}
        cols={99}
        defaultValue={defaultValue}
        className="w-full"
        {...register(name)}
      />
    </div>
  );
};

export default TextAreaField;