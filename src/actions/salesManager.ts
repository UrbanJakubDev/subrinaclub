'use server'
import { revalidatePath } from 'next/cache'
import { SalesManager } from '@/types/salesmanager'
import { salesManagerService } from '@/lib/services/salesManager'



export async function addSalesManagerServerAction(data: SalesManager) {
    const result = await salesManagerService.create(data)
    revalidatePath('sales-managers/')
    return result
}

export async function updateSalesManagerServerAction(id: string, data: SalesManager) {
    const result = await salesManagerService.update(Number(id), data)
    revalidatePath('sales-managers/')
    return result
}


export async function refreshSalesManagersDataServerAction() {
    revalidatePath('sales-managers/')
}