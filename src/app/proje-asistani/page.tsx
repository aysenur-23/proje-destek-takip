import { ProjeAsistaniClient } from "@/components/proje/ProjeAsistaniClient";
import { tumDestekler } from "@/data/destekler";
import { Crown, Sparkles, FileText, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proje Yazım Asistanı — Destek Takip",
  description: "AI destekli proje raporu iyileştirme — başvurulan desteğin kriterlerine göre bölüm bölüm öneriler.",
};

export default function ProjeAsistaniSayfasi() {
  const destekler = tumDestekler
    .filter((d) => d.aktif)
    .map((d) => ({ slug: d.slug, ad: d.ad, kurum: d.kurum, kategori: d.kategori }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container py-10">
          {/* Premium badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-[12px] font-semibold text-violet-700">
            <Crown size={11} />
            Premium Özellik — Modül 1
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
          >
            Proje Yazım Asistanı
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
            Mevcut proje raporunuzu yapıştırın veya yazın. Hedef desteği seçin; Claude AI başvurulan
            kurumun değerlendirme kriterleriyle karşılaştırarak bölüm bazlı somut düzeltme önerileri sunar.
          </p>

          {/* Özellik chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { ikon: Sparkles, metin: "Claude AI analizi" },
              { ikon: FileText, metin: "Bölüm bazlı öneriler" },
              { ikon: Zap,      metin: "Anlık sonuç" },
            ].map(({ ikon: Ikon, metin }) => (
              <span
                key={metin}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                style={{ boxShadow: "var(--shadow-xs)" }}
              >
                <Ikon size={11} className="text-blue-500" />
                {metin}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="container py-8 max-w-5xl">
        <ProjeAsistaniClient destekler={destekler} />
      </div>
    </div>
  );
}
