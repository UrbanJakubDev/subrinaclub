// Yup schema fro customer form

import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
    active: yup.boolean().default(true),
    registrationNumber: yup.number().default(0),
    ico: yup.string().max(40).required(),
    registratedSinceD: yup.date().required(),
    fullName: yup.string().max(255).required(),
    birthDateD: yup.date().nullable(),
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
});

export const transactionValidationSchema = yup.object().shape({
    year: yup.number().required(),
    quarter: yup.number().required(),
    amount: yup.number().required(),
    type: yup.string().required(),
    description: yup.string().nullable(),
    acceptedBonusOrder: yup.date().nullable(),
    sentBonusOrder: yup.date().nullable(),
    bonusName: yup.string().nullable(),
    bonusAmount: yup.number().nullable(),
    accountId: yup.number().nullable(),
});

export const accountValidationSchema = yup.object().shape({
    balance: yup.number(),
    balancePointsCorrection: yup.number(),
});

export const savingPeriodValidationSchema = yup.object().shape({
    savingStartDate: yup.string().required(),
    savingEndDate: yup.string().required(),
});
