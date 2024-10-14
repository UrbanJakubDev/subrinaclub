import * as yup from "yup";

export const dealerValidationSchema = yup.object().shape({
  ico: yup.string().required(),
  registratedSinceD: yup.date().required(),
  fullName: yup.string().required(),
  birthDateD: yup.date(),
  email: yup.string().email(),
  phone: yup.string(),
  salonName: yup.string(),
  address: yup.string(),
  town: yup.string(),
  psc: yup.string(),
  note: yup.string()
});

export const salesManagerValidationSchema = yup.object().shape({
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