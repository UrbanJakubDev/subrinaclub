import { Dealer } from "@/types/dealer";
import { SelectOption } from "@/types/types";

export interface DealerResponseDTO {
   id: number;
   active: boolean;
   createdAt: Date;
   updatedAt: Date;
   fullName: string;
   registrationNumber: number | null;
   ico: string | null;
   phone: string | null;
   email: string | null;
   registratedSince: Date | null;
   address: string | null;
   town: string | null;
   psc: string | null;
   note: string | null;
}

export interface DealerSelectDTO extends SelectOption {
}

export type DealerFormProps = {
   initialDealerData?: Dealer;
};