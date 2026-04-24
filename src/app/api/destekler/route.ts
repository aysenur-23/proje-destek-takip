import { NextResponse } from "next/server";
import { tumDestekler } from "@/data/destekler";

export async function GET() {
  const aktif = tumDestekler.filter((d) => d.aktif);
  return NextResponse.json(aktif);
}
