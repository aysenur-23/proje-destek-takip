import { FirmaForm } from "@/components/firma/FirmaForm";
import { FirmaOzeti } from "@/components/firma/FirmaOzeti";
import { Building2, Shield } from "lucide-react";

export const metadata = {
  title: "Firma Profilim — Destek Takip",
  description: "Şirket bilgilerinizi girerek size uygun destek programlarını filtreleyin.",
};

export default function FirmaSayfasi() {
  return (
    <>
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Building2 size={15} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Firma Profili
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Şirket Bilgileri</h1>
              <p className="text-slate-500 text-sm mt-1">
                Bilgilerinizi girin — sistem uygun destekleri otomatik filtreler
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 shrink-0 self-start sm:self-auto">
              <Shield size={12} className="text-emerald-500" />
              Tarayıcınızda saklanır
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Sol: Form */}
          <FirmaForm />

          {/* Sağ: Özet + bilgi */}
          <div className="space-y-4">
            <FirmaOzeti />

            <div className="card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Neden bu bilgiler?
              </p>
              <ul className="space-y-2.5 text-xs text-slate-500">
                {[
                  { alan: "Şirket türü", neden: "Bazı programlar sadece A.Ş. veya Ltd. kabul eder" },
                  { alan: "Çalışan/ciro", neden: "KOBİ sınırları uygunluğu belirler" },
                  { alan: "Sektör", neden: "Tarım/sanayi programları sektöre özeldir" },
                  { alan: "Bölge", neden: "Kalkınma ajansları il bazlı çalışır" },
                  { alan: "Ar-Ge/Teknokent", neden: "TÜBİTAK ve vergi avantajları için kritik" },
                ].map((item) => (
                  <li key={item.alan} className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-700">{item.alan}</span>
                    <span className="leading-relaxed">{item.neden}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
