

export type Customer = {
   id: number;
   publicId: string;
   active: boolean;
   createdAt: string;
   updatedAt: string;
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
   note: string | null;
   gdpr: number;
   dealerId: number;
   salesManagerId: number;
   salesManagerSinceQ: number;
   salesManagerSinceYear: number;
   salesManagerSinceQuarter: number | null;
   dealer: {
      fullName: string;
   };
   salesManager: {
      fullName: string;
   };
   account: {
      id: number;
      currentYearPoints: number;
      lifetimePoints: number;
      lifetimePointsCorrection: number;
      averagePointsBeforeSalesManager: string;
      lifetimePointsCorrected: number;
      savingPeriodId: number;
      savingPeriodStatus: string;
      savingPeriodCreatedAt: string;
      savingPeriodUpdatedAt: string;
      savingPeriodStartYear: number;
      savingPeriodStartQuarter: number;
      savingPeriodEndYear: number;
      savingPeriodEndQuarter: number;
      savingPeriodStartDateTime: string;
      savingPeriodEndDateTime: string;
      savingPeriodAvailablePoints: number;
      savingPeriodTotalDepositedPoints: number;
      savingPeriodTotalWithdrawnPoints: number;
      savingPeriodClosedAt: string | null;
      savingPeriodCloseReason: string | null;
      savingPeriodAccountId: number;
   };
};
