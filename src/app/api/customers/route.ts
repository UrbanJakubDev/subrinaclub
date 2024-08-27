import { CustomerService } from "@/db/queries/customers";
import { NextResponse } from "next/server";

const customerService = new CustomerService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get all query parameters from the URL
  const id = searchParams.get("id");
  const ico = searchParams.get("ico");
  const active = searchParams.get("active") === "true";



  if (id) {
    // Fetch customer by ID
    const customer = await customerService.getCustomerById(Number(id));
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  }

  if (ico) {
    // Fetch customer by ICO
    const customer = await customerService.findCustomerByIcoOrFullName(ico);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  }

  // If no parameters, fetch all customers
  const customers = await customerService.getCustomers(active);
  return NextResponse.json(customers);
}



export async function POST(request: Request) {
  const body = await request.json();

  try {
    const customer = await customerService.createCustomer(body);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  body.registrationNumber = Number(body.registrationNumber);
  console.log("PUT /api/customers", id, body);

  // Update the customer in the database and his relations to the dealer and sales manager
  try {
    const updatedCustomer = await customerService.updateCustomerById(
      Number(id),
      body
    );
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}

