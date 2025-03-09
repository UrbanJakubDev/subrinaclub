'use client'
import React, { useState } from 'react';
import { AccountInfoCardProps } from "@/lib/services/account/types";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModalComponent from "@/components/ui/modal";
import { useModalStore } from "@/stores/ModalStore";
import { Typography } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import StatusChip from "@/components/tables/ui/statusChip";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import SavingPeriodActions from "./SavingPeriodActions";
import { QuarterDate } from '@/lib/utils/quarterDateUtils';

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, savingPeriod, isLoading }) => {
   const router = useRouter();
   const [isClosing, setIsClosing] = useState(false);
   const [isCreating, setIsCreating] = useState(false);
   const { actions } = useModalStore();
   const savingPeriodStart = savingPeriod ? `${savingPeriod.startYear}/${savingPeriod.startQuarter}` : '';
   const savingPeriodEnd = savingPeriod ? `${savingPeriod.endYear}/${savingPeriod.endQuarter}` : '';

   // Initt QuarterDateUtils with the current date
   const quarterDate = new QuarterDate();
   const { actualYear, actualQuarter } = quarterDate.getActualYearAndQuarter();
   const { followingYear, followingQuarter } = quarterDate.getFollowingYearAndQuarter();
   
   if (isLoading) return <Skeleton className="w-1/4" />;
   if (!account) return <pre>Account not found</pre>;

   const handleCloseSavingPeriod = async (closeNow = false) => {
      if (!savingPeriod) return;

      // Show warning dialog if there are available points
      if (savingPeriod.availablePoints > 0) {
         // Open confirmation modal with data about the closing operation
         actions.openModal('closeSavingPeriodConfirmation', {
            availablePoints: savingPeriod.availablePoints,
            closeNow,
            actualYear,
            actualQuarter
         });
      } else {
         // If no points, proceed directly
         executeCloseSavingPeriod(closeNow);
      }
   };

   // Function to execute the API call to close the saving period
   const executeCloseSavingPeriod = async (closeNow: boolean) => {
      if (!savingPeriod) return;
      
      try {
         setIsClosing(true);
         const response = await fetch(`/api/saving-periods/${savingPeriod.id}/close`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(
               closeNow ? {
                  createNewPeriod: true,
                  startYear: followingYear,
                  startQuarter: followingQuarter
               } : {
                  createNewPeriod: true
               }
            )
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


   // Confirmation Dialog Component
   const CloseSavingPeriodConfirmation = () => {
      const { actions, data } = useModalStore();
      
      if (!data) return null;
      
      const { availablePoints, closeNow, actualYear, actualQuarter } = data;
      
      const handleConfirm = () => {
         actions.closeModal();
         executeCloseSavingPeriod(closeNow);
      };
      
      const handleCancel = () => {
         actions.closeModal();
      };
      
      return (
         <ModalComponent
            modalId="closeSavingPeriodConfirmation"
            title={closeNow ? "Uzavření šetřícího období nyní" : "Uzavření šetřícího období"}
         >
            <div className="space-y-4">
               {/* Warning about unused points */}
               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                     <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                     </div>
                     <div className="ml-3">
                        <Typography variant="h6" className="text-yellow-700">
                           Nevybrané body
                        </Typography>
                        <div className="text-yellow-700">
                           <p className="font-medium">
                              V šetřícím období máte <span className="font-bold">{availablePoints}</span> nevybraných bodů.
                           </p>
                           <p>
                              Pokud období uzavřete, tyto body již nebude možné vybrat.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Explanation of what will happen */}
               <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                     <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                     </div>
                     <div className="ml-3">
                        <Typography variant="h6" className="text-blue-700">
                           Co se stane
                        </Typography>
                        <div className="text-blue-700">
                           {closeNow ? (
                              <>
                                 <p className="font-medium">
                                    Uzavřete aktuální šetřící období k roku <strong>{actualYear}</strong> a čtvrtletí <strong>{actualQuarter}</strong>.
                                 </p>
                                 <p>
                                    Bude vytvořeno nové šetřící období začínající od aktuálního roku <strong>{followingYear}</strong> a čtvrtletí <strong>{followingQuarter}</strong>.
                                 </p>
                              </>
                           ) : (
                              <>
                                 <p className="font-medium">
                                    Uzavřete aktuální šetřící období a bude automaticky vytvořeno nové šetřící období.
                                 </p>
                                 <p>
                                    Nové období bude začínat v následujícím čtvrtletí po konci aktuálního období.
                                 </p>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               
               <Typography variant="paragraph" className="font-bold text-gray-900">
                  Opravdu chcete pokračovat?
               </Typography>
               
               <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                     onClick={handleCancel}
                     variant="outlined"
                     color="gray"
                  >
                     Zrušit
                  </Button>
                  <Button 
                     onClick={handleConfirm}
                     variant="filled"
                     color="red"
                     disabled={isClosing}
                  >
                     {isClosing ? (
                        <LoadingSpinner size="sm" text="Uzavírání..." />
                     ) : (
                        closeNow ? 'Uzavřít období nyní' : 'Uzavřít období'
                     )}
                  </Button>
               </div>
            </div>
         </ModalComponent>
      );
   };

   return (
      <>
         <CloseSavingPeriodConfirmation />
         
         <Card className="p-8 flex flex-col rounded-sm">
            <Typography variant="h3" color="black">Stav účtu</Typography>
            <span className="text-sm text-gray-500">Účet s ID: {account.id}</span>
            <div className="w-full flex flex-col gap-8 mt-6">
               <article>
                  <Typography variant="h5" color="black">Body na účtu</Typography>
                  <p>Klubové konto: {account.lifetimePoints}</p>
                  <p>Roční konto: {new Date().getFullYear()}: {account.currentYearPoints}</p>
               </article>

               <article>
                  <Typography variant="h5" color="black">
                     <span className="flex items-center gap-2">
                        Aktivní šetřící období
                     </span>
                     <div className="flex items-center gap-2"><StatusChip status={savingPeriod?.status} /> <span className=" text-sm text-gray-500">ID: {savingPeriod?.id}</span></div>
                     <p className="text-xl mt-4">Od: {savingPeriodStart} - Do: {savingPeriodEnd} </p>


                  </Typography>
                  {isLoading ? (
                     <Skeleton className="w-full h-24" />
                  ) : savingPeriod ? (
                     <>

                        <p>Průběžné konto: {savingPeriod.totalDepositedPoints?.toString()}</p>
                        <p>Průběžné konto k dispozici: {savingPeriod.availablePoints}</p>
                        <p>Průměrné body před přiřazením obchodního zástupce: {account.averagePointsBeforeSalesManager?.toString()}</p>
                        <SavingPeriodActions 
                           isClosing={isClosing}
                           onClose={handleCloseSavingPeriod}
                        />
                        <Link
                           href={`/accounts/${account.id}/saving-periods`}
                           className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                           (Správa šetřících období)
                        </Link>
                     </>
                  ) : (
                     <div className="space-y-4">
                        <p className="text-yellow-600">Žádné aktivní šetřící období</p>
                        <Link
                           href={`/accounts/${account.id}/saving-periods`}
                           className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                           (Správa šetřících období)
                        </Link>
                     </div>
                  )}
               </article>
            </div>
         </Card>
      </>
   );
};

export default AccountInfoCard;