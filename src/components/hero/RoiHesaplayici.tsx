"use client";

import { useState } from "react";
import { TrendingUp, Building2, Users, Layers } from "lucide-react";

/* ── Veri ──────────────────────────────────────────────────────── */
const SEKTORLER = [
  { deger: "yazilim",     ad: "Yazılım & Teknoloji" },
  { deger: "uretim",      ad: "Üretim & İmalat"      },
  { deger: "tarim",       ad: "Tarım & Gıda"          },
  { deger: "tekstil",     ad: "Tekstil & Hazır Giyim" },
  { deger: "hizmet",      ad: "Profesyonel Hizmetler" },
  { deger: "saglik",      ad: "Sağlık & Biyoteknoloji"},
  { deger: "enerji",      ad: "Enerji & Çevre"        },
  { deger: "turizm",      ad: "Turizm & Konaklama"    },
] as const;

const CALISANLAR = [
  { deger: "1-10",   ad: "1 – 10 kişi",    n: 5   },
  { deger: "11-50",  ad: "11 – 50 kişi",   n: 30  },
  { deger: "51-250", ad: "51 – 250 kişi",  n: 150 },
  { deger: "250+",   ad: "250+ kişi",      n: 300 },
] as const;

type Sektor   = typeof SEKTORLER[number]["deger"];
type Calisan  = typeof CALISANLAR[number]["deger"];

/* ── Hesaplama motoru ──────────────────────────────────────────── */
interface Tahmın {
  programSayisi: number;
  hibePotansiyeliMin: number; // TL (milyon)
  hibePotansiyeliMax: number;
  vurgulananProgram: string;
}

function hesapla(sektor: Sektor, calisan: Calisan): Tahmın {
  const cSmall  = calisan === "1-10";
  const cMid    = calisan === "11-50";
  const cLarge  = calisan === "51-250" || calisan === "250+";

  /* Her kombinasyon için yaklaşık değerler */
  const tabloCalisanCoefficient = cSmall ? 1.0 : cMid ? 1.3 : 1.5;

  let programSayisi: number;
  let hibeMin: number;
  let hibeMax: number;
  let vurgulananProgram: string;

  switch (sektor) {
    case "yazilim":
      programSayisi = Math.round(18 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.5 : cMid ? 2  : 5;
      hibeMax = cSmall ? 3   : cMid ? 8  : 20;
      vurgulananProgram = "TÜBİTAK 1507 + KOSGEB Dijital Dönüşüm";
      break;
    case "uretim":
      programSayisi = Math.round(22 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.3 : cMid ? 1.5 : 4;
      hibeMax = cSmall ? 2   : cMid ? 7   : 18;
      vurgulananProgram = "KOSGEB TEP + Sanayi Bakanlığı TOSH";
      break;
    case "tarim":
      programSayisi = Math.round(14 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.2 : cMid ? 0.8 : 2;
      hibeMax = cSmall ? 1.5 : cMid ? 5   : 12;
      vurgulananProgram = "TKDK IPARD III + Tarım Bakanlığı";
      break;
    case "tekstil":
      programSayisi = Math.round(12 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.2 : cMid ? 1   : 3;
      hibeMax = cSmall ? 1.5 : cMid ? 5   : 14;
      vurgulananProgram = "KOSGEB + TURQUALITY";
      break;
    case "hizmet":
      programSayisi = Math.round(10 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.1 : cMid ? 0.5 : 1.5;
      hibeMax = cSmall ? 1   : cMid ? 3   : 8;
      vurgulananProgram = "KOSGEB Nitelikli Eleman + İhracat Desteği";
      break;
    case "saglik":
      programSayisi = Math.round(16 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.5 : cMid ? 2   : 6;
      hibeMax = cSmall ? 3   : cMid ? 9   : 22;
      vurgulananProgram = "TÜBİTAK 1511 + Horizon Europe";
      break;
    case "enerji":
      programSayisi = Math.round(14 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.4 : cMid ? 1.5 : 4;
      hibeMax = cSmall ? 2.5 : cMid ? 7   : 15;
      vurgulananProgram = "KOSGEB + LIFE Programme";
      break;
    case "turizm":
      programSayisi = Math.round(8 * tabloCalisanCoefficient);
      hibeMin = cSmall ? 0.1 : cMid ? 0.5 : 1.5;
      hibeMax = cSmall ? 1   : cMid ? 4   : 10;
      vurgulananProgram = "TKDK Tedbir 7.4 + Kalkınma Ajansları";
      break;
    default:
      programSayisi = 12;
      hibeMin = 0.5;
      hibeMax = 5;
      vurgulananProgram = "KOSGEB + Kalkınma Ajansları";
  }

  /* SGK ve Teknokent bonusu büyük firmalara */
  if (cLarge) {
    programSayisi = Math.min(programSayisi + 4, 38);
  }

  return {
    programSayisi,
    hibePotansiyeliMin: hibeMin,
    hibePotansiyeliMax: hibeMax,
    vurgulananProgram,
  };
}

/* ── Segment seçici ────────────────────────────────────────────── */
function Segment<T extends string>({
  secenekler,
  secili,
  onChange,
}: {
  secenekler: { deger: T; ad: string }[];
  secili: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {secenekler.map((s) => (
        <button
          key={s.deger}
          onClick={() => onChange(s.deger)}
          className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
            secili === s.deger
              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          {s.ad}
        </button>
      ))}
    </div>
  );
}

/* ── Ana bileşen ───────────────────────────────────────────────── */
export function RoiHesaplayici() {
  const [sektor,  setSektor]  = useState<Sektor>("yazilim");
  const [calisan, setCalisan] = useState<Calisan>("1-10");

  const tahmin = hesapla(sektor, calisan);

  return (
    <section className="border-b border-gray-100 bg-white py-20">
      <div className="container">

        {/* Başlık */}
        <div className="max-w-2xl mb-12">
          <p className="eyebrow mb-3">Potansiyel Etki</p>
          <h2 className="section-title">Firmanız Ne Kadar Hibe Alabilir?</h2>
          <p className="section-desc">
            Sektörünüzü ve çalışan sayınızı seçin — uygun program sayısını ve tahmini hibe potansiyelini görün.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Sol: Giriş ── */}
          <div className="space-y-8">

            {/* Sektör */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
                  <Layers size={14} className="text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Sektör</p>
              </div>
              <Segment secenekler={[...SEKTORLER]} secili={sektor} onChange={setSektor} />
            </div>

            {/* Çalışan */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
                  <Users size={14} className="text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Çalışan Sayısı</p>
              </div>
              <Segment secenekler={[...CALISANLAR]} secili={calisan} onChange={setCalisan} />
            </div>

            {/* Açıklama notu */}
            <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
              * Rakamlar, seçilen profile uygun devlet desteklerinin kümülatif tahminidir. Gerçek tutarlar
              proje içeriği ve başvuru dönemine göre değişir. Kesin değerlendirme için firma profilinizi oluşturun.
            </p>
          </div>

          {/* ── Sağ: Sonuç kartı ── */}
          <div
            className="rounded-2xl border border-gray-200 bg-white p-7 sticky top-24"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            {/* Üst: ikon + başlık */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tahmini Potansiyel</p>
                <p className="text-sm font-bold text-gray-900">
                  {SEKTORLER.find(s => s.deger === sektor)?.ad} · {CALISANLAR.find(c => c.deger === calisan)?.ad}
                </p>
              </div>
            </div>

            {/* Ana metrikler */}
            <div className="space-y-4 mb-6">
              {/* Uygun program sayısı */}
              <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
                <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Uygun Program</p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-[2.5rem] font-bold leading-none text-blue-700 transition-all duration-500"
                    style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.04em" }}
                  >
                    {tahmin.programSayisi}
                  </span>
                  <span className="text-sm text-blue-500 font-medium">program</span>
                </div>
              </div>

              {/* Hibe potansiyeli */}
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-5 py-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Toplam Hibe Potansiyeli</p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-[2.5rem] font-bold leading-none text-gray-900 transition-all duration-500"
                    style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.04em" }}
                  >
                    ₺{tahmin.hibePotansiyeliMin}M – ₺{tahmin.hibePotansiyeliMax}M
                  </span>
                </div>
              </div>
            </div>

            {/* Öne çıkan programlar */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Öne Çıkan Programlar</p>
              <div className="flex items-start gap-2">
                <Building2 size={13} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 font-medium leading-snug">{tahmin.vurgulananProgram}</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/firma"
              className="block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              Ücretsiz Analiz Başlat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
