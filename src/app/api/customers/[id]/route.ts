import { customerAPI } from "@/lib/services/customer";
import { NextResponse } from "next/server";


// Endpoint for deactivating customer
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const customerId = parseInt(params.id);
    const customer = await customerAPI.deactivateCustomer(customerId);
    return NextResponse.json(customer);
}