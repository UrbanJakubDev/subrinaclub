'use client'
import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import React, { useState } from 'react';
import { AccountInfoCardProps } from "@/lib/services/account/types";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, savingPeriod, isLoading }) => {
   const router = useRouter();
   const [isClosing, setIsClosing] = useState(false);
   const savingPeriodStart = savingPeriod ? `${savingPeriod.startYear}/${savingPeriod.startQuarter}` : '';
   const savingPeriodEnd = savingPeriod ? `${savingPeriod.endYear}/${savingPeriod.endQuarter}` : '';

   if (isLoading) return <Skeleton className="w-1/4" />;
   if (!account) return <pre>Account not found</pre>;

   const handleCloseSavingPeriod = async () => {
      if (!savingPeriod) return;

      // Warning if there are available points
      if (savingPeriod.availablePoints > 0) {
         const confirmClose = window.confirm(
            `UPOZORNĚNÍ: V šetřícím období máte ${savingPeriod.availablePoints} nevybraných bodů. ` +
            'Pokud období uzavřete, tyto body již nebude možné vybrat. ' +
            'Opravdu chcete uzavřít toto šetřící období?'
         );
         if (!confirmClose) return;
      }

      try {
         setIsClosing(true);
         const response = await fetch(`/api/saving-periods/${savingPeriod.id}/close`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               createNewPeriod: true
            })
         });

         if (!response.ok) {
            throw new Error('Failed to close saving period');
         }

         router.refresh();
      } catch (error) {
         console.error('Error closing saving period:', error);
         alert('Nepodařilo se uzavřít šetřící období. Zkuste to prosím znovu.');
      } finally {
         setIsClosing(false);
      }
   };

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
               <Typography variant="h5" color="black">
                  <span className="flex items-center gap-2">
                     Aktivní šetřící období
                     <Link 
                        href={`/accounts/${account.id}/saving-periods`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                     >
                        (Správa šetřících období)
                     </Link>
                  </span>
               </Typography>
               {isLoading ? (
                  <Skeleton className="w-full h-24" />
               ) : savingPeriod ? (
                  <>
                     <div className="flex items-center gap-4 mb-4">
                        <StatusChip status={savingPeriod.status} />
                        <Button 
                           onClick={handleCloseSavingPeriod}
                           variant="outlined"
                           size="sm"
                           disabled={isClosing}
                        >
                           {isClosing ? (
                              <span className="flex items-center gap-2">
                                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                 </svg>
                                 Uzavírání...
                              </span>
                           ) : (
                              'Uzavřít období a vytvořit nové'
                           )}
                        </Button>
                     </div>
                     <p>Od: {savingPeriodStart} - Do: {savingPeriodEnd} </p>
                     <p>Body k dispozici: {savingPeriod.availablePoints}</p>
                     <p>Body nasbírané v šetřícím období: {savingPeriod.totalDepositedPoints?.toString()}</p>
                     <p>Body vybrané v šetřícím období: {savingPeriod.totalWithdrawnPoints?.toString()}</p>
                     <p>Průměrné body před přiřazením obchodního zástupce: {account.averagePointsBeforeSalesManager?.toString()}</p>
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