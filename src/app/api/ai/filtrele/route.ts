import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, FILTRE_SISTEM_MESAJI } from "@/lib/anthropic";
import { tokenDogrula } from "@/lib/firebase-admin";
import { rateLimitKontrol } from "@/lib/rate-limit";
import type { AIFiltreRequest, AIFiltreSonucu } from "@/types";
import { tumDestekler } from "@/data/destekler";

export async function POST(req: NextRequest) {
  const kullanici = await tokenDogrula(req);
  if (!kullanici) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  // Dakikada 5 istek (AI filtreleme pahalı)
  const rl = rateLimitKontrol(kullanici.uid, 5, 60_000);
  if (!rl.basarili) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bir dakika bekleyin." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.sifirlanmaMs - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

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
