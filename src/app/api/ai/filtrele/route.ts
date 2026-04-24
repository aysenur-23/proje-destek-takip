import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, FILTRE_SISTEM_MESAJI } from "@/lib/anthropic";
import type { AIFiltreRequest, AIFiltreSonucu } from "@/types";
import { tumDestekler } from "@/data/destekler";

export async function POST(req: NextRequest) {
  try {
    const { firma, destekSluglar } = (await req.json()) as AIFiltreRequest;

    if (!firma || !destekSluglar?.length) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const destekler = tumDestekler.filter((d) => destekSluglar.includes(d.slug));

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
          cache_control: { type: "ephemeral" } as { type: "ephemeral" },
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
