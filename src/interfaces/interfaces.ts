export interface ICustomer {
  id: number;
  publicId: string;
  active: number;
  fullName: string;
  birthDate: string;
  registrationNumber: number;
  ico: string;
  phone: string;
  email: string;
  registratedSince: string;
  salonName: string;
  address: string;
  town: string;
  psc: string;
  note: string;
  dealerId: number;
  salesManagerId: number;
  salesManagerSinceQ: number;
  salesManagerSinceYear: number;
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
