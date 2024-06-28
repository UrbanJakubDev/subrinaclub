import { CustomerService } from "@/db/queries/customers";
import { NextResponse } from "next/server";

const customerService = new CustomerService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const ico = searchParams.get("ico");

  console.log("GET /api/customers", id, ico);

  if (!id && !ico) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (ico !== null) {
    const customer = await customerService.findCustomerByIcoOrFullName(ico);

    return NextResponse.json(customer);
  }

  const customer = await customerService.getCustomerById(Number(id));

  return NextResponse.json(customer);
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

