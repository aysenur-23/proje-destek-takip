import { NextRequest } from "next/server";
import { anthropic, MODEL, PROJE_ASISTANI_SISTEM_MESAJI } from "@/lib/anthropic";
import type { ProjeAsistaniRequest, DestekProgrami } from "@/types";

// Destek programlarına özgü değerlendirme kriterleri
const DESTEK_KRITERLERI: Record<string, string> = {
  "tubitak-1507": `TÜBİTAK 1507 değerlendirme kriterleri:
1. Projenin yenilikçi ve özgün niteliği
2. Teknik fizibilite ve uygulanabilirlik
3. Proje ekibinin yetkinliği ve Ar-Ge kapasitesi
4. Beklenen ekonomik ve teknolojik çıktılar
5. Proje yönetim planı ve iş planı tutarlılığı
6. KOBİ ölçeğine uygunluk`,

  "tubitak-1511": `TÜBİTAK 1511 değerlendirme kriterleri:
1. Ulusal öncelikli teknoloji alanlarıyla uyum
2. Teknoloji olgunluk seviyesi (TRL) ve geliştirme hedefleri
3. Ticarileşme potansiyeli ve pazar analizi
4. Ar-Ge ekibinin uzmanlığı
5. Endüstriyel etki ve rekabet gücü katkısı`,

  "kosgeb-arge-inovasyon": `KOSGEB Ar-Ge ve İnovasyon değerlendirme kriterleri:
1. Projenin inovatif niteliği (artımsal/radikal yenilik)
2. KOBİ'nin kendi Ar-Ge kapasitesi
3. Proje bütçesinin makullüğü ve gerekçesi
4. Beklenen çıktılar (patent, ürün, ihracat)
5. Sürdürülebilirlik ve büyüme planı`,

  default: `Genel hibe başvurusu değerlendirme kriterleri:
1. Projenin hedef ve kapsamı
2. Uygulanabilirlik ve teknik yeterlilik
3. Bütçe gerçekçiliği
4. Ekip yetkinliği
5. Beklenen çıktı ve etkiler
6. Zaman planının tutarlılığı`,
};

export async function POST(req: NextRequest) {
  const { hedefDestekSlug, raporMetni } = (await req.json()) as ProjeAsistaniRequest;

  if (!hedefDestekSlug || !raporMetni?.trim()) {
    return new Response(JSON.stringify({ error: "Geçersiz istek" }), { status: 400 });
  }

  // Destek bilgilerini statik veriden getir
  let destekBilgisi = "";
  const { tumDestekler } = await import("@/data/destekler");
  const d = tumDestekler.find((x) => x.slug === hedefDestekSlug);
  if (d) {
    destekBilgisi = `Destek: ${d.ad} (${d.kurum})\nAmaç: ${d.amac}\nMevzuat: ${d.mevzuatUrl}\nÖzel notlar: ${(d.kriterler as DestekProgrami["kriterler"]).notlar ?? ""}`;
  }

  const kriterler = DESTEK_KRITERLERI[hedefDestekSlug] ?? DESTEK_KRITERLERI.default;

  const sistemMesaji = `${PROJE_ASISTANI_SISTEM_MESAJI}

${destekBilgisi}

${kriterler}

ÇIKTI FORMATI (sadece JSON döndür):
{
  "genelPuan": 0-100,
  "genelYorum": "genel değerlendirme",
  "bolumler": [
    {
      "baslik": "bölüm adı",
      "mevcutMetin": "rapordaki ilgili metin özeti",
      "sorunlar": ["sorun 1", "sorun 2"],
      "onerilenDegisiklikler": "somut düzeltme önerisi",
      "puan": 0-100
    }
  ],
  "oncelikliDuzeltmeler": ["1. öncelik", "2. öncelik"]
}`;

  // Streaming yanıt
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const akis = await anthropic.messages.stream({
        model: MODEL,
        max_tokens: 4000,
        system: [
          {
            type: "text",
            text: sistemMesaji,
            cache_control: { type: "ephemeral" } as { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `Aşağıdaki proje raporunu değerlendirin ve belirtilen JSON formatında öneriler sunun:\n\n${raporMetni}`,
          },
        ],
      });

      for await (const parca of akis) {
        if (parca.type === "content_block_delta" && parca.delta.type === "text_delta") {
          await writer.write(encoder.encode(parca.delta.text));
        }
      }
    } catch (err) {
      console.error("Proje AI akış hatası:", err);
      await writer.write(encoder.encode(JSON.stringify({ error: "AI analizi başarısız" })));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
