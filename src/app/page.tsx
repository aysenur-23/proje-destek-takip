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
  ArrowUpRight,
  Check,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─── Veriler ─────────────────────────────────────────────────────────────── */

const kurumlar = [
  { ad: "TÜBİTAK",           renk: "blue"    },
  { ad: "KOSGEB",             renk: "emerald" },
  { ad: "TKDK",               renk: "amber"   },
  { ad: "SGK",                renk: "slate"   },
  { ad: "Teknokent",          renk: "violet"  },
  { ad: "AB Fonları",         renk: "blue"    },
  { ad: "Kalkınma Ajansları", renk: "teal"    },
  { ad: "Ticaret Bakanlığı",  renk: "slate"   },
  { ad: "Sanayi Bakanlığı",   renk: "slate"   },
  { ad: "Tarım Bakanlığı",    renk: "emerald" },
];

const kurumRenk: Record<string, string> = {
  blue:    "border-blue-200 text-blue-700   bg-blue-50/80   hover:bg-blue-100",
  emerald: "border-emerald-200 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100",
  amber:   "border-amber-200 text-amber-700  bg-amber-50/80  hover:bg-amber-100",
  violet:  "border-violet-200 text-violet-700 bg-violet-50/80 hover:bg-violet-100",
  slate:   "border-slate-200 text-slate-600  bg-slate-50/80  hover:bg-slate-100",
  teal:    "border-teal-200  text-teal-700   bg-teal-50/80   hover:bg-teal-100",
};

const adimlar = [
  {
    n: "01",
    baslik: "Firma profilini oluştur",
    aciklama: "Şirket türü, sektör, çalışan sayısı, ciro ve konum bilgilerini gir. 2 dakika yeterli.",
    sure: "~2 dk",
    renk: "bg-blue-600",
  },
  {
    n: "02",
    baslik: "Uygun destekleri gör",
    aciklama: "40+ program anlık filtrelenir; uygun, sınırda ve uygun olmayanlar ayrı ayrı gösterilir.",
    sure: "Anlık",
    renk: "bg-blue-600",
  },
  {
    n: "03",
    baslik: "AI ile derinlemesine analiz",
    aciklama: "Sınırda kalan programlar için yapay zeka analizi iste, proje raporunu AI ile güçlendir.",
    sure: "Premium",
    renk: "bg-violet-600",
  },
];

