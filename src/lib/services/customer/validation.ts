import * as yup from "yup";

export const customerValidationSchema = yup.object().shape({
   active: yup.boolean().default(true),
   registrationNumber: yup.number().default(0),
   ico: yup.string().max(40).nullable(),
   registratedSince: yup.date().required(),
   fullName: yup.string().max(255).required(),
   birthDate: yup.date().nullable(),
   email: yup.string().email().max(100).nullable(),
   phone: yup.string().max(50).nullable(),
   salonName: yup.string().max(255).nullable(),
   address: yup.string().max(255).nullable(),
   town: yup.string().max(255).nullable(),
   psc: yup.string().max(255).nullable(),
   note: yup.string().nullable(),
   dealerId: yup.number().nullable(),
   salesManagerId: yup.number().nullable(),
   salesManagerSinceQ: yup.number().default(0).nullable(),
   salesManagerSinceYear: yup.number().default(0).nullable(),
   gdpr: yup.number().default(0).nullable(),
});

export type CreateCustomerDTO = yup.InferType<typeof customerValidationSchema>;
export type UpdateCustomerDTO = yup.InferType<typeof customerValidationSchema>;