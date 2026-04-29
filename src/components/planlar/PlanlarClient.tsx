"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Crown, Shield, Star, Lock, Zap } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const sss = [
  { soru: "Premium'u iptal edebilir miyim?",     cevap: "Evet, istediğiniz zaman iptal edebilirsiniz. Ödeme dönemi sonuna kadar erişim devam eder."                              },
  { soru: "Ücretsiz plan kalıcı mı?",             cevap: "Evet. Temel filtreleme özelliği süresiz ücretsiz kalacak, herhangi bir kısıtlama uygulanmayacaktır."                  },
  { soru: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", cevap: "Kuveyt Türk Sanal POS üzerinden kredi kartı ve banka kartıyla ödeme yapabilirsiniz."                          },
  { soru: "AI özellikleri ne kadar doğru?",       cevap: "AI analizleri destek mevzuatı ve değerlendirme kriterlerine dayanır; resmi başvuru için güncel mevzuatı kontrol edin." },
  { soru: "Yıllık planı sonradan aylığa çekebilir miyim?", cevap: "Evet, plan değişikliği bir sonraki yenileme döneminde geçerli olur, fark iade edilir."                      },
];

const karsilastirma = [
  { ozellik: "Destek programı sayısı",          ucretsiz: "40+",             premium: "40+" },
  { ozellik: "Kural tabanlı filtreleme",         ucretsiz: true,              premium: true  },
  { ozellik: "Uygunluk skoru & gerekçe",        ucretsiz: true,              premium: true  },
  { ozellik: "Program detay sayfaları",          ucretsiz: true,              premium: true  },
  { ozellik: "Resmi kurum bağlantıları",         ucretsiz: true,              premium: true  },
  { ozellik: "AI sınır programı analizi",        ucretsiz: false,             premium: true  },
  { ozellik: "Proje Yazım Asistanı",             ucretsiz: false,             premium: true  },
  { ozellik: "Bölüm bazlı rapor önerileri",      ucretsiz: false,             premium: true  },
  { ozellik: "Öncelikli destek güncellemeleri",  ucretsiz: false,             premium: true  },
  { ozellik: "E-posta bildirim servisi",         ucretsiz: false,             premium: true  },
];

export function PlanlarClient() {
  const [yillik, setYillik] = useState(false);

  const aylikFiyat  = 299;
  const yillikAylik = Math.round(aylikFiyat * 0.80); // %20 indirim
  const gosterilen  = yillik ? yillikAylik : aylikFiyat;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container py-14 text-center">
          <p className="eyebrow mb-3">Fiyatlandırma</p>
          <h1
            className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.035em" }}
          >
            İhtiyacınıza Uygun Planı Seçin
          </h1>
          <p className="mx-auto max-w-lg text-gray-500 text-[17px] leading-relaxed mb-8">
            Temel filtreleme tamamen ücretsiz. AI özellikleri için premium&apos;a geçin.
          </p>

          {/* Aylık / Yıllık toggle */}
          <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setYillik(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${!yillik ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setYillik(true)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${yillik ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Yıllık
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white leading-none">%20 İndirim</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan kartları */}
      <div className="container py-10">
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

          {/* Ücretsiz */}
          <ScrollReveal delay={0}>
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 hover:border-gray-300 hover:shadow-md transition-all duration-200 h-full" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="mb-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Shield size={16} className="text-gray-600" />
                </div>
                <p className="text-[13px] font-medium text-gray-500 mb-0.5">Ücretsiz</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>₺0</span>
                  <span className="text-sm text-gray-400">/ay</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Temel filtreleme için yeterli</p>
              </div>

              <ul className="mb-7 space-y-2.5 flex-1">
                {["40+ destek programı", "Kural tabanlı filtreleme", "Uygunluk skoru & gerekçe", "Program detay sayfaları", "Resmi kurum bağlantıları"].map(oz => (
                  <li key={oz} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" /> {oz}
                  </li>
                ))}
                {["AI sınır analizi", "Proje Yazım Asistanı"].map(oz => (
                  <li key={oz} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="w-3.5 text-center text-xs font-bold">—</span> {oz}
                  </li>
                ))}
              </ul>

              <Link href="/firma" className="block w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                Ücretsiz Başla
              </Link>
            </div>
          </ScrollReveal>

          {/* Premium */}
          <ScrollReveal delay={100}>
            <div
              className="relative flex flex-col rounded-2xl bg-gray-900 p-7 h-full"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -8px rgba(0,0,0,0.3)" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3.5 py-1 text-[11px] font-bold text-white shadow">
                  <Star size={9} className="fill-current" /> Önerilen
                </span>
              </div>

              <div className="mb-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Crown size={16} className="text-white" />
                </div>
                <p className="text-[13px] font-medium text-gray-400 mb-0.5">Premium</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight transition-all duration-300" style={{ fontFamily: "var(--font-heading)" }}>₺{gosterilen}</span>
                  <span className="text-sm text-gray-500">/ay</span>
                </div>
                {yillik && (
                  <p className="mt-1.5 text-xs text-green-400 font-medium">
                    Yıllık ₺{yillikAylik * 12} · Aylık yerine ₺{(aylikFiyat - yillikAylik) * 12} tasarruf
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-400">AI destekli tam analiz</p>
              </div>

              <ul className="mb-7 space-y-2.5 flex-1">
                {["Tüm ücretsiz özellikler", "AI sınır programı analizi", "Proje Yazım Asistanı", "Bölüm bazlı rapor önerileri", "Öncelikli destek güncellemeleri", "E-posta bildirim servisi"].map(oz => (
                  <li key={oz} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 size={14} className="text-blue-400 shrink-0" /> {oz}
                  </li>
                ))}
              </ul>

              <Link
                href="/odeme"
                className="block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                style={{ boxShadow: "var(--shadow-blue)" }}
              >
                {yillik ? "Yıllık Planı Başlat" : "Premium'a Başla"}
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Güven notu */}
        <p className="mt-6 text-center text-[13px] text-gray-400 flex items-center justify-center gap-2">
          <Lock size={12} className="text-gray-300" />
          İstediğiniz zaman iptal · Güvenli ödeme
        </p>
      </div>

      {/* Karşılaştırma tablosu */}
      <div className="container pb-12">
        <ScrollReveal>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-bold text-gray-700">
              <span>Özellik</span>
              <span className="text-center text-gray-500 font-semibold">Ücretsiz</span>
              <span className="text-center text-blue-600">Premium</span>
            </div>
            {karsilastirma.map((satir, i) => (
              <div
                key={satir.ozellik}
                className={`grid grid-cols-3 px-6 py-3.5 text-sm border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
              >
                <span className="text-gray-700">{satir.ozellik}</span>
                <span className="text-center">
                  {satir.ucretsiz === true  && <CheckCircle2 size={15} className="inline text-green-500" />}
                  {satir.ucretsiz === false && <span className="text-gray-300 font-bold text-xs">—</span>}
                  {typeof satir.ucretsiz === "string" && <span className="text-gray-600 font-medium text-xs">{satir.ucretsiz}</span>}
                </span>
                <span className="text-center">
                  {satir.premium === true  && <CheckCircle2 size={15} className="inline text-blue-500" />}
                  {satir.premium === false && <span className="text-gray-300 font-bold text-xs">—</span>}
                  {typeof satir.premium === "string" && <span className="text-blue-600 font-medium text-xs">{satir.premium}</span>}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* SSS */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-14 max-w-2xl">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-3">
              {sss.map((item) => (
                <div key={item.soru} className="rounded-xl border border-gray-200 bg-white px-6 py-5 hover:border-gray-300 transition-colors" style={{ boxShadow: "var(--shadow-xs)" }}>
                  <p className="font-semibold text-gray-900 mb-2 text-sm">{item.soru}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.cevap}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-14 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-5">
              <Zap size={13} /> Hemen başlayın, kayıt gerekmez
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>
              Firmana Uygun Destekleri Keşfet
            </h2>
            <Link
              href="/firma"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              Ücretsiz Başla
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
