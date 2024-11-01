
import * as yup from "yup";

export const bonusValidationSchema = yup.object().shape({
  name: yup.string().required(),
  points: yup.number().nullable(),
  price: yup.number().nullable(),
});

export type CreateBonusDTO = yup.InferType<typeof bonusValidationSchema>;
export type UpdateBonusDTO = yup.InferType<typeof bonusValidationSchema>;