import Link from "next/link";
import { ArrowRight, Search, Building2, Brain, TrendingUp, Shield } from "lucide-react";

const ozellikler = [
  {
    ikon: Building2,
    baslik: "Firmana Özel Filtreleme",
    aciklama:
      "Şirket türü, sektör, çalışan sayısı, ciro ve daha onlarca kriter kombinasyonuyla sadece uygun destekleri gör.",
  },
  {
    ikon: Search,
    baslik: "40+ Destek Programı",
    aciklama:
      "TÜBİTAK, KOSGEB, TKDK, SGK, Teknokent, AB Fonları, Kalkınma Ajansları ve Bakanlık programları tek ekranda.",
  },
  {
    ikon: Brain,
    baslik: "AI Destekli Analiz",
    aciklama:
      "Kural tabanlı filtrenin sınırda bıraktığı destekleri yapay zeka analiz eder, özel durumlar için somut adımlar sunar.",
  },
  {
    ikon: TrendingUp,
    baslik: "Proje Yazım Asistanı",
    aciklama:
      "Mevcut proje raporunu yükle; AI, başvurulan desteğin mevzuatına ve değerlendirme kriterlerine göre bölüm bölüm geliştirir.",
  },
];

const istatistikler = [
  { sayi: "40+", aciklama: "Destek programı" },
  { sayi: "10", aciklama: "Kurum ve bakanlık" },
  { sayi: "AI", aciklama: "Destekli analiz" },
  { sayi: "Ücretsiz", aciklama: "Temel kullanım" },
];

export default function AnaSayfa() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
              <Shield size={14} />
              TÜBİTAK · KOSGEB · TKDK · AB Fonları · SGK · Teknokent
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Firmanıza Uygun{" "}
              <span className="text-blue-400">Hibe ve Teşvikleri</span>{" "}
              Dakikalar İçinde Keşfedin
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Şirket bilgilerinizi girin, 40&apos;tan fazla destek programı arasından
              uygunlarını anında filtreleyin. Yapay zeka desteğiyle proje başvurularınızı
              güçlendirin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/firma"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Firmamı Tanımlayın
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/destekler"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Desteklere Göz At
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {istatistikler.map((s) => (
              <div key={s.aciklama}>
                <div className="text-3xl font-bold text-slate-900 mb-1">{s.sayi}</div>
                <div className="text-slate-500 text-sm">{s.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Neden Destek Takip?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Onlarca programı tek tek incelemeye gerek yok. Firmanıza uygun olanları
              saniyeler içinde bulun.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ozellikler.map((o) => (
              <div
                key={o.baslik}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <o.ikon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{o.baslik}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Başlamak 2 Dakika Alır
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Firma bilgilerinizi girin, sistem uygun destekleri filtrelesin.
            Proje asistanıyla başvuru sürecinizi güçlendirin.
          </p>
          <Link
            href="/firma"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Hemen Başla
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
