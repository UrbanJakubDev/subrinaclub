import * as yup from 'yup';

// Full schema for creating accounts
export const accountValidationSchema = yup.object().shape({
   active: yup.boolean().default(true),
   lifetimePoints: yup.number().default(0),
   currentYearPoints: yup.number().default(0),
   totalDepositedPoints: yup.number().default(0),
   totalWithdrawnPonits: yup.number().default(0),
   averagePointsBeforeSalesManager: yup.number().default(0),
   lifetimePointsCorrection: yup.number().default(0),
   customerId: yup.number().required(),
});

// Partial schema for updating only specific fields
export const accountUpdateValidationSchema = yup.object().shape({
   active: yup.boolean().optional(),
   lifetimePoints: yup.number().optional(),
   currentYearPoints: yup.number().optional(),
   totalDepositedPoints: yup.number().optional(),
   totalWithdrawnPonits: yup.number().optional(),
   averagePointsBeforeSalesManager: yup.number().required(),
   lifetimePointsCorrection: yup.number().required(),
   customerId: yup.number().required(),
});

export type CreateAccountDTO = yup.InferType<typeof accountValidationSchema>;
export type UpdateAccountDTO = yup.InferType<typeof accountUpdateValidationSchema>;