import { Transaction } from "@/types/transaction";
import { CustomerResponseDTO } from "../customer/types";
import { SavingPeriod, SelectOption } from "@/types/types";

export interface AccountResponseDTO {
   id: number;
   active: boolean;

   lifetimePoints: number;
   currentYearPoints: number;
   totalDepositedPoints: number;
   totalWithdrawnPoints: number;

   customerId: number;
   customer: CustomerResponseDTO;

   transactions: Transaction[];
   savingPeriods: SavingPeriod[];
}

export interface AccountSelectDTO extends SelectOption {}

export interface AccountInfoCardProps {
   // TODO: Define the type of the customer prop
   account: any;
   customer: any;
 }