/* 
   This file cotains basic set of CRUD operations for savingPeriods table.
*/

import {prisma} from "../pgDBClient";

export default async function getAllSavingPeriods() {
  const savingPeriods = await prisma.savingPeriod.findMany();
  return savingPeriods;
}

export async function getSavingPeriodById(id: number) {
   const savingPeriod = await prisma.savingPeriod.findUnique({
      where: {
         id: id,
      },
   });
   return savingPeriod;
   }

export async function getSavingPeriodByUserId(userId: number) {
   const savingPeriod = await prisma.savingPeriod.findFirst({
      where: {
         account: {
            customerId: userId,
         },
      },
   });
   return savingPeriod;
}

export async function createSavingPeriod(data: any) {
   const savingPeriod = await prisma.savingPeriod.create({
      data: {
         ...data,
      },
   });
   return savingPeriod;
}

export async function updateSavingPeriod(id: number, data: any) {
   const savingPeriod = await prisma.savingPeriod.update({
      where: {
         id: id,
      },
      data: {
         ...data,
      },
   });
   return savingPeriod;
}

// Delete savingPeriod by id as change the active flag to false
export async function deleteSavingPeriod(id: number) {
   const savingPeriod = await prisma.savingPeriod.update({
      where: {
         id: id,
      },
      data: {
         active: false,
      },
   });
   return savingPeriod;
}