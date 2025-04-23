'use client';

import React, { useState } from 'react';
import { Account, SavingPeriod } from '@prisma/client';
import Button from '@/components/ui/button';
import Card from '@/components/ui/mtui';
import StatusChip from '@/components/tables/ui/statusChip';
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/ui/skeleton';

interface SavingPeriodsManagerProps {
   savingPeriods: SavingPeriod[];
}

interface EditFormData {
   startYear: number;
   startQuarter: number;
   endYear: number;
   endQuarter: number;
   status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
   closeReason?: string;
}

export default function SavingPeriodsManager({ savingPeriods }: SavingPeriodsManagerProps) {
   const router = useRouter();
   const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
   const [formData, setFormData] = useState<EditFormData>({
      startYear: 0,
      startQuarter: 1,
      endYear: 0,
      endQuarter: 4,
      status: 'ACTIVE',
   });

   const handleEdit = (period: SavingPeriod) => {
      setEditingPeriodId(period.id);
      setFormData({
         startYear: period.startYear,
         startQuarter: period.startQuarter,
         endYear: period.endYear,
         endQuarter: period.endQuarter,
         status: period.status,
         closeReason: period.closeReason || undefined,
      });
   };

   const handleSave = async () => {
      if (!editingPeriodId) return;

      try {
         const response = await fetch(`/api/saving-periods/${editingPeriodId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               ...formData,
               startDateTime: new Date(formData.startYear, (formData.startQuarter - 1) * 3, 1),
               endDateTime: new Date(formData.endYear, (formData.endQuarter - 1) * 3 + 2, 31),
               closedAt: formData.status === 'CLOSED' ? new Date() : null,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to update saving period');
         }

         setEditingPeriodId(null);
         router.refresh();
      } catch (error) {
         console.error('Error updating saving period:', error);
         alert('Nepodařilo se aktualizovat šetřící období');
      }
   };

   const handleDelete = async (periodId: number) => {
      const confirmDelete = window.confirm(
         'UPOZORNĚNÍ: Smazání šetřícího období smaže také všechny transakce v tomto období. ' +
         'Pokud bylo období aktivní, bude aktivováno předchozí období. ' +
         'Opravdu chcete smazat toto šetřící období?'
      );

      if (!confirmDelete) return;

      try {
         const response = await fetch(`/api/saving-periods/${periodId}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error('Failed to delete saving period');
         }

         router.refresh();
      } catch (error) {
         console.error('Error deleting saving period:', error);
         alert('Nepodařilo se smazat šetřící období');
      }
   };

   const handleCancel = () => {
      setEditingPeriodId(null);
   };

   

   return (
      <div className="space-y-4">
         {savingPeriods.map((period) => (
            <Card key={period.id} className="p-4">
               <div className="flex justify-between items-start">
                  <div className="w-full">
                     <div className="flex items-center gap-2 mb-2">
                        <StatusChip status={period.status === "ACTIVE" ? true : false} />
                        <span className="text-sm text-gray-500">
                           ID: {period.id}
                        </span>
                     </div>
                     
                     {editingPeriodId === period.id ? (
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium mb-1">
                                    Počáteční rok
                                 </label>
                                 <input
                                    type="number"
                                    value={formData.startYear}
                                    onChange={(e) => setFormData({
                                       ...formData,
                                       startYear: parseInt(e.target.value)
                                    })}
                                    className="border rounded p-2 w-full"
                                 />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-1">
                                    Počáteční čtvrtletí
                                 </label>
                                 <select
                                    value={formData.startQuarter}
                                    onChange={(e) => setFormData({
                                       ...formData,
                                       startQuarter: parseInt(e.target.value)
                                    })}
                                    className="border rounded p-2 w-full"
                                 >
                                    <option value={1}>Q1</option>
                                    <option value={2}>Q2</option>
                                    <option value={3}>Q3</option>
                                    <option value={4}>Q4</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-1">
                                    Koncový rok
                                 </label>
                                 <input
                                    type="number"
                                    value={formData.endYear}
                                    onChange={(e) => setFormData({
                                       ...formData,
                                       endYear: parseInt(e.target.value)
                                    })}
                                    className="border rounded p-2 w-full"
                                 />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-1">
                                    Koncové čtvrtletí
                                 </label>
                                 <select
                                    value={formData.endQuarter}
                                    onChange={(e) => setFormData({
                                       ...formData,
                                       endQuarter: parseInt(e.target.value)
                                    })}
                                    className="border rounded p-2 w-full"
                                 >
                                    <option value={1}>Q1</option>
                                    <option value={2}>Q2</option>
                                    <option value={3}>Q3</option>
                                    <option value={4}>Q4</option>
                                 </select>
                              </div>
                              <div className="col-span-2">
                                 <label className="block text-sm font-medium mb-1">
                                    Status
                                 </label>
                                 <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({
                                       ...formData,
                                       status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'CLOSED',
                                       closeReason: e.target.value === 'CLOSED' ? formData.closeReason || '' : undefined
                                    })}
                                    className="border rounded p-2 w-full"
                                 >
                                    <option value="ACTIVE">Aktivní</option>
                                    <option value="INACTIVE">Neaktivní</option>
                                    <option value="CLOSED">Uzavřené</option>
                                 </select>
                              </div>
                              {(formData.status === 'CLOSED' || period.closeReason) && (
                                 <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">
                                       Důvod uzavření
                                    </label>
                                    <input
                                       type="text"
                                       value={formData.closeReason || ''}
                                       onChange={(e) => setFormData({
                                          ...formData,
                                          closeReason: e.target.value
                                       })}
                                       className="border rounded p-2 w-full"
                                       placeholder="Zadejte důvod uzavření"
                                       required={formData.status === 'CLOSED'}
                                    />
                                 </div>
                              )}
                           </div>
                           <div className="flex gap-2">
                              <Button onClick={handleSave} size="sm">
                                 Uložit
                              </Button>
                              <Button onClick={handleCancel} variant="outlined" size="sm">
                                 Zrušit
                              </Button>
                           </div>
                        </div>
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
                                 className="text-red-600 hover:text-red-800 border-red-600 hover:border-red-800"
                              >
                                 Smazat
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