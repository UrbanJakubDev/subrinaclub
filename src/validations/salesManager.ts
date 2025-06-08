
import { act } from "react-dom/test-utils";
import * as yup from "yup";

export const salesManagerValidationSchema = yup.object().shape({
   active: yup.boolean().required(),
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
   note: yup.string().nullable(),
   dealerId: yup.number().nullable()
   });

export type CreateSalesManagerDTO = yup.InferType<typeof salesManagerValidationSchema>;
export type UpdateSalesManagerDTO = yup.InferType<typeof salesManagerValidationSchema>;