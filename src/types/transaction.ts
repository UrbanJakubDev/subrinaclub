import { Bonus } from "./bonus"
import { Account, SavingPeriod } from "./types"

export interface Transaction {
   id: number
   active: boolean
   createdAt: Date
   updatedAt: Date

   year: number
   quarter: number
   quarterDateTime: Date
   points: number
   type: string
   description: string | null
   directSale: boolean

   acceptedBonusOrder: Date | null
   sentBonusOrder: Date | null
   bonusPrice: number | null

   account: Account
   accountId: number

   bonus: Bonus | null
   bonusId: number | null

   savingPeriod: SavingPeriod | null
   savingPeriodId: number | null
   
}
