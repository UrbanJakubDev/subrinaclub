import { Account } from "./types"

export interface Transaction {
   id: number
   active: boolean
   createdAt: Date
   updatedAt: Date

   points: number
   description: string

   accountId: number
   account: Account
}
