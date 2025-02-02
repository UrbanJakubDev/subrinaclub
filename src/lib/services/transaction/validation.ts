import * as yup from 'yup';

export const transactionValidationSchema = yup.object().shape({
    year: yup.number().required(),
    quarter: yup.number().required(),
    quarterDateTime: yup.date().nullable(),
    points: yup.number().required()
        .test('points-validation', 'Points must be negative when a bonus is selected', function(value) {
            const { bonusId } = this.parent;
            if (bonusId && bonusId > 0) {
                return value < 0;
            }
            return true;
        }),
    description: yup.string().nullable(),
    acceptedBonusOrder: yup.date().nullable(),
    sentBonusOrder: yup.date().nullable(),
    bonusPrice: yup.number().nullable(),
    bonusId: yup.number().nullable(),
    accountId: yup.number().nullable(),
    directSale: yup.boolean().default(false),
});


export type CreateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;
export type UpdateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;