import { getDealerById } from "@/lib/db/queries/dealers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  // Find id in URL
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Check if id is present in URL parameters and return error if not
  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Get Data from database
  const dealer = await getDealerById(Number(id));

  // Return data as JSON
  return NextResponse.json(dealer);
}