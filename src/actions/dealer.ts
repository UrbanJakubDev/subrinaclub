'use server'

import { dealerService } from '@/lib/services/dealer'
import { Dealer } from '@prisma/client'
import { revalidatePath } from 'next/cache'


export async function addDealerServerAction(data: Dealer) {
   const result = await dealerService.create(data)
   revalidatePath('dealers/')
   return result
}

export async function updateDealerServerAction(id: string, data: Dealer) {
   const result = await dealerService.update(Number(id), data)
   revalidatePath('dealers/')
   return result
}

export async function refreshDealersDataServerAction() {
   revalidatePath('dealers/')
}