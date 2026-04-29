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
  Clock,
  BarChart3,
  Sparkles,
} from "lucide-react";

const ozellikler = [
  {
    ikon: Building2,
    baslik: "Firmana Özel Filtreleme",
    aciklama:
      "Şirket türü, sektör, çalışan sayısı, ciro ve onlarca kriter kombinasyonuyla sadece uygun destekleri gör.",
    renk: "blue",
    detay: "40+ parametre",
  },
  {
    ikon: Search,
    baslik: "40+ Destek Programı",
    aciklama:
      "TÜBİTAK, KOSGEB, TKDK, SGK, Teknokent, AB Fonları, Kalkınma Ajansları ve Bakanlık programları tek ekranda.",
    renk: "emerald",
    detay: "10 kurum",
  },
  {
    ikon: Brain,
    baslik: "AI Destekli Analiz",
    aciklama:
      "Kural tabanlı filtrenin sınırda bıraktığı destekleri yapay zeka analiz eder; özel durumlar için somut adımlar sunar.",
    renk: "violet",
    premium: true,
    detay: "Claude AI",
  },
  {
    ikon: TrendingUp,
    baslik: "Proje Yazım Asistanı",
    aciklama:
      "Mevcut proje raporunu yükle; AI başvurulan desteğin mevzuatına ve değerlendirme kriterlerine göre bölüm bölüm geliştirir.",
    renk: "violet",
    premium: true,
    detay: "Modül 1",
  },
];

const kurumlar = [
  { ad: "TÜBİTAK", renk: "blue" },
  { ad: "KOSGEB", renk: "emerald" },
  { ad: "TKDK", renk: "orange" },
  { ad: "SGK", renk: "slate" },
  { ad: "Teknokent", renk: "indigo" },
  { ad: "AB Fonları", renk: "blue" },
  { ad: "Kalkınma Ajansları", renk: "teal" },
  { ad: "Ticaret Bakanlığı", renk: "slate" },
  { ad: "Sanayi Bakanlığı", renk: "slate" },
  { ad: "Tarım Bakanlığı", renk: "green" },
];

const nasılCalisir = [
  {
    adim: "01",
    baslik: "Firma Profilini Oluştur",
    aciklama:
      "Şirket türü, sektör, çalışan sayısı, ciro ve bulunduğunuz bölge gibi temel bilgileri girin. 2 dakika yeter.",
    sure: "~2 dk",
    ikon: Building2,
  },
  {
    adim: "02",
    baslik: "Uygun Destekleri Gör",
    aciklama:
      "Sistem 40+ programı anında filtreler; uygun, kısmen uygun ve uygun olmayanları açıkçasıyla listeler.",
    sure: "Anlık",
    ikon: BarChart3,
  },
  {
    adim: "03",
    baslik: "AI ile Derinlemesine Analiz",
    aciklama:
      "Sınırda kalan programlar için yapay zeka analizi isteyin, proje asistanıyla başvurunuzu güçlendirin.",
    sure: "Premium",
    ikon: Sparkles,
  },
];

const planlar = [
  {
    ad: "Ücretsiz",
    fiyat: "₺0",
    periyot: "her zaman",
    aciklama: "Temel filtreleme için yeterli",
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
    aciklama: "AI destekli tam analiz",
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

const istatistikler = [
  { sayi: "40+", label: "Destek Programı", alt: "sürekli güncelleniyor" },
  { sayi: "10", label: "Kurum & Bakanlık", alt: "tam kapsam" },
  { sayi: "AI", label: "Destekli Analiz", alt: "Claude ile" },
  { sayi: "%100", label: "Ücretsiz Temel", alt: "kayıt gerekmez" },
];

const renkHaritasi: Record<string, { kart: string; ikon: string; badge: string }> = {
  blue: {
    kart: "hover:border-blue-200 hover:shadow-blue-900/5",
    ikon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
  },
  emerald: {
    kart: "hover:border-emerald-200 hover:shadow-emerald-900/5",
    ikon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  violet: {
    kart: "hover:border-violet-200 hover:shadow-violet-900/5",
    ikon: "bg-violet-100 text-violet-600",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
  },
};

export default function AnaSayfa() {
  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        {/* Dekoratif arka plan */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-800/10 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #60a5fa 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container relative py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8 backdrop-blur-sm">
              <Zap size={12} className="text-blue-400" />
              <span>TÜBİTAK · KOSGEB · TKDK · AB Fonları · SGK · Teknokent</span>
            </div>

            <h1 className="animate-slide-up delay-75 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6 text-balance">
              Firmanıza Uygun{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                Hibe ve Teşvikleri
              </span>{" "}
              Dakikalar İçinde Keşfedin
            </h1>

            <p className="animate-slide-up delay-150 text-lg sm:text-xl text-slate-300/90 mb-10 leading-relaxed max-w-2xl">
              Şirket bilgilerinizi girin, 40&apos;tan fazla destek programı arasından
              uygun olanları anında filtreleyin. Yapay zeka desteğiyle proje
              başvurularınızı güçlendirin.
            </p>

            <div className="animate-slide-up delay-200 flex flex-wrap gap-3">
              <Link href="/firma" className="btn-lg btn-primary gap-2 shadow-lg shadow-blue-500/25">
                Firmamı Tanımla
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/destekler"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-base font-semibold text-white/90 transition-all hover:bg-white/15 hover:border-white/25 backdrop-blur-sm"
              >
                Desteklere Göz At
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="animate-slide-up delay-300 mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              {[
                { ikon: CheckCircle2, metin: "Kayıt gerekmez" },
                { ikon: Clock, metin: "2 dakikada sonuç" },
                { ikon: Shield, metin: "Temel kullanım ücretsiz" },
              ].map(({ ikon: Ikon, metin }) => (
                <div key={metin} className="flex items-center gap-1.5">
                  <Ikon size={14} className="text-emerald-400 shrink-0" />
                  <span>{metin}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── İSTATİSTİKLER ─── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100">
            {istatistikler.map((s, i) => (
              <div
                key={s.label}
                className="px-6 py-8 text-center group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-0.5 tabular-nums">
                  {s.sayi}
                </div>
                <div className="text-sm font-medium text-slate-700 mb-0.5">{s.label}</div>
                <div className="text-xs text-slate-400">{s.alt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KURUMLAR ─── */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="container py-7">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-5">
            Kapsanan kurumlar ve programlar
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {kurumlar.map((k) => (
              <span
                key={k.ad}
                className="rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:border-slate-300 hover:shadow transition-all duration-200"
              >
                {k.ad}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              3 Adımda Başlayın
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Karmaşık mevzuatı okumaya gerek yok — sisteminiz otomatik eşleştirir.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px">
              <div className="h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 opacity-60" />
            </div>

            {nasılCalisir.map((adim, i) => {
              const Ikon = adim.ikon;
              return (
                <div key={adim.adim} className="relative group">
                  <div className="card p-6 text-center transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5">
                    {/* Step circle */}
                    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/25 group-hover:shadow-blue-600/35 transition-shadow">
                        <Ikon size={22} />
                      </div>
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-blue-600 text-[9px] font-bold text-blue-700">
                        {i + 1}
                      </div>
                    </div>

                    <div className="mb-1.5 flex items-center justify-center gap-1.5">
                      <h3 className="text-base font-semibold text-slate-900">{adim.baslik}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-3">{adim.aciklama}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      <Clock size={10} />
                      {adim.sure}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/firma" className="btn-md btn-primary gap-2 inline-flex">
              Hemen Dene
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ÖZELLİKLER ─── */}
      <section className="section bg-slate-50/70">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Özellikler
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Neden Destek Takip?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Onlarca programı tek tek incelemeye gerek yok — firmanıza uygun
              olanları saniyeler içinde bulun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ozellikler.map((o) => {
              const renk = renkHaritasi[o.renk];
              return (
                <div
                  key={o.baslik}
                  className={`group card p-6 relative transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${renk.kart}`}
                >
                  {o.premium && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-violet-100 border border-violet-200 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                      <Crown size={8} />
                      Premium
                    </div>
                  )}

                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${renk.ikon}`}>
                    <o.ikon size={20} />
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{o.baslik}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{o.aciklama}</p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${renk.badge}`}>
                    {o.detay}
                  </span>
                </div>
              );
            })}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Basit, Şeffaf Fiyatlandırma
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Temel filtreleme tamamen ücretsiz. AI özelliklerine ihtiyaç duyduğunuzda
              premium&apos;a geçin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {planlar.map((plan) => (
              <div
                key={plan.ad}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.vurgu
                    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ring-2 ring-violet-500/80 shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/40"
                    : "card hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {plan.vurgu && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-1 text-xs font-semibold text-white shadow-md shadow-violet-600/30">
                      <Star size={10} className="fill-current" />
                      Önerilen
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                      {plan.ad}
                    </h3>
                    {plan.vurgu && (
                      <Crown size={16} className="text-violet-400 fill-violet-400" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-bold tracking-tight ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                      {plan.fiyat}
                    </span>
                    <span className={`text-sm ${plan.vurgu ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.periyot}
                    </span>
                  </div>
                  <p className={`text-xs ${plan.vurgu ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.aciklama}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.ozellikler.map((oz) => (
                    <li key={oz} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.vurgu ? "text-violet-400" : "text-emerald-500"}`}
                      />
                      <span className={plan.vurgu ? "text-slate-300" : "text-slate-600"}>{oz}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.vurgu
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 hover:shadow-violet-500/40"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            İstediğiniz zaman iptal edebilirsiniz · 3D Secure ödeme
          </p>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative text-center text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Shield size={13} />
            Ücretsiz · Kayıt Gerekmez · Anlık Sonuç
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl tracking-tight">
            Başlamak Sadece 2 Dakika Alır
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-blue-100/90 leading-relaxed">
            Firma bilgilerinizi girin, sistem uygun destekleri otomatik filtrelesin.
          </p>
          <Link
            href="/firma"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-xl shadow-blue-900/25 transition-all hover:bg-blue-50 hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-0.5"
          >
            Hemen Başla
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
