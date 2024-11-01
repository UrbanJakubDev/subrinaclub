import { customerService } from "@/lib/services/customer";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get all query parameters from the URL
  const id = searchParams.get("id");
  const ico = searchParams.get("ico");
  const active = searchParams.get("active") === "true";



  if (id) {
    // Fetch customer by ID
    const customer = await customerService.get(Number(id));
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  }

  if (ico) {
    // Fetch customer by ICO
    const customer = await customerService.findCustomerByIco(ico);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  }

  // If no parameters, fetch all customers
  const customers = await customerService.getAll(active);
  return NextResponse.json(customers);
}




