// Yup schema fro customer form

import * as yup from "yup";

export const customerValidationSchema = yup.object().shape({
  registrationNumber: yup.number(),
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
  note: yup.string(),
  dealerId: yup.number(),
  salesManagerId: yup.number(),
  salesManagerSinceQ: yup.number(),
  salesManagerSinceYear: yup.number(),
});

export const transactionValidationSchema = yup.object().shape({
  year: yup.number().required(),
  quarter: yup.number().required(),
  amount: yup.number().required(),
  type: yup.string().required(),
  description: yup.string(),
  acceptedBonusOrder: yup.date(),
  sentBonusOrder: yup.date(),
  bonusName: yup.string(),
  bonusAmount: yup.number(),
  accountId: yup.number(),
});
