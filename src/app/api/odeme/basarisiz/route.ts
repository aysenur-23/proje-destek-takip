import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const neden = formData.get("ResponseMessage") ?? "bilinmiyor";
  return NextResponse.redirect(
    new URL(`/odeme?durum=basarisiz&neden=${encodeURIComponent(neden.toString())}`, req.url),
  );
}
