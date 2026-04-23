import { ProjeAsistaniClient } from "@/components/proje/ProjeAsistaniClient";
import { prisma } from "@/lib/db";
import type { DestekProgrami } from "@/types";

async function destekleriGetir(): Promise<Pick<DestekProgrami, "slug" | "ad" | "kurum" | "kategori">[]> {
  try {
    const destekler = await prisma.destekProgrami.findMany({
      where: { aktif: true },
      select: { slug: true, ad: true, kurum: true, kategori: true },
      orderBy: [{ oncelik: "asc" }, { ad: "asc" }],
    });
    return destekler.map((d) => ({
      slug: d.slug,
      ad: d.ad,
      kurum: d.kurum,
      kategori: d.kategori as DestekProgrami["kategori"],
    }));
  } catch {
    const { tumDestekler } = await import("@/data/destekler");
    return tumDestekler.map((d) => ({ slug: d.slug, ad: d.ad, kurum: d.kurum, kategori: d.kategori }));
  }
}

export const metadata = {
  title: "Proje Asistanı — Destek Takip",
  description: "AI destekli proje raporu iyileştirme — başvurulan desteğin kriterlerine göre bölüm bölüm öneriler.",
};

export default async function ProjeAsistaniSayfasi() {
  const destekler = await destekleriGetir();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
          Modül 1
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Proje Yazım Asistanı</h1>
        <p className="text-slate-500 max-w-2xl">
          Mevcut proje raporunuzu yapıştırın veya yazın. Hedef desteği seçin; AI, başvurulan
          kurumun değerlendirme kriterleri ve mevzuatıyla karşılaştırarak bölüm bazlı somut
          düzeltme önerileri sunar.
        </p>
      </div>
      <ProjeAsistaniClient destekler={destekler} />
    </div>
  );
}
