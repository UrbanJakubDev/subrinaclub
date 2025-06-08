import * as yup from "yup";

export const dealerValidationSchema = yup.object().shape({
  fullName: yup.string().required(),
  birthDate: yup.date().nullable(),
  registrationMumber: yup.number().nullable(),
  ico: yup.string().nullable(),
  phone: yup.string().nullable(),
  email: yup.string().email().nullable(),
  registratedSince: yup.date().nullable(),
  address: yup.string().nullable(),
  town: yup.string().nullable(),
  psc: yup.string().nullable(),
  note: yup.string().nullable()
});

export type CreateDealerDTO = yup.InferType<typeof dealerValidationSchema>;
export type UpdateDealerDTO = yup.InferType<typeof dealerValidationSchema>;