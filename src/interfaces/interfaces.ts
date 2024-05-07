export interface IDealer {
  id: number;
  publicId: string;
  name: string;
  address: string;
  town: string;
  psc: string;
  phone: string;
  email: string;
  note: string;
}

export interface ISalesManager {
  id: number;
  publicId: string;
  fullName: string;
  birthDate: string;
  birthDateD: Date;
  phone: string;
  email: string;
  registratedSince: string;
  registratedSinceD: Date;
  address: string;
  town: string;
  psc: string;
  note: string;
  dealerId: number;
  dealer: IDealer;
}

export interface ICustomer {
  id: number;
  active: number;
  registrationNumber: number;
  fullName: string;
  publicId: string;
  birthDateD: Date;
  ico: string;
  phone: string;
  email: string;
  registratedSinceD: Date;
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
}

export interface IAccount {
  id: number;
  type: "LIFETIME" | "TWO_YEAR"; // Adjust the possible values based on your actual types
  balance: number;
  createdAt: Date;
  openedAt: Date | null;
  closedAt: Date | null;
  customerId: number;
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
