import { getDealerById } from "@/db/queries/dealers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const dealer = await getDealerById(Number(id));

  return NextResponse.json(dealer);
}