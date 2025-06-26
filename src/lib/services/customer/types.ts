import { SelectOption } from "@/types/types";
import { AccountResponseDTO } from "../account/types";


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

export interface CustomerSelectDTO extends SelectOption { }


export type CustomerFormProps = {
   initialCustomerData?: any
   dials?: any
   nextRegNumber?: any
}


export interface CustomerCardProps {
   customer: CustomerResponseDTO;
}



// TODO: Fix account attribute type
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