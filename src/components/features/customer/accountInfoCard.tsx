'use client'
import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import React, { useEffect } from 'react';
import AccountDataView from "./account/AccountDataView";
import { useStatsStore } from "@/stores/CustomerStatsStore";
import Skeleton from "@/components/ui/skeleton";
import { AccountInfoCardProps } from "@/lib/services/account/types";



const AccountInfoCard: React.FC<AccountInfoCardProps> = () => {
   const customer = useStatsStore(state => state.customer);
   const refreshCustomer = useStatsStore(state => state.refreshCustomerFromServer);
   const account = customer?.account;
   const savingPeriod = account?.savingPeriod;

   useEffect(() => {
      if (account && !savingPeriod) {
         refreshCustomer();
      }
   }, [account?.id]);

   const savingPeriodStart = savingPeriod ? `${savingPeriod.startYear}/${savingPeriod.startQuarter}` : '';
   const savingPeriodEnd = savingPeriod ? `${savingPeriod.endYear}/${savingPeriod.endQuarter}` : '';

   if (!account) return <pre>Account not found</pre>

   return (
      <Card className="p-8 flex flex-col rounded-sm">
         <Typography variant="h2" color="black">Účet s ID: {account.id}</Typography>
         <div className="w-full flex flex-col gap-8">
            <article>
               <Typography variant="h5" color="black">Body na účtu</Typography>
               <p>Celkem: {account.lifetimePoints}</p>
               <p>Body pro rok {new Date().getFullYear()}: {account.currentYearPoints}</p>
            </article>

            <article>
               <Typography variant="h5" color="black">Aktivní šetřící období</Typography>
               {savingPeriod ? (
                  <>
                     <StatusChip status={savingPeriod.status} />
                     <p>Od: {savingPeriodStart} - Do: {savingPeriodEnd} </p>
                     <p>Body k dispozici: {savingPeriod.availablePoints}</p>
                     <p>Body nasbírané v šetřícím období: {savingPeriod.totalDepositedPoints}</p>
                     <p>Body vybrané v šetřícím období: {savingPeriod.totalWithdrawnPoints}</p>
                  </>
               ) : (
                  <p className="text-yellow-600">Žádné aktivní šetřící období</p>
               )}
            </article>
         </div>
      </Card>
   );
};

export default AccountInfoCard;