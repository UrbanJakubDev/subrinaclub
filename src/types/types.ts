import { Customer } from "./customer";

export interface SelectOption {
   value: string | number;
   label: string;
}

export type Account = {
   id: number
   active: boolean
   createdAt: Date
   updatedAt: Date
   lifeTimePoints: number
   currentYearPoints: number
   totalDepositedPoints: number
   totalWithdrawnPoints: number

   customerId: number
   customer: Customer

   // TODO: Add transactions type
   transactions: any[]

   // TODO: Add savingPeriods type
   savingPeriods: any[]
}


export type SavingPeriod = {
   id: number
   active: boolean
   createdAt: Date
   updatedAt: Date

   startYear: number
   startQuarter: number
   endYear: number
   endQuarter: number

   availablePoints: number
   totalDepositedPoints: number
   totalWithdrawnPoints: number

   closedAt: Date | null
   closeReason: string | null

   account: Account
   accountId: number
   transactions: any[]
}