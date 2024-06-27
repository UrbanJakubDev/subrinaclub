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