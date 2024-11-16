import * as yup from 'yup';

export const transactionValidationSchema = yup.object().shape({
    year: yup.number().required(),
    quarter: yup.number().required(),
    quarterDateTime: yup.date().nullable(),
    points: yup.number().required(),
    description: yup.string().nullable(),
    acceptedBonusOrder: yup.date().nullable(),
    sentBonusOrder: yup.date().nullable(),
    bonusPrice: yup.number().nullable(),
    bonusId: yup.number().nullable(),
    accountId: yup.number().nullable(),
});


export type CreateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;
export type UpdateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;