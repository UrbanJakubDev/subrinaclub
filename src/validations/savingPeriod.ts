import * as yup from 'yup';

// Full schema for saving periods
export const savingPeriodValidationSchema = yup.object().shape({
   status: yup.string().oneOf(['ACTIVE', 'INACTIVE', 'CLOSED']).default('ACTIVE'),
   startYear: yup.number().required('Počáteční rok je povinný'),
   startQuarter: yup.number().min(1).max(4).required('Počáteční čtvrtletí je povinné'),
   endYear: yup.number().required('Koncový rok je povinný'),
   endQuarter: yup.number().min(1).max(4).required('Koncové čtvrtletí je povinné'),
   
   // Tyto pole jsou počítána systémem
   availablePoints: yup.number().default(0),
   totalDepositedPoints: yup.number().default(0),
   totalWithdrawnPoints: yup.number().default(0),
   
   closeReason: yup.string().nullable().when('status', {
      is: 'CLOSED',
      then: (schema) => schema.required('Důvod uzavření je povinný při uzavřeném statusu'),
      otherwise: (schema) => schema.nullable()
   }),
   accountId: yup.number().required(),
});

// Partial schema for updating only specific fields
export const savingPeriodUpdateValidationSchema = yup.object().shape({
   status: yup.string().oneOf(['ACTIVE', 'INACTIVE', 'CLOSED']).required(),
   startYear: yup.number().required('Počáteční rok je povinný'),
   startQuarter: yup.number().min(1).max(4).required('Počáteční čtvrtletí je povinné'),
   endYear: yup.number().required('Koncový rok je povinný'),
   endQuarter: yup.number().min(1).max(4).required('Koncové čtvrtletí je povinné'),
   closeReason: yup.string().nullable().when('status', {
      is: 'CLOSED',
      then: (schema) => schema.required('Důvod uzavření je povinný při uzavřeném statusu'),
      otherwise: (schema) => schema.nullable()
   }),
});

export type CreateSavingPeriodDTO = yup.InferType<typeof savingPeriodValidationSchema>;
export type UpdateSavingPeriodDTO = yup.InferType<typeof savingPeriodUpdateValidationSchema>; 