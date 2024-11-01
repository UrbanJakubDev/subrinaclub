export type Customer = {
   id: number
   publicId : string
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
   salesManagerSinceQ: number | null
   salesManagerSinceYear: number | null

   // TODO: Add account type
   account: any
 }