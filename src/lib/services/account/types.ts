import { Transaction } from "@/types/transaction";
import { CustomerResponseDTO } from "../customer/types";
import { SavingPeriod, SelectOption } from "@/types/types";
import { Account, Customer } from "@prisma/client";

export interface AccountResponseDTO extends Account {
   customer: Customer;
   savingPeriods: SavingPeriod[];
}

export interface AccountSelectDTO extends SelectOption {}

export interface AccountInfoCardProps {
   account: AccountResponseDTO | null;
   savingPeriod: SavingPeriod | null;
   isLoading?: boolean;
}