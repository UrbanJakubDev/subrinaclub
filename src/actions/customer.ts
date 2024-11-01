'use server'

import { customerService } from "@/lib/services/customer"
import { revalidatePath } from "next/cache"

export async function addCustomerServerAction(data: any) {
    const result = await customerService.create(data)
    revalidatePath('customers/')
    return result
}

export async function updateCustomerServerAction(id: string, data: any) {
    const result = await customerService.update(parseInt(id), data)
    revalidatePath('customers/')
    return result
}

export async function refreshCustomersDataServerAction() {
    revalidatePath('customers/')
}