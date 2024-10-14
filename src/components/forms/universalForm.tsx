"use client"

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, UseFormReturn, FieldValues, DefaultValues, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';
import { Button, Card } from '@material-tailwind/react';

interface UniversalFormProps<T extends FieldValues> {
   initialData: T;
   validationSchema: any;
   onSubmit: (data: T) => Promise<T>;
   children: (methods: UseFormReturn<T>) => React.ReactNode;
   successMessage: string;
}

export default function UniversalForm<T extends FieldValues>({
   initialData,
   validationSchema,
   onSubmit,
   children,
   successMessage,
}: UniversalFormProps<T>) {
   const [formData, setFormData] = React.useState<T>(initialData);

   const methods = useForm<T>({
      resolver: yupResolver(validationSchema),
      defaultValues: initialData
   });

   const { handleSubmit, reset, formState: { isSubmitting } } = methods;

   // Sync the form with updated initialData
   useEffect(() => {
      if (initialData) {
         setFormData(initialData);  // Update local state
         reset(initialData);  // Sync react-hook-form with new initialData
      }
   }, [initialData, reset]);

   const processForm: SubmitHandler<T> = async (data) => {

      try {
         const result = await onSubmit(data);
         setFormData(result);
         reset(result);
         toast.success(successMessage);
      } catch (error) {
         toast.error('An error occurred while submitting the form.' + error);
      }
   };

   // Prevent form from rendering until formData is ready
   if (!formData) {
      return <Loader />;  // Optionally add a loading spinner
   }

   return (
      <Card className="mx-auto p-4 w-fit">
         <FormProvider {...methods}>
            <form onSubmit={handleSubmit(processForm)}>
               {children(methods)}
               {/* Submit and Cancel buttons */}
               <div className="w-full flex justify-end gap-3 mt-4">
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? 'Ukládání...' : 'Uložit'}
                  </Button>
                  <Button color="red" type="button" onClick={() => reset(formData)}>
                     Zrušit
                  </Button>
               </div>
            </form>
         </FormProvider>
      </Card>
   );
}