import * as yup from 'yup';



export const accountValidationSchema = yup.object().shape({
   balance: yup.number(),
   balancePointsCorrection: yup.number(),
});

