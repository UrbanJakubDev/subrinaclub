import { SelectOption } from "@/types/types";


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
}

export interface CustomerSelectDTO extends SelectOption {}


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
   town: string | null;
   psc: string | null;
   note: string | null;
   dealerId: number | null;
   salesManagerId: number | null;
   account: {
      id: number;
      customerId: number;
      accountNumber: string;
      balance: number;
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