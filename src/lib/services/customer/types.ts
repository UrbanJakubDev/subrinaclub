import { SelectOption } from "@/types/types";
import { AccountResponseDTO } from "../account/types";

// =============================================================================
// CUSTOMER TYPES - VERZE 2
// =============================================================================

/**
 * Customer with relations type for V2 repository - List view
 * Verze 2: Specific type for customer listing with dealer, sales manager, account
 */
export type CustomerWithRelationsV2 = {
    id: number
    active: boolean
    createdAt: Date
    updatedAt: Date
    fullName: string
    birthDate: Date | null
    registrationNumber: number | null
    ico: string | null
    phone: string | null
    email: string | null
    registratedSince: Date | null
    salonName: string | null
    address: string | null
    town: string | null
    psc: string | null
    note: string | null
    dealerId: number | null
    salesManagerId: number | null
    gdpr: number | null
    dealer: {
        fullName: string
    } | null
    salesManager: {
        fullName: string
    } | null
    account: {
        id: number
        currentYearPoints: number
        lifetimePoints: number
        lifetimePointsCorrection: number | null
        averagePointsBeforeSalesManager: number | null
        savingPeriods: Array<{
            availablePoints: number | null
            status: string
        }>
    } | null
}

/**
 * Customer with account and saving period - Detail view
 * Verze 2: Specific type for customer detail page with full account data
 */
export type CustomerWithAccountAndSavingPeriodV2 = {
    id: number
    active: boolean
    createdAt: Date
    updatedAt: Date
    fullName: string
    birthDate: Date | null
    registrationNumber: number | null
    ico: string | null
    phone: string | null
    email: string | null
    registratedSince: Date | null
    salonName: string | null
    address: string | null
    town: string | null
    psc: string | null
    note: string | null
    dealerId: number | null
    salesManagerId: number | null
    gdpr: number | null
    account: {
        id: number
        customerId: number
        active: boolean
        createdAt: Date
        updatedAt: Date
        lifetimePoints: number
        currentYearPoints: number
        totalDepositedPoints: number
        totalWithdrawnPonits: number
        averagePointsBeforeSalesManager: number | null
        lifetimePointsCorrection: number | null
        savingPeriods: Array<{
            id: number
            createdAt: Date
            updatedAt: Date
            totalDepositedPoints: number | null
            status: string
            accountId: number
            startYear: number | null
            startQuarter: number | null
            endYear: number | null
            endQuarter: number | null
            availablePoints: number | null
            startDateTime: Date | null
            endDateTime: Date | null
            totalWithdrawnPoints: number | null
            closeReason: string | null
            closedAt: Date | null
        }>
    } | null
    salesManager: {
        id: number
        fullName: string
    } | null
    dealer: {
        id: number
        fullName: string
    } | null
}

/**
 * Customer basic info - For simple operations
 * Verze 2: Basic customer info for status updates
 */
export type CustomerBasicV2 = {
    id: number
    fullName: string
    active: boolean
    updatedAt: Date
}

/**
 * Customer list response type for V2 service
 * Verze 2: Clean response type for customer listing in components
 */
export type CustomerListResponseV2 = {
    id: number
    active: boolean
    registrationNumber: number | null
    fullName: string
    salonName: string | null
    address?: string | null
    town?: string | null
    psc?: string | null
    phone?: string | null
    ico?: string | null
    salesManager?: {
        fullName: string
    } | null
    dealer?: {
        fullName: string
    } | null
    account?: {
        currentYearPoints: number
        lifetimePoints: number
        lifetimePointsCorrection: number
        lifetimePointsCorrected: number
        savingPeriodAvailablePoints: number
        averagePointsBeforeSalesManager?: number
    } | null
}

// =============================================================================
// LEGACY TYPES - VERZE 1 (For backward compatibility)
// =============================================================================

/**
 * @deprecated Use CustomerWithRelationsV2 instead
 */
export interface CustomerResponseDTO {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   fullName: string;
   birthDate: Date | null;
   registrationNumber: number | null;
   ico: string | null;
   phone: string | null;
   email: string | null;
   registratedSince: Date | null;
   salonName: string | null;
   address: string | null;
   town: string | null;
   psc: string | null;
   note: string | null;
   dealerId: number | null;
   salesManagerId: number | null;
   account: AccountResponseDTO;
}

/**
 * @deprecated Use CustomerWithAccountAndSavingPeriodV2 instead
 */
export interface CustomerWithAccountDataAndActiveSavingPeriodDTO {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   fullName: string;
   birthDate: Date | null;
   registrationNumber: number | null;
   ico: string | null;
   phone: string | null;
   email: string | null;
   registratedSince: Date | null;
   address: string | null;
   salonName: string | null
   town: string | null;
   psc: string | null;
   note: string | null;
   dealerId: number | null;
   salesManagerId: number | null;
   gdpr: number | null;
   account: {
      id: number;
      customerId: number;
      accountNumber: string;
      balance: number;
      averagePointsBeforeSalesManager: number;
      lifetimePoints: number;
      lifetimePointsCorrection: number;
      lifetimePointsCorrected: number;
      savingPeriod: {
         id: number;
         accountNumber: string;
         customerId: number;
         amount: number;
         status: string;
         startDate: Date;
         endDate: Date;
      };
   };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface CustomerSelectDTO extends SelectOption { }

export type CustomerFormProps = {
   initialCustomerData?: any
   dials?: any
   nextRegNumber?: any
}

export interface CustomerCardProps {
   customer: CustomerResponseDTO;
}

export type SeznamObratuDTO = {
   registrationNumber: string;
   id: number;
   fullName: string;
   town: string | null;
   salonName: string | null;
   salesManager: string;
   clubScore: number;
   '2024': number;
   '2023': number;
   '2022': number;
   '2021': number;
   '2020': number;
   '2019': number;
   '2018': number;
   '2017': number;
   '2016': number;
   '2015': number;
   '2014': number;
   '2013': number;
   '2012': number;
   '2011': number;
   '2010': number;
}