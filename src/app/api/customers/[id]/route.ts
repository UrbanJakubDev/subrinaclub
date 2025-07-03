import { customerAPI } from "@/lib/services/customer";
import { NextResponse } from "next/server";


// Get user by id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const customerId = Number(params.id);
    const customer = await customerAPI.getCustomer(customerId);
    return NextResponse.json(customer);
}

// Endpoint for updating customer
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const customerId = parseInt(params.id);
    const body = await request.json();
    
    // Check if we're updating the active status
    if (body.active !== undefined) {
        const customer = body.active 
            ? await customerAPI.activateCustomer(customerId)
            : await customerAPI.deactivateCustomer(customerId);
        return NextResponse.json(customer);
    }
    
    // For other updates, you might want to add a general update method
    return NextResponse.json({ error: 'No valid update data provided' }, { status: 400 });
}