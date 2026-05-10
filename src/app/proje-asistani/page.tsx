import { ProjeAsistaniClient } from "@/components/proje/ProjeAsistaniClient";
import { tumDestekler } from "@/data/destekler";
import { Crown, Sparkles, FileText, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proje Yazım Asistanı — Destek Takip",
  description: "AI destekli proje raporu iyileştirme — başvurulan desteğin kriterlerine göre bölüm bölüm öneriler.",
};

interface Props {
  searchParams: Promise<{ destek?: string }>;
}

export default async function ProjeAsistaniSayfasi({ searchParams }: Props) {
  const { destek: baslangicSlug } = await searchParams;
  const destekler = tumDestekler
    .filter((d) => d.aktif)
    .map((d) => ({ slug: d.slug, ad: d.ad, kurum: d.kurum, kategori: d.kategori }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-violet-950/50 to-slate-900">
        {/* Dekoratif arka plan */}
        <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-600/8 blur-2xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container relative py-8 sm:py-10">
          {/* Premium badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/15 px-3.5 py-1.5 text-[12px] font-semibold text-violet-300 backdrop-blur-sm">
            <Crown size={10} />
            Premium Özellik — Modül 1
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Proje Yazım Asistanı
          </h1>
          <p className="text-white/70 text-sm max-w-xl leading-relaxed">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur-sm"
              >
                <Ikon size={10} className="text-violet-300" />
                {metin}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="container py-8 max-w-5xl">
        <ProjeAsistaniClient destekler={destekler} baslangicSlug={baslangicSlug} />
      </div>
    </div>
  );
}
