import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import { AccountInfoCardProps } from "@/lib/services/customer/types";
import React from 'react';
import CustomerAccountDetail from "./account/detail";
import DetailDataWrapper from "./detailDataWrapper";



const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, customer }) => {
   const { savingPeriod } = account;

   const savingPeriodStart = `${savingPeriod.startYear}/${savingPeriod.startQuarter}`;
   const savingPeriodEnd = `${savingPeriod.endYear}/${savingPeriod.endQuarter}`;

   return (
      <Card className="p-8 flex flex-row grow rounded-sm">
         <div className="w-1/3">

         <Typography variant="h2" color="black">Účet s ID: {account.id}</Typography>

         <article>
            <Typography variant="h5" color="black">Body na účtu</Typography>
            <p>Celkem: {account.lifetimePoints}</p>
            <p>Body pro rok {new Date().getFullYear()}: {account.currentYearPoints}</p> 
            <p>Celkem vybráno bodů: {account.totalWithdrawnPonits}</p>
         </article>

         <article>
            <Typography variant="h5" color="black">Aktivní šetřící obodbí</Typography>
            <StatusChip status={savingPeriod.status} />
            <p>Od: {savingPeriodStart} - Do: {savingPeriodEnd} </p>
            <p>Body k dispozici: {savingPeriod.availablePoints}</p>
            <p>Body nasbírané v šetřícím období: {savingPeriod.totalDepositedPoints}</p>
            <p>Body vybrané v šetřícím období: {savingPeriod.totalWithdrawnPoints}</p>
         </article>
         </div>
         <DetailDataWrapper initialCustomer={customer} />
      </Card>
   );
};

export default AccountInfoCard;