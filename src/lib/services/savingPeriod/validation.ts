import * as yup from 'yup';


export const savingPeriodValidationSchema = yup.object().shape({
   savingStartDate: yup.string().required(),
   savingEndDate: yup.string().required(),
});
