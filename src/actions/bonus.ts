'use server'
import { fetchActiveBonusesFromDB, fetchBonusByIdFromDB, hardDeleteBonusInDB, insertBonusIntoDB, updateBonusInDB } from '@/lib/db/queries/bonuses'
import { bonusService } from '@/lib/services/bonus'
import { revalidatePath } from 'next/cache'

export async function getBonusesServerAction() {
   return await fetchActiveBonusesFromDB()
}

export async function getBonusServerAction(id: string) {
   return await fetchBonusByIdFromDB(parseInt(id))
}

export async function createBonusServerAction(data: any) {
   const result = await bonusService.create(data)
   refreshBonusesDataServerAction()
   return result
}

export async function updateBonusServerAction(id: string, data: any) {
   const result = await bonusService.update(parseInt(id), data)
   refreshBonusesDataServerAction()
   return result
}

export async function deleteBonusServerAction(id: string) {
   const result = await hardDeleteBonusInDB(parseInt(id))
   refreshBonusesDataServerAction()
   return result
}


export async function refreshBonusesDataServerAction() {
   revalidatePath('bonuses/')
}
