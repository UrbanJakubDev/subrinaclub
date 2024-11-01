import { Dealer } from "./dealer";



// SalesManager type which is fully compatible with the Prisma model
export type SalesManager = {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   fullName: string;
   birthDate: Date | null;
   registrationNumber: number;
   ico: string;
   phone: string;
   email: string;
   registratedSince: Date | null;
   address: string;
   town: string;
   psc: string;
   note: string;

   // Add more fields here, maintaining your desired structure and styling
   customers: any[];

   dealer: Dealer;
   dealerId: number;
 }