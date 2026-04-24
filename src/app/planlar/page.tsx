import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Crown, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Planlar & Fiyatlandırma — Destek Takip",
  description: "Ücretsiz filtreleme veya AI destekli Premium analiz. İhtiyacınıza göre seçin.",
};

const planlar = [
  {
    ad: "Ücretsiz",
    fiyat: "₺0",
    periyot: "her zaman",
    aciklama: "Temel filtreleme için yeterli",
    ozellikler: [
      "40+ destek programı",
      "Kural tabanlı anlık filtreleme",
      "Uygunluk skoru ve gerekçeleri",
      "Program detay sayfaları",
      "Resmi kurum bağlantıları",
    ],
    olmayan: ["AI sınır analizi", "Proje Yazım Asistanı"],
    cta: "Ücretsiz Başla",
    href: "/firma",
    vurgu: false,
    ikon: Shield,
  },
  {
    ad: "Premium",
    fiyat: "₺299",
    periyot: "/ ay",
    aciklama: "AI destekli tam analiz",
    ozellikler: [
      "Tüm ücretsiz özellikler",
      "AI sınır programı analizi",
      "Proje Yazım Asistanı (Modül 1)",
      "Bölüm bazlı rapor önerileri",
      "Öncelikli destek güncellemeleri",
      "E-posta bildirim servisi",
    ],
    olmayan: [],
    cta: "Premium'a Geç",
    href: "/odeme",
    vurgu: true,
    ikon: Crown,
  },
];

const sss = [
  {
    soru: "Premium'u iptal edebilir miyim?",
    cevap: "Evet, istediğiniz zaman iptal edebilirsiniz. Ödeme dönemi sonuna kadar erişim devam eder.",
  },
  {
    soru: "Ücretsiz plan kalıcı mı?",
    cevap: "Evet. Temel filtreleme özelliği her zaman ücretsiz kalacak, süre kısıtı yoktur.",
  },
  {
    soru: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    cevap: "Kuveyt Türk Sanal POS üzerinden kredi kartı ve banka kartı ile ödeme yapabilirsiniz.",
  },
  {
    soru: "AI özellikleri ne kadar doğru?",
    cevap: "AI analizleri destek mevzuatına ve değerlendirme kriterlerine dayalı önerir; resmi başvuru için kurumun güncel mevzuatını kontrol edin.",
  },
];

export default function PlanlarSayfasi() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="container py-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
          <Zap size={13} />
          Basit, şeffaf fiyatlandırma
        </div>
        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          İhtiyacınıza Uygun Planı Seçin
        </h1>
        <p className="mx-auto max-w-xl text-lg text-slate-500">
          Temel filtreleme tamamen ücretsiz. AI özelliklerine ihtiyaç duyduğunuzda
          aylık ₺299 ile premium'a geçin.
        </p>
      </div>

      {/* Planlar */}
      <div className="container pb-16">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {planlar.map((plan) => {
            const Ikon = plan.ikon;
            return (
              <div
                key={plan.ad}
                className={`relative rounded-2xl p-8 ${
                  plan.vurgu
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white ring-2 ring-violet-500 shadow-xl shadow-slate-900/20"
                    : "card"
                }`}
              >
                {plan.vurgu && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white shadow">
                      <Crown size={10} className="fill-current" />
                      Önerilen
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${plan.vurgu ? "bg-violet-600" : "bg-slate-100"}`}>
                    <Ikon size={18} className={plan.vurgu ? "text-white" : "text-slate-600"} />
                  </div>
                  <h2 className={`text-xl font-bold ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                    {plan.ad}
                  </h2>
                  <p className={`mt-0.5 text-sm ${plan.vurgu ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.aciklama}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                      {plan.fiyat}
                    </span>
                    <span className={`text-sm ${plan.vurgu ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.periyot}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-2.5">
                  {plan.ozellikler.map((oz) => (
                    <li key={oz} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.vurgu ? "text-violet-400" : "text-emerald-500"}`}
                      />
                      <span className={plan.vurgu ? "text-slate-300" : "text-slate-600"}>{oz}</span>
                    </li>
                  ))}
                  {plan.olmayan.map((oz) => (
                    <li key={oz} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="mt-0.5 shrink-0 text-slate-400">✕</span>
                      <span className={plan.vurgu ? "text-slate-400" : "text-slate-400"}>{oz}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                    plan.vurgu
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow shadow-violet-600/30"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* SSS */}
      <div className="border-t border-slate-200 bg-white">
        <div className="container py-16 max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {sss.map((item) => (
              <div key={item.soru} className="card p-5">
                <h3 className="mb-2 font-semibold text-slate-900">{item.soru}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.cevap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
