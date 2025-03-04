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
    // This field will be used to store validation context data
    _savingPeriodValidation: yup.object().nullable().default(null),
});


export type CreateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;
export type UpdateTransactionDTO = yup.InferType<typeof transactionValidationSchema>;

// Helper function to convert year and quarter to a Date object
export const yearQuarterToDate = (year: number, quarter: number): Date => {
    // Quarter starts from 0-based month: Q1=Jan, Q2=Apr, Q3=Jul, Q4=Oct
    const month = (quarter - 1) * 3;
    // Create date for the first day of the quarter
    return new Date(year, month, 1);
};

// Helper function to check if a date is within a range
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    // For comparison, we only care about year and month, not the specific day or time
    const normalizeDate = (d: Date): number => {
        return d.getFullYear() * 100 + d.getMonth();
    };
    
    const normalizedDate = normalizeDate(date);
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);
    
    return normalizedDate >= normalizedStartDate && normalizedDate <= normalizedEndDate;
};