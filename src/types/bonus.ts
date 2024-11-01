

export type Bonus = {
   id : number
   active : boolean
   createdAt : Date
   updatedAt : Date
   name : string
   description : string | null
   points : number
   price : number
   // TODO: Define transactions type
   transactions : any[]
   }