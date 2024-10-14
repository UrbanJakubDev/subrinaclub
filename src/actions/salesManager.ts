'use server'
import { revalidatePath } from 'next/cache'
import { ISalesManager } from "@/interfaces/interfaces"
import { create, get, update } from '@/db/queries/salesManagers'


export async function getSalesManagers() {
    const result = await get()
    return result
}

export async function addSalesManager(data: ISalesManager) {
    const result = await create(data)
    revalidatePath('sales-managers/')
    return result
}

export async function updateSalesManager(id: string, data: ISalesManager) {
    const result = await update(parseInt(id), data)
    revalidatePath('sales-managers/')
    return result
}

export async function deleteSalesManager(id: string) {
    const result = await update(parseInt(id), { active: false })
    revalidatePath('sales-managers/')
    return result
}

export async function refreshSalesManagersData() {
    revalidatePath('sales-managers/')
}