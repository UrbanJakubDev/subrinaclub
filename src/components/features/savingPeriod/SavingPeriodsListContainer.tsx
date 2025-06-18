'use client';

import React, { useState } from 'react';
import { SavingPeriod, ApiResponse } from '@/types/types';
import { Card, Typography, Button as MButton } from "@material-tailwind/react";
import StatusChip from '@/components/tables/ui/statusChip';
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/ui/skeleton';
import Button from '@/components/ui/button';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { savingPeriodUpdateValidationSchema } from '@/validations/savingPeriod';
import { Input, Select, Option } from '@material-tailwind/react';
import { useUpdateSavingPeriod, useDeleteSavingPeriod } from '@/lib/queries/savingPeriod/mutations';
import { toast } from 'react-toastify';
import { useSavingPeriodsByAccount } from '@/lib/queries/savingPeriod/queries';
import SavingPeriodFormComponent from './savingPeriodFormComponent';
import NoData from '@/components/ui/noData';

interface SavingPeriodsListContainerProps {
   accountId: number;
}

export default function SavingPeriodsListContainer({accountId}: SavingPeriodsListContainerProps) {
   const router = useRouter();
   const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
   const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

   const { 
      data: savingPeriodsResponse, 
      isLoading: isSavingPeriodsLoading,
      isError: isSavingPeriodsError,
      error: savingPeriodsError
   } = useSavingPeriodsByAccount(accountId)

   // Mutations
   const { mutate: updateSavingPeriod, isPending: isUpdating } = useUpdateSavingPeriod();
   const { mutate: deleteSavingPeriod, isPending: isDeleting } = useDeleteSavingPeriod();

   // Form functions
   const getDefaultValues = (period: SavingPeriod) => ({
      startYear: period.startYear,
      startQuarter: period.startQuarter,
      endYear: period.endYear,
      endQuarter: period.endQuarter,
      status: period.status,
      closeReason: period.closeReason || '',
   });

   const {
      register,
      handleSubmit,
      control,
      reset,
      watch,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(savingPeriodUpdateValidationSchema),
      defaultValues: editingPeriodId && savingPeriodsResponse?.data
         ? getDefaultValues(savingPeriodsResponse.data.find(p => p.id === editingPeriodId) as SavingPeriod)
         : undefined,
   });

   const handleEdit = (period: SavingPeriod) => {
      setEditingPeriodId(period.id);
      reset(getDefaultValues(period));
   };

   const handleCancel = () => {
      setEditingPeriodId(null);
   };

   const onSubmit: SubmitHandler<any> = (data) => {
      if (!editingPeriodId) return;

      // Vypočítat datum začátku a konce z roku a čtvrtletí
      const startDateTime = new Date(data.startYear, (data.startQuarter - 1) * 3, 1);
      const endDateTime = new Date(data.endYear, (data.endQuarter - 1) * 3 + 2, 31);
      
      const updatedData = {
         ...data,
         startDateTime,
         endDateTime,
         closeReason: data.status === 'CLOSED' ? data.closeReason : null,
         closedAt: data.status === 'CLOSED' ? new Date() : null,
      };

      updateSavingPeriod(
         { id: editingPeriodId, data: updatedData },
         {
            onSuccess: () => {
               toast.success('Šetřící období bylo úspěšně aktualizováno');
               setEditingPeriodId(null);
            },
            onError: (error: any) => {
               toast.error(`Chyba při aktualizaci: ${error?.message || 'Neznámá chyba'}`);
            }
         }
      );
   };

   const handleDelete = (periodId: number) => {
      if (confirmingDeleteId === periodId) {
         deleteSavingPeriod(
            periodId,
            {
               onSuccess: () => {
                  toast.success('Šetřící období bylo úspěšně smazáno');
                  setConfirmingDeleteId(null);
               },
               onError: (error: any) => {
                  toast.error(`Chyba při mazání: ${error?.message || 'Neznámá chyba'}`);
               }
            }
         );
      } else {
         setConfirmingDeleteId(periodId);
      }
   };

   if (isSavingPeriodsLoading) {
      return <Skeleton className="h-screen w-full" />
   }

   if (isSavingPeriodsError) {
      console.error('Saving Periods Error:', savingPeriodsError);
      return (
         <div className="p-4">
            <Typography variant="h5" color="red">
               Error loading data. Please try again later.
            </Typography>
         </div>
      )
   }

   if (!savingPeriodsResponse?.data || !Array.isArray(savingPeriodsResponse.data) || savingPeriodsResponse.data.length === 0) {
      return <NoData message="Nebyly nalezeny žádné šetřící období" />
   }

   return (
      <div className="space-y-4">
         {savingPeriodsResponse.data.map((period: SavingPeriod) => (
            <Card key={period.id} className="p-4">
               <div className="flex justify-between items-start">
                  <div className="w-full">
                     <div className="flex items-center gap-2 mb-2">
                        <StatusChip status={period.status === "ACTIVE"} />
                        <span className="text-sm text-gray-500">
                           ID: {period.id}
                        </span>
                     </div>
                     
                     {editingPeriodId === period.id ? (
                        <SavingPeriodFormComponent initialSavingPeriodData={period} />
                     ) : (
                        <>
                           <p>
                              Od: {period.startYear}/Q{period.startQuarter} - 
                              Do: {period.endYear}/Q{period.endQuarter}
                           </p>
                           <p className="text-sm text-gray-600">
                              Body k dispozici: {period.availablePoints}
                           </p>
                           <p className="text-sm text-gray-600">
                              Nasbírané body: {period.totalDepositedPoints}
                           </p>
                           <p className="text-sm text-gray-600">
                              Vybrané body: {period.totalWithdrawnPoints}
                           </p>
                           {period.closedAt && (
                              <p className="text-sm text-gray-600">
                                 Uzavřeno: {new Date(period.closedAt).toLocaleDateString('cs-CZ')}
                                 {period.closeReason && ` - ${period.closeReason}`}
                              </p>
                           )}
                           <div className="flex gap-2 mt-4">
                              <Button
                                 onClick={() => handleEdit(period)}
                                 variant="outlined"
                                 size="sm"
                              >
                                 Upravit
                              </Button>
                              <Button
                                 onClick={() => handleDelete(period.id)}
                                 variant="outlined"
                                 size="sm"
                                 className={confirmingDeleteId === period.id ? 
                                    "text-red-600 border-red-600 hover:text-red-800 hover:border-red-800" : ""}
                                 disabled={isDeleting && confirmingDeleteId === period.id}
                              >
                                 {confirmingDeleteId === period.id ? 
                                    (isDeleting ? "Mazání..." : "Potvrdit smazání") : 
                                    "Smazat"}
                              </Button>
                              <Button
                                 onClick={() => router.push(`/accounts/${accountId}/saving-periods/${period.id}`)}
                                 variant="filled"
                                 size="sm"
                              >
                                 Detail
                              </Button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </Card>
         ))}
      </div>
   );
} 