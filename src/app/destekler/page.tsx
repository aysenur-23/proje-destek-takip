import { DesteklerSayfasiClient } from "@/components/destekler/DesteklerSayfasiClient";
import { tumDestekler } from "@/data/destekler";

export const metadata = {
  title: "Destekler — Destek Takip",
  description: "Firmaya özel hibe, teşvik ve destek programları.",
};

export default function DesteklerSayfasi() {
  const aktifDestekler = tumDestekler.filter((d) => d.aktif);
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Destek Programları</h1>
        <p className="text-slate-500 text-sm">
          {aktifDestekler.length} program listelendi. Firma profiliniz kaydedilmişse uygunluk
          otomatik hesaplanır.
        </p>
      </div>
      <DesteklerSayfasiClient destekler={aktifDestekler} />
    </div>
  );
}
