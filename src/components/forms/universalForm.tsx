"use client"

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, UseFormReturn, FieldValues, DefaultValues, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Loader from '../ui/loader';
import { Button, Card } from '@material-tailwind/react';
import Skeleton from '../ui/skeleton';

interface UniversalFormProps<T extends FieldValues> {
   initialData: T;
   validationSchema: any;
   onSubmit: (data: T) => Promise<T>;
   children: (methods: UseFormReturn<T>) => React.ReactNode;
   successMessage?: string;
   customError?: string | null;
}

export default function UniversalForm<T extends FieldValues>({
   initialData,
   validationSchema,
   onSubmit,
   children,
   successMessage,
   customError,
}: UniversalFormProps<T>) {
   const [formData, setFormData] = React.useState<T>(initialData);

   const methods = useForm<T>({
      resolver: yupResolver(validationSchema),
      defaultValues: initialData
   });

   const { handleSubmit, reset, formState: { isSubmitting, errors } } = methods;

   // Sync the form with updated initialData
   useEffect(() => {
      if (initialData) {
         setFormData(initialData);  // Update local state
         reset(initialData);  // Sync react-hook-form with new initialData
      }
   }, [initialData, reset]);

   const processForm: SubmitHandler<T> = async (data) => {
      // Don't submit if there's a custom error
      if (customError) {
         toast.error("Nelze uložit: " + customError);
         return;
      }

      try {
         const result = await onSubmit(data);
         setFormData(result);
         reset(result);
         if (successMessage) {
            toast.success(successMessage);
         }
      } catch (error) {
         toast.error('An error occurred while submitting the form.' + error);
      }
   };

   // Prevent form from rendering until formData is ready
   if (!formData) {
      return <Skeleton />;  // Optionally add a loading spinner
   }

   // Determine if the submit button should be disabled
   const isSubmitDisabled = isSubmitting || !!customError;

   return (
      <div className="mx-auto p-4 w-fit">
         <FormProvider {...methods}>

            {Object.keys(errors).length > 0 && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Chyba!</strong>
                  <span className="block sm:inline"> {Object.values(errors).map((error: any) => error.message).join(', ')}</span>
               </div>
            )}
            
            {customError && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Chyba validace:</strong>
                  <span className="block sm:inline"> {customError}</span>
               </div>
            )}

            <form onSubmit={handleSubmit(processForm)} >
               {children(methods)}
               {/* Submit and Cancel buttons */}
               <div className="w-full flex justify-end gap-3 mt-4">
                  <Button 
                     type="submit" 
                     disabled={isSubmitDisabled}
                     className={isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                     {isSubmitting ? 'Ukládání...' : 'Uložit'}
                  </Button>
                  <Button color="red" type="button" onClick={() => reset(formData)}>
                     Zrušit
                  </Button>
               </div>
            </form>
         </FormProvider>
      </div>
   );
}