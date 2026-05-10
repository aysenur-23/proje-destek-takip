"use client";

import Link from "next/link";
import { CheckCircle2, Crown, Zap, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const karsilastirma = [
  { ozellik: "Destek program sayısı",      ucretsiz: "40+",  premium: "40+" },
  { ozellik: "Kural tabanlı filtreleme",    ucretsiz: true,   premium: true },
  { ozellik: "Uygunluk skoru & gerekçe",   ucretsiz: true,   premium: true },
  { ozellik: "Program detay sayfaları",     ucretsiz: true,   premium: true },
  { ozellik: "Resmi kurum bağlantıları",    ucretsiz: true,   premium: true },
  { ozellik: "AI sınır programı analizi",   ucretsiz: false,  premium: true },
  { ozellik: "Proje Yazım Asistanı",        ucretsiz: false,  premium: true },
  { ozellik: "Bölüm bazlı rapor önerileri", ucretsiz: false, premium: true },
  { ozellik: "Öncelikli güncellemeler",     ucretsiz: false,  premium: true },
];

const sss = [
  {
    soru: "Premium'u iptal edebilir miyim?",
    cevap: "Evet, istediğiniz zaman iptal edebilirsiniz. Ödeme dönemi sonuna kadar erişim devam eder, ek ücret alınmaz.",
  },
  {
    soru: "Ücretsiz plan kalıcı mı?",
    cevap: "Evet. Temel filtreleme özelliği her zaman ücretsiz kalacak, süre kısıtı yoktur.",
  },
  {
    soru: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    cevap: "Kuveyt Türk Sanal POS üzerinden kredi kartı ve banka kartı ile 3D Secure güvencesiyle ödeme yapabilirsiniz.",
  },
  {
    soru: "AI özellikleri ne kadar doğru?",
    cevap: "AI analizleri destek mevzuatına ve değerlendirme kriterlerine dayalı önerir; resmi başvuru için kurumun güncel mevzuatını kontrol edin.",
  },
  {
    soru: "Firma bilgilerimi paylaşmak zorunda mıyım?",
    cevap: "Hayır. Firma bilgileri yalnızca tarayıcınızda saklanır, sunucuya iletilmez. Hesap açmadan da kullanabilirsiniz.",
  },
];

export default function PlanlarSayfasi() {
  const [yillik, setYillik] = useState(false);

  const aylikFiyat = 299;
  const yillikFiyat = Math.round(aylikFiyat * 12 * 0.8);
  const tasarruf = Math.round(aylikFiyat * 12 - yillikFiyat);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-14 text-center">
          <ScrollReveal direction="up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Zap size={13} />
              Basit, şeffaf fiyatlandırma
            </div>
            <h1 className="heading-xl mb-4">İhtiyacınıza Uygun Planı Seçin</h1>
            <p className="mx-auto max-w-lg text-lg text-slate-500 leading-relaxed">
              Temel filtreleme tamamen ücretsiz. AI özelliklerine ihtiyaç duyduğunuzda
              aylık ₺{aylikFiyat} ile premium&apos;a geçin.
            </p>

            {/* Yıllık / Aylık toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 shadow-[var(--shadow-sm)]">
              <button
                onClick={() => setYillik(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  !yillik ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Aylık
              </button>
              <button
                onClick={() => setYillik(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  yillik ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Yıllık
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  %20 indirim
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Plan kartları */}
      <div className="container py-10">
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2 items-start">
          {/* Ücretsiz */}
          <ScrollReveal direction="up" delay={0}>
            <div className="card p-7 flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 mb-4">
                <Shield size={18} className="text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Ücretsiz</h2>
              <p className="text-sm text-slate-500 mb-4">Temel filtreleme için yeterli</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">₺0</span>
                <span className="text-sm text-slate-400">/ her zaman</span>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  "40+ destek programı",
                  "Kural tabanlı anlık filtreleme",
                  "Uygunluk skoru ve gerekçeleri",
                  "Program detay sayfaları",
                  "Resmi kurum bağlantıları",
                ].map((oz) => (
                  <li key={oz} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span className="text-slate-600">{oz}</span>
                  </li>
                ))}
                {["AI sınır analizi", "Proje Yazım Asistanı"].map((oz) => (
                  <li key={oz} className="flex items-start gap-2 text-sm opacity-40">
                    <span className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center">
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                    </span>
                    <span className="text-slate-400">{oz}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/firma"
                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </ScrollReveal>

          {/* Premium */}
          <ScrollReveal direction="up" delay={100}>
            <div className="relative rounded-2xl p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ring-2 ring-violet-500/80 shadow-2xl shadow-slate-900/30 flex flex-col scale-[1.03] premium-glow">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-1 text-xs font-semibold text-white shadow-md shadow-violet-600/30">
                  <Crown size={10} className="fill-current" />
                  Önerilen
                </span>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 mb-4">
                <Crown size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Premium</h2>
              <p className="text-sm text-slate-400 mb-4">AI destekli tam analiz</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white tracking-tight transition-all duration-300">
                  ₺{yillik ? Math.round(yillikFiyat / 12) : aylikFiyat}
                </span>
                <span className="text-sm text-slate-400">/ ay</span>
              </div>
              {yillik && (
                <p className="mb-4 text-[11px] text-emerald-400 font-semibold animate-fade-in">
                  ₺{yillikFiyat} / yıl · Yıllık ₺{tasarruf} tasarruf
                </p>
              )}
              {!yillik && <div className="mb-4" />}

              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  "Tüm ücretsiz özellikler",
                  "AI sınır programı analizi",
                  "Proje Yazım Asistanı (Modül 1)",
                  "Bölüm bazlı rapor önerileri",
                  "Öncelikli destek güncellemeleri",
                  "E-posta bildirim servisi",
                ].map((oz) => (
                  <li key={oz} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-violet-400" />
                    <span className="text-slate-300">{oz}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/odeme"
                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all"
              >
                Premium&apos;a Geç
              </Link>

              <p className="mt-2.5 text-center text-[10px] text-slate-500">
                İstediğiniz zaman iptal edin · 3D Secure ödeme
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Karşılaştırma tablosu */}
      <div className="container pb-10">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal direction="up">
            <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Özellik Karşılaştırması</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      Özellik
                    </th>
                    <th className="px-5 py-3 text-center font-semibold text-slate-600 text-xs uppercase tracking-wide w-24">
                      Ücretsiz
                    </th>
                    <th className="px-5 py-3 text-center font-semibold text-violet-600 text-xs uppercase tracking-wide w-24">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {karsilastirma.map((row, i) => (
                    <tr
                      key={row.ozellik}
                      className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}
                    >
                      <td className="px-5 py-3 text-slate-700">{row.ozellik}</td>
                      <td className="px-5 py-3 text-center">
                        {typeof row.ucretsiz === "boolean" ? (
                          row.ucretsiz ? (
                            <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-slate-600">{row.ucretsiz}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {typeof row.premium === "boolean" ? (
                          row.premium ? (
                            <CheckCircle2 size={16} className="text-violet-500 mx-auto" />
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-violet-600">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* SSS */}
      <div className="border-t border-slate-200 bg-white">
        <div className="container py-14 max-w-2xl">
          <ScrollReveal direction="up">
            <h2 className="mb-8 text-center heading-md">Sık Sorulan Sorular</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {sss.map((item, i) => (
              <ScrollReveal key={item.soru} delay={i * 60} direction="up">
                <details className="card group overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-slate-900 hover:bg-slate-50 transition-colors list-none">
                    <span className="text-sm">{item.soru}</span>
                    <ChevronDown
                      size={16}
                      className="text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3">
                    <p className="text-sm text-slate-500 leading-relaxed">{item.cevap}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
