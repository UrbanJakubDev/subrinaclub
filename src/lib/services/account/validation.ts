import * as yup from 'yup';



export const accountValidationSchema = yup.object().shape({
   active: yup.boolean().default(true),
   lifetimePoints: yup.number().default(0),
   currentYearPoints: yup.number().default(0),
   totalDepositedPoints: yup.number().default(0),
   totalWithdrawnPoints: yup.number().default(0),
   customerId: yup.number().required(),
});

export type CreateAccountDTO = yup.InferType<typeof accountValidationSchema>;
export type UpdateAccountDTO = yup.InferType<typeof accountValidationSchema>;