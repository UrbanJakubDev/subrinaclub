// Yup schema fro customer form

import * as yup from "yup";

export const customerValidationSchema = yup.object().shape({
    registrationNumber: yup.number().required(),
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