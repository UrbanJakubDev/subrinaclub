export interface IDealer {
  id: number;
  active: boolean;
  registrationNumber: number;
  fullName: string;
  publicId: string;
  birthDateD: Date | null;
  ico: string;
  phone: string;
  email: string;
  registratedSinceD: Date | null;
  salonName: string;
  address: string;
  town: string;
  psc: string;
}

export interface ISalesManager {
  id: number;
  active: boolean;
  registrationNumber: number;
  fullName: string;
  publicId: string;
  birthDate: Date | null;
  ico: string;
  phone: string;
  email: string;
  registratedSince: Date | null;
  salonName: string;
  address: string;
  town: string;
  psc: string;
  dealerId: number;
  dealer: IDealer;
}

export interface ICustomer {
  id: number;
  active: boolean;
  registrationNumber: number;
  fullName: string;
  publicId: string;
  birthDateD: Date | null;
  ico: string;
  phone: string;
  email: string;
  registratedSinceD: Date | null;
  salonName: string;
  address: string;
  town: string;
  psc: string;
  note: string;
  dealerId?: number;
  dealer?: IDealer;
  salesManagerId?: number;
  salesManager?: ISalesManager;
  salesManagerSinceQ?: number;
  salesManagerSinceYear?: number;
  accounts: IAccount[];
}

export interface IAccount {
  id: number;
  type: "LIFETIME" | "TWO_YEAR"; // Adjust the possible values based on your actual types
  balance: number;
  createdAt: Date;
  openedAt: Date | null;
  closedAt: Date | null;
  customerId: number;
  transactions: ITransaction[];
  savingPeriods: ISavingPeriod[];
}


export interface ITransaction {
  id: number;
  createdAt: Date;
  year: number;
  quarter: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL"; // Adjust the possible values based on your actual types
  description: string;
  acceptedBonusOrder: Date | null;
  sentBonusOrder: Date | null;
  bonusName: string;
  bonusAmount: number;
  accountId: number;
}

export interface ISavingPeriod {
  id: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  savingStartDate: String
  savingEndDate: String
  balance: number;
  account: IAccount;
}