import { SelectOption } from "@/types/types";

export interface Bonus {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   name: string;
   description: string | null;
   points: number;
   price: number;
   transactions: any[];
}

export interface BonusSelectDTO extends SelectOption {
}

export type BonusFormProps = {
   initialBonusData?: Bonus;
};
