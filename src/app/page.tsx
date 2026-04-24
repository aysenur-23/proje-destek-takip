import Link from "next/link";
import {
  ArrowRight,
  Search,
  Building2,
  Brain,
  TrendingUp,
  Shield,
  CheckCircle2,
  Crown,
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";

const ozellikler = [
  {
    ikon: Building2,
    baslik: "Firmana Özel Filtreleme",
    aciklama:
      "Şirket türü, sektör, çalışan sayısı, ciro ve daha onlarca kriter kombinasyonuyla sadece uygun destekleri gör.",
    renk: "blue",
  },
  {
    ikon: Search,
    baslik: "40+ Destek Programı",
    aciklama:
      "TÜBİTAK, KOSGEB, TKDK, SGK, Teknokent, AB Fonları, Kalkınma Ajansları ve Bakanlık programları tek ekranda.",
    renk: "emerald",
  },
  {
    ikon: Brain,
    baslik: "AI Destekli Analiz",
    aciklama:
      "Kural tabanlı filtrenin sınırda bıraktığı destekleri yapay zeka analiz eder, özel durumlar için somut adımlar sunar.",
    renk: "violet",
    premium: true,
  },
  {
    ikon: TrendingUp,
    baslik: "Proje Yazım Asistanı",
    aciklama:
      "Mevcut proje raporunu yükle; AI başvurulan desteğin mevzuatına ve değerlendirme kriterlerine göre bölüm bölüm geliştirir.",
    renk: "violet",
    premium: true,
  },
];

const kurumlar = [
  "TÜBİTAK",
  "KOSGEB",
  "TKDK",
  "SGK",
  "Teknokent",
  "AB Fonları",
  "Kalkınma Ajansları",
  "Ticaret Bakanlığı",
  "Sanayi Bakanlığı",
  "Tarım Bakanlığı",
];

const nasılCalisir = [
  {
    adim: "01",
    baslik: "Firma Profilini Oluştur",
    aciklama:
      "Şirket türü, sektör, çalışan sayısı, ciro ve bulunduğunuz bölge gibi temel bilgileri girin.",
  },
  {
    adim: "02",
    baslik: "Uygun Destekleri Gör",
    aciklama:
      "Sistem 40+ programı anında filtreler; uygun, kısmen uygun ve uygun olmayanları açıkçasıyla listeler.",
  },
  {
    adim: "03",
    baslik: "AI ile Derinlemesine Analiz",
    aciklama:
      "Sınırda kalan programlar için yapay zeka analizi isteyin, proje asistanıyla başvurunuzu güçlendirin.",
  },
];

const planlar = [
  {
    ad: "Ücretsiz",
    fiyat: "₺0",
    periyot: "her zaman",
    ozellikler: [
      "Tüm destek programlarını görüntüle",
      "Kural tabanlı anlık filtreleme",
      "Program detay sayfaları",
      "Kurum bağlantıları",
    ],
    cta: "Hemen Başla",
    href: "/firma",
    vurgu: false,
  },
  {
    ad: "Premium",
    fiyat: "₺299",
    periyot: "/ ay",
    ozellikler: [
      "Tüm ücretsiz özellikler",
      "AI destekli sınır analizi",
      "Proje Yazım Asistanı",
      "Bölüm bazlı rapor iyileştirme",
      "Öncelikli güncelleme bildirimleri",
    ],
    cta: "Premium'a Geç",
    href: "/planlar",
    vurgu: true,
  },
];

const renkHaritasi: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-600",
};

export default function AnaSayfa() {
  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="container relative py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8">
              <Zap size={13} className="text-blue-400" />
              <span>TÜBİTAK · KOSGEB · TKDK · AB Fonları · SGK · Teknokent</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Firmanıza Uygun{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Hibe ve Teşvikleri
              </span>{" "}
              Dakikalar İçinde Keşfedin
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Şirket bilgilerinizi girin, 40&apos;tan fazla destek programı arasından
              uygun olanları anında filtreleyin. Yapay zeka desteğiyle proje
              başvurularınızı güçlendirin.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/firma" className="btn-lg btn-primary">
                Firmamı Tanımla
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/destekler"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/20"
              >
                Desteklere Göz At
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Kayıt gerekmez
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Anlık sonuç
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Temel kullanım ücretsiz
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── İSTATİSTİKLER ─── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200">
            {[
              { sayi: "40+", label: "Destek Programı" },
              { sayi: "10", label: "Kurum & Bakanlık" },
              { sayi: "AI", label: "Destekli Analiz" },
              { sayi: "%100", label: "Ücretsiz Temel Kullanım" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-4 text-center first:pl-0 last:pr-0">
                <div className="text-3xl font-bold text-slate-900 mb-0.5">{s.sayi}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KURUMLAR ─── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Kapsanan kurumlar ve programlar
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {kurumlar.map((k) => (
              <span
                key={k}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NASIL ÇALIŞIR ─── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Nasıl Çalışır?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              3 Adımda Başlayın
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Karmaşık mevzuatı okumaya gerek yok. Sisteminiz otomatik eşleştirir.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {nasılCalisir.map((adim) => (
              <div key={adim.adim} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl font-bold shadow-lg shadow-blue-600/20 mb-6">
                  {adim.adim}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {adim.baslik}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖZELLİKLER ─── */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Özellikler
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Neden Destek Takip?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Onlarca programı tek tek incelemeye gerek yok. Firmanıza uygun
              olanları saniyeler içinde bulun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ozellikler.map((o) => (
              <div key={o.baslik} className="card-hover p-6 relative">
                {o.premium && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    <Crown size={9} />
                    Premium
                  </div>
                )}
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${renkHaritasi[o.renk]}`}
                >
                  <o.ikon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{o.baslik}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANLAR ─── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Fiyatlandırma
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Basit, Şeffaf Fiyatlandırma
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Temel filtreleme tamamen ücretsiz. AI özelliklerine ihtiyaç duyduğunuzda
              premium&apos;a geçin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {planlar.map((plan) => (
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
                      <Star size={10} className="fill-current" />
                      Önerilen
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-lg font-bold mb-1 ${plan.vurgu ? "text-white" : "text-slate-900"}`}
                  >
                    {plan.ad}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${plan.vurgu ? "text-white" : "text-slate-900"}`}
                    >
                      {plan.fiyat}
                    </span>
                    <span
                      className={`text-sm ${plan.vurgu ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {plan.periyot}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.ozellikler.map((oz) => (
                    <li key={oz} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 shrink-0 ${plan.vurgu ? "text-violet-400" : "text-emerald-500"}`}
                      />
                      <span className={plan.vurgu ? "text-slate-300" : "text-slate-600"}>
                        {oz}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.vurgu
                      ? "bg-violet-600 text-white shadow shadow-violet-600/30 hover:bg-violet-500"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="section bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-4 py-1.5 text-sm font-medium">
            <Shield size={14} />
            Ücretsiz • Kayıt Gerekmez
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Başlamak Sadece 2 Dakika Alır
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-blue-100">
            Firma bilgilerinizi girin, sistem uygun destekleri otomatik filtrelesin.
          </p>
          <Link
            href="/firma"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition-colors hover:bg-blue-50"
          >
            Hemen Başla
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
