import { DesteklerSayfasiClient } from "@/components/destekler/DesteklerSayfasiClient";
import { prisma } from "@/lib/db";
import type { DestekProgrami } from "@/types";

async function destekleriGetir(): Promise<DestekProgrami[]> {
  try {
    const dbDestekler = await prisma.destekProgrami.findMany({
      where: { aktif: true },
      orderBy: [{ oncelik: "asc" }, { ad: "asc" }],
    });

    return dbDestekler.map((d) => ({
      slug: d.slug,
      ad: d.ad,
      kurum: d.kurum,
      kategori: d.kategori as DestekProgrami["kategori"],
      tur: d.tur as DestekProgrami["tur"],
      aciklama: d.aciklama,
      amac: d.amac,
      butceUstSinir: d.butceUstSinir ?? undefined,
      hibeOrani: d.hibeOrani ?? undefined,
      basvuruBaslangic: d.basvuruBaslangic?.toISOString(),
      basvuruBitis: d.basvuruBitis?.toISOString(),
      aktif: d.aktif,
      mevzuatUrl: d.mevzuatUrl,
      rehberUrl: d.rehberUrl ?? undefined,
      kriterler: d.kriterler as DestekProgrami["kriterler"],
      etiketler: d.etiketler,
      oncelik: d.oncelik,
    }));
  } catch {
    // DB bağlantısı yoksa statik verilerle devam et
    const { tumDestekler } = await import("@/data/destekler");
    return tumDestekler;
  }
}

export const metadata = {
  title: "Destekler — Destek Takip",
  description: "Firmaya özel hibe, teşvik ve destek programları.",
};

export default async function DesteklerSayfasi() {
  const destekler = await destekleriGetir();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Destek Programları</h1>
        <p className="text-slate-500 text-sm">
          {destekler.length} program listelendi. Firma profiliniz kaydedilmişse uygunluk
          otomatik hesaplanır.
        </p>
      </div>
      <DesteklerSayfasiClient destekler={destekler} />
    </div>
  );
}
