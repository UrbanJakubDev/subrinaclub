'use client'
import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import React from 'react';
import { AccountInfoCardProps } from "@/lib/services/account/types";
import Skeleton from "@/components/ui/skeleton";



const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, savingPeriod, isLoading }) => {
   
   const savingPeriodStart = savingPeriod ? `${savingPeriod.startYear}/${savingPeriod.startQuarter}` : '';
   const savingPeriodEnd = savingPeriod ? `${savingPeriod.endYear}/${savingPeriod.endQuarter}` : '';
   
   if (isLoading) return <Skeleton className="w-1/4" />;
   if (!account) return <pre>Account not found</pre>;



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
               {isLoading ? (
                  <Skeleton className="w-full h-24" />
               ) : savingPeriod ? (
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