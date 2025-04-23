import { Customer } from "./customer";
import { Transaction } from "./transaction";

export interface SelectOption {
   value: string | number;
   label: string;
}

export type Account = {
   id: number
   active: boolean
   createdAt: Date
   updatedAt: Date
   lifetimePoints: number
   lifetimePointsCorrection: number
   currentYearPoints: number
   totalDepositedPoints: number
   totalWithdrawnPoints: number

   averagePointsBeforeSalesManager: number | null

   customerId: number
   customer: Customer

   // TODO: Add transactions type
   transactions: Transaction[]

   // TODO: Add savingPeriods type
   savingPeriods: SavingPeriod[]
}


export type SavingPeriod = {
   id: number
   status: 'ACTIVE' | 'INACTIVE' | 'CLOSED'
   createdAt: Date
   updatedAt: Date

   startYear: number
   startQuarter: number
   endYear: number
   endQuarter: number

   startDateTime: Date
   endDateTime: Date

   availablePoints: number
   totalDepositedPoints: number
   totalWithdrawnPoints: number

   closedAt: Date | null
   closeReason: string | null

   account: Account
   accountId: number
   transactions: any[]
}

// NEW

export type ApiResponse<T> = {
   data: T;
   metadata: {
      loadedAt: string;
      timezone: string;
   }
}