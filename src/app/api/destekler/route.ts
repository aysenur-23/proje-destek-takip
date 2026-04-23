import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { DestekProgrami } from "@/types";

export async function GET() {
  try {
    const destekler = await prisma.destekProgrami.findMany({
      where: { aktif: true },
      orderBy: [{ oncelik: "asc" }, { ad: "asc" }],
    });
    return NextResponse.json(destekler);
  } catch {
    const { tumDestekler } = await import("@/data/destekler");
    return NextResponse.json(tumDestekler);
  }
}

// Admin: Destek programını güncelle
export async function PATCH(req: NextRequest) {
  try {
    const { slug, ...veri } = await req.json();
    if (!slug) return NextResponse.json({ error: "slug zorunlu" }, { status: 400 });

    const guncellendi = await prisma.destekProgrami.update({
      where: { slug },
      data: {
        ...veri,
        sonGuncelleyenKullanici: "admin",
        guncellemNotu: veri.guncellemNotu ?? `${new Date().toLocaleDateString("tr-TR")} tarihinde güncellendi`,
      },
    });
    return NextResponse.json(guncellendi);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Admin: Yeni destek programı ekle
export async function POST(req: NextRequest) {
  try {
    const veri = (await req.json()) as DestekProgrami;
    const yeni = await prisma.destekProgrami.create({
      data: {
        slug: veri.slug,
        ad: veri.ad,
        kurum: veri.kurum,
        kategori: veri.kategori,
        tur: veri.tur,
        aciklama: veri.aciklama,
        amac: veri.amac,
        butceUstSinir: veri.butceUstSinir ?? null,
        hibeOrani: veri.hibeOrani ?? null,
        basvuruBaslangic: veri.basvuruBaslangic ? new Date(veri.basvuruBaslangic) : null,
        basvuruBitis: veri.basvuruBitis ? new Date(veri.basvuruBitis) : null,
        aktif: veri.aktif,
        mevzuatUrl: veri.mevzuatUrl,
        rehberUrl: veri.rehberUrl ?? null,
        kriterler: veri.kriterler as object,
        etiketler: veri.etiketler,
        oncelik: veri.oncelik,
        sonGuncelleyenKullanici: "admin",
      },
    });
    return NextResponse.json(yeni, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
