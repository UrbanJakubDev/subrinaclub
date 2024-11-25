import { SalesManager } from '@/types/salesmanager';

export interface SalesManagerResponseDTO {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   fullName: string;
   phone: string | null;
   email: string | null;
   note: string | null;
   registrationNumber: string | null
}

export interface SalesManagerSelectDTO {
   id: number;
   name: string;
}

export type SalesManagerFormProps = {
   initialSalesManagerData?: SalesManager;
};
