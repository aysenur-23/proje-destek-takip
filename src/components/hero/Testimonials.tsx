import { Star } from "lucide-react";

const yorumlar = [
  {
    ad: "Ahmet Yıldırım",
    unvan: "Genel Müdür, YıldızTech Yazılım A.Ş.",
    sektor: "Teknoloji · İstanbul",
    yorum: "TÜBİTAK 1507 kriterleri saatlerce süren araştırmadan sonra netleşiyordu. Destek Takip ile 3 dakikada uygun olduğumuzu gördük, AI asistanıyla da raporumuzu güçlendirdik.",
    destek: "TÜBİTAK 1507",
    tutar: "₺650.000",
    harf: "AY",
  },
  {
    ad: "Elif Kaya",
    unvan: "Kurucu Ortak, BioAg Tarım Teknolojileri",
    sektor: "Agri-Tech · Konya",
    yorum: "TKDK IPARD kriterlerini anlamak başlı başına bir projeydi. Sistem firmamızın hangi tedbirlere uygun olduğunu anında gösterdi, zaman kaybetmeden başvurduk ve onay aldık.",
    destek: "TKDK Tedbir 4.1",
    tutar: "₺1.200.000",
    harf: "EK",
  },
  {
    ad: "Murat Demir",
    unvan: "CFO, Demir Metal Sanayi Ltd.",
    sektor: "İmalat · Bursa OSB",
    yorum: "KOSGEB ve SGK teşviklerini aynı anda takip etmek çok zordu. Premium AI analizi sayesinde sınırda gördüğümüz iki destek için de başvuru cesaretini bulduk.",
    destek: "KOSGEB + SGK",
    tutar: "₺420.000",
    harf: "MD",
  },
];

export function Testimonials() {
  return (
    <section className="section border-b border-gray-100">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow mb-3">Kullanıcı Yorumları</p>
          <h2 className="section-title">Firmalar Ne Diyor?</h2>
          <p className="section-desc">
            Türkiye genelinden KOBİ&apos;ler uygun programları bulup başvurularını tamamladı.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {yorumlar.map((y) => (
            <div
              key={y.ad}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
            >
              {/* Yıldızlar */}
              <div className="mb-5 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Yorum */}
              <p className="flex-1 text-[15px] text-gray-600 leading-relaxed mb-6">
                &ldquo;{y.yorum}&rdquo;
              </p>

              {/* Destek bilgisi */}
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-gray-800">{y.destek}</p>
                  <p className="text-[11px] text-gray-400">Onaylanan: <span className="font-semibold text-gray-700">{y.tutar}</span></p>
                </div>
              </div>

              {/* Kullanıcı */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {y.harf}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{y.ad}</p>
                  <p className="text-[11px] text-gray-400">{y.unvan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alt istatistik */}
        <div className="mt-14 grid sm:grid-cols-3 gap-8 border-t border-gray-100 pt-12">
          {[
            { sayi: "500+", label: "Firma profili oluşturdu" },
            { sayi: "₺18M+", label: "Toplam onaylanan destek" },
            { sayi: "%91", label: "Kullanıcı memnuniyeti" },
          ].map(({ sayi, label }) => (
            <div key={label} className="text-center sm:text-left">
              <p
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.04em" }}
              >
                {sayi}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