const ozellikler = [
  {
    ikon: Building2,
    baslik: "Firmana Özel Filtreleme",
    aciklama: "Şirket türü, sektör, çalışan sayısı, ciro ve onlarca kriter kombinasyonuyla sadece uygun destekleri gör.",
    detay: "40+ parametre",
    renk: "blue",
    premium: false,
  },
  {
    ikon: Search,
    baslik: "40+ Destek Programı",
    aciklama: "TÜBİTAK, KOSGEB, TKDK, SGK, Teknokent, AB Fonları, Kalkınma Ajansları ve Bakanlık programları tek ekranda.",
    detay: "10 kurum",
    renk: "emerald",
    premium: false,
  },
  {
    ikon: Brain,
    baslik: "AI Destekli Analiz",
    aciklama: "Kural tabanlı filtrenin sınırda bıraktığı destekleri yapay zeka analiz eder; özel durumlar için somut adımlar sunar.",
    detay: "Claude AI",
    renk: "violet",
    premium: true,
  },
  {
    ikon: TrendingUp,
    baslik: "Proje Yazım Asistanı",
    aciklama: "Mevcut proje raporunu yükle; AI başvurulan desteğin değerlendirme kriterlerine göre bölüm bölüm geliştirir.",
    detay: "Modül 1",
    renk: "violet",
    premium: true,
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
      "Resmi kaynak bağlantıları",
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

/* ─── Sayfa ──────────────────────────────────────────────────────────────── */

export default function AnaSayfa() {
  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        {/* Arka plan gradyanları */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
        {/* Izgara dokusu */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="container relative py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Sol: İçerik */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] text-blue-300 backdrop-blur-sm">
                <Zap size={11} className="text-blue-400 shrink-0" />
                <span>TÜBİTAK · KOSGEB · TKDK · AB Fonları · SGK</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight mb-5">
                Firmana uygun{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  hibe ve teşvikleri
                </span>{" "}
                dakikalar içinde keşfet
              </h1>

              <p className="text-[17px] text-white/60 mb-8 leading-relaxed">
                Şirket bilgilerini gir, 40&apos;tan fazla destek programı arasından uygun olanları anında filtrele. Yapay zeka ile başvurunu güçlendir.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/firma" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:-translate-y-0.5">
                  Firmamı Tanımla
                  <ArrowRight size={16} />
                </Link>
                <Link href="/destekler" className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-6 py-3 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                  Desteklere Göz At
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 text-[13px] text-white/40">
                {[
                  { ikon: CheckCircle2, metin: "Kayıt gerekmez" },
                  { ikon: Clock,        metin: "2 dakikada sonuç" },
                  { ikon: Shield,       metin: "Temel kullanım ücretsiz" },
                ].map(({ ikon: Ikon, metin }) => (
                  <div key={metin} className="flex items-center gap-1.5">
                    <Ikon size={13} className="text-emerald-500 shrink-0" />
                    <span>{metin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: Ürün önizleme */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[400px]">
                {/* Arka plan parıltısı */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/10 blur-xl scale-110" />

                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md space-y-2.5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Uygunluk Analizi</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">12 uygun</span>
                  </div>

                  {/* Mini kart 1 */}
                  <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-blue-500/20 border border-blue-400/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">TÜBİTAK</span>
                      <span className="text-[10px] text-white/35">%75 hibe · maks 1.5M TL</span>
                      <span className="ml-auto flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                        <Check size={9} strokeWidth={3} />
                        Uygun
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-white/80 mb-2">1507 KOBİ Ar-Ge Başlangıç</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "85%" }} />
                      </div>
                      <span className="text-[10px] font-semibold text-white/35">85%</span>
                    </div>
                  </div>

                  {/* Mini kart 2 */}
                  <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">KOSGEB</span>
                      <span className="text-[10px] text-white/35">Hibe + Kredi</span>
                      <span className="ml-auto text-[10px] font-semibold text-amber-400">~ Sınırda</span>
                    </div>
                    <p className="text-[12px] font-medium text-white/80 mb-2">Ar-Ge, İnovasyon ve Endüstriyel</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: "58%" }} />
                      </div>
                      <span className="text-[10px] font-semibold text-white/35">58%</span>
                    </div>
                  </div>

                  {/* Mini kart 3 */}
                  <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-violet-500/15 border border-violet-400/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">AB Fonları</span>
                      <span className="text-[10px] text-white/35">%70 hibe</span>
                      <span className="ml-auto flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                        <Check size={9} strokeWidth={3} />
                        Uygun
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-white/80 mb-2">Horizon Europe EIC Accelerator</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "72%" }} />
                      </div>
                      <span className="text-[10px] font-semibold text-white/35">72%</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <span className="text-[10px] text-white/25">47 program tarandı</span>
                    <Link href="/destekler" className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                      Tümünü gör <ArrowUpRight size={9} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          KURUMLAR ŞERIDI
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white">
        <div className="container py-5">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-300 mr-2">Kapsam:</span>
            {kurumlar.map((k) => (
              <span
                key={k.ad}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${kurumRenk[k.renk]}`}
              >
                {k.ad}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NASIL ÇALIŞIR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section bg-slate-50">
        <div className="container">
          <ScrollReveal direction="up" className="text-center mb-16">
            <p className="section-label mb-3">Nasıl Çalışır?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              3 adımda başlayın
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
              Karmaşık mevzuatı okumaya gerek yok — sistem otomatik eşleştirir.
            </p>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Bağlantı çizgisi */}
            <div className="hidden md:block absolute top-5 left-[calc(16.66%)] right-[calc(16.66%)] h-px bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200" style={{top:"20px", left:"calc(33.33% - 20px)", right:"calc(33.33% - 20px)"}} />

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {adimlar.map((adim, i) => (
                <ScrollReveal key={adim.n} delay={i * 100} direction="up">
                  <div className="group flex flex-col items-center text-center md:items-start md:text-left">
                    {/* Numara */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${adim.renk} text-white text-sm font-bold mb-5 shadow-lg ${adim.renk === "bg-violet-600" ? "shadow-violet-500/30" : "shadow-blue-500/30"}`}>
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[15px] font-semibold text-slate-900">{adim.baslik}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-3">{adim.aciklama}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${adim.renk === "bg-violet-600" ? "bg-violet-100 text-violet-700 border border-violet-200" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                      <Clock size={9} />
                      {adim.sure}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/firma" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5 shadow-lg shadow-slate-900/15">
              Hemen Dene
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ÖZELLİKLER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container">
          <ScrollReveal direction="up" className="text-center mb-12">
            <p className="section-label mb-3">Özellikler</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Neden Destek Takip?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Onlarca programı tek tek incelemeye gerek yok — firmanıza uygun olanları saniyeler içinde bulun.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {ozellikler.map((o, i) => {
              const Ikon = o.ikon;
              const borderColor = o.renk === "blue" ? "border-l-blue-500" : o.renk === "emerald" ? "border-l-emerald-500" : "border-l-violet-500";
              const iconBg = o.renk === "blue" ? "bg-blue-50 text-blue-600" : o.renk === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600";
              const badgeCls = o.renk === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : o.renk === "emerald" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-violet-50 text-violet-600 border-violet-100";
              return (
                <ScrollReveal key={o.baslik} delay={i * 70} direction="up">
                  <div className={`group flex gap-4 rounded-2xl border border-slate-200 border-l-4 ${borderColor} bg-white p-5 transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-110`}>
                      <Ikon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-[14px] font-semibold text-slate-900">{o.baslik}</h3>
                        {o.premium && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-100 border border-violet-200 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
                            <Crown size={7} />
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[13px] leading-relaxed mb-2.5">{o.aciklama}</p>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeCls}`}>
                        {o.detay}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PLANLAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section bg-slate-50">
        <div className="container">
          <ScrollReveal direction="up" className="text-center mb-12">
            <p className="section-label mb-3">Fiyatlandırma</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Basit, şeffaf fiyatlandırma
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
              Temel filtreleme tamamen ücretsiz. AI özelliklerine ihtiyaç duyduğunuzda premium&apos;a geçin.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {planlar.map((plan, i) => (
              <ScrollReveal key={plan.ad} delay={i * 100} direction="up">
                <div className={`relative flex flex-col h-full rounded-2xl p-7 transition-all duration-300 ${
                  plan.vurgu
                    ? "bg-slate-900 text-white ring-2 ring-blue-500/40 shadow-2xl shadow-slate-900/25 scale-[1.02]"
                    : "bg-white border border-slate-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                }`}>
                  {plan.vurgu && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-blue-600/30">
                        <Star size={9} className="fill-current" />
                        Önerilen
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-base font-bold ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                        {plan.ad}
                      </h3>
                      {plan.vurgu && <Crown size={14} className="text-blue-400" />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold tracking-tight ${plan.vurgu ? "text-white" : "text-slate-900"}`}>
                        {plan.fiyat}
                      </span>
                      <span className={`text-sm ${plan.vurgu ? "text-white/40" : "text-slate-400"}`}>
                        {plan.periyot}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${plan.vurgu ? "text-white/40" : "text-slate-400"}`}>
                      {plan.aciklama}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.ozellikler.map((oz) => (
                      <li key={oz} className="flex items-start gap-2 text-[13px]">
                        <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${plan.vurgu ? "text-blue-400" : "text-emerald-500"}`} />
                        <span className={plan.vurgu ? "text-white/70" : "text-slate-600"}>{oz}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`block w-full rounded-xl py-2.5 text-center text-[13px] font-semibold transition-all duration-200 ${
                      plan.vurgu
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:-translate-y-0.5"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-400">
            İstediğiniz zaman iptal edebilirsiniz · 3D Secure ödeme
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0a0f1e] py-20 sm:py-24">
        <div className="pointer-events-none absolute -top-40 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/12 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="container relative text-center">
          <ScrollReveal direction="up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] text-white/50 backdrop-blur-sm">
              <Shield size={12} />
              Ücretsiz · Kayıt Gerekmez · Anlık Sonuç
            </div>
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Başlamak sadece 2 dakika alır
            </h2>
            <p className="mx-auto mb-8 max-w-md text-[17px] text-white/45 leading-relaxed">
              Firma bilgilerinizi girin, sistem uygun destekleri otomatik filtrelesin.
            </p>
            <Link
              href="/firma"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-slate-900 shadow-xl shadow-black/20 transition-all hover:bg-slate-100 hover:-translate-y-0.5"
            >
              Hemen Başla
              <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
