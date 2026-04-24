import { ProjeAsistaniClient } from "@/components/proje/ProjeAsistaniClient";
import { tumDestekler } from "@/data/destekler";
import { Crown } from "lucide-react";

export const metadata = {
  title: "Proje Asistanı — Destek Takip",
  description: "AI destekli proje raporu iyileştirme — başvurulan desteğin kriterlerine göre bölüm bölüm öneriler.",
};

export default function ProjeAsistaniSayfasi() {
  const destekler = tumDestekler
    .filter((d) => d.aktif)
    .map((d) => ({ slug: d.slug, ad: d.ad, kurum: d.kurum, kategori: d.kategori }));

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          <Crown size={11} />
          Premium Özellik · Modül 1
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Proje Yazım Asistanı</h1>
        <p className="max-w-2xl text-slate-500">
          Mevcut proje raporunuzu yapıştırın veya yazın. Hedef desteği seçin; AI, başvurulan
          kurumun değerlendirme kriterleri ve mevzuatıyla karşılaştırarak bölüm bazlı somut
          düzeltme önerileri sunar.
        </p>
      </div>
      <ProjeAsistaniClient destekler={destekler} />
    </div>
  );
}
