import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, FILTRE_SISTEM_MESAJI } from "@/lib/anthropic";
import type { AIFiltreRequest, AIFiltreSonucu, DestekProgrami } from "@/types";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { firma, destekSluglar } = (await req.json()) as AIFiltreRequest;

    if (!firma || !destekSluglar?.length) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // İlgili destekleri getir
    let destekler: DestekProgrami[] = [];
    try {
      const dbDestekler = await prisma.destekProgrami.findMany({
        where: { slug: { in: destekSluglar } },
      });
      destekler = dbDestekler.map((d) => ({
        slug: d.slug, ad: d.ad, kurum: d.kurum,
        kategori: d.kategori as DestekProgrami["kategori"],
        tur: d.tur as DestekProgrami["tur"],
        aciklama: d.aciklama, amac: d.amac,
        butceUstSinir: d.butceUstSinir ?? undefined,
        hibeOrani: d.hibeOrani ?? undefined,
        aktif: d.aktif, mevzuatUrl: d.mevzuatUrl,
        kriterler: d.kriterler as DestekProgrami["kriterler"],
        etiketler: d.etiketler, oncelik: d.oncelik,
      }));
    } catch {
      const { tumDestekler } = await import("@/data/destekler");
      destekler = tumDestekler.filter((d) => destekSluglar.includes(d.slug));
    }

    const firmaMetni = `
Firma: ${firma.ad}
Şirket türü: ${firma.sirketTuru}
Kuruluş yılı: ${firma.kurulusYili}
Sektör: ${firma.sektorAdi} (${firma.sektorKodu})
Çalışan: ${firma.calısanSayisi}
Yıllık ciro: ${firma.yillikCiro.toLocaleString("tr-TR")} TL
İhracat: ${firma.ihracatYapiyorMu ? "Evet" : "Hayır"}
Ar-Ge: ${firma.argeYapiyorMu ? "Evet" : "Hayır"}
Teknokent: ${firma.teknokentteMi ? "Evet" : "Hayır"}
OSB: ${firma.osbdeMi ? "Evet" : "Hayır"}
İl: ${firma.il}
Kadın girişimci: ${firma.kadinGirisimci ? "Evet" : "Hayır"}
Genç girişimci: ${firma.gencGirisimci ? "Evet" : "Hayır"}
Notlar: ${firma.notlar ?? "Yok"}
    `.trim();

    const destekMetinleri = destekler
      .map((d) => `[${d.slug}] ${d.ad} (${d.kurum}): ${d.aciklama}. Kriterler: ${d.kriterler.notlar ?? ""}`)
      .join("\n\n");

    const mesaj = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: FILTRE_SISTEM_MESAJI,
          // @ts-expect-error SDK extended type
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Firma bilgileri:\n${firmaMetni}\n\nDeğerlendirilecek destekler:\n${destekMetinleri}\n\nHer destek için ayrı değerlendirme yap. Yanıt formatı:\n{"sonuclar": [{"slug": "...", "tavsiye": boolean, "gerekce": "...", "adimlar": ["..."]}]}`,
        },
      ],
    });

    const icerik = mesaj.content[0];
    if (icerik.type !== "text") throw new Error("Beklenmeyen yanıt tipi");

    const jsonMetni = icerik.text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonMetni) throw new Error("JSON bulunamadı");

    const sonuclar = JSON.parse(jsonMetni) as { sonuclar: AIFiltreSonucu[] };
    return NextResponse.json(sonuclar);
  } catch (err) {
    console.error("AI filtrele hatası:", err);
    return NextResponse.json({ error: "AI analizi başarısız" }, { status: 500 });
  }
}
