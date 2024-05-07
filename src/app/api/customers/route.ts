import { getCustomerById, updateCustomerById } from "@/db/queries/customers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const customer = await getCustomerById(Number(id));

  return NextResponse.json(customer);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const customer = await getCustomerById(Number(id));

  return NextResponse.json(customer);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const customer = await updateCustomerById(Number(id), body);

  return NextResponse.json(customer);
}
