import { DesteklerSayfasiClient } from "@/components/destekler/DesteklerSayfasiClient";
import { tumDestekler } from "@/data/destekler";
import { Search, Sparkles } from "lucide-react";

export const metadata = {
  title: "Destekler — Destek Takip",
  description: "Firmaya özel hibe, teşvik ve destek programları.",
};

export default function DesteklerSayfasi() {
  const aktifDestekler = tumDestekler.filter((d) => d.aktif);
  return (
    <>
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Search size={15} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Destek Programları
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Hibe & Teşvik Rehberi
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {aktifDestekler.length} aktif program · Firma profiliniz kaydedilmişse uygunluk otomatik hesaplanır
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 shrink-0 self-start sm:self-auto">
              <Sparkles size={13} />
              AI analiz mevcut
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <DesteklerSayfasiClient destekler={aktifDestekler} />
      </div>
    </>
  );
}
