import { FirmaForm } from "@/components/firma/FirmaForm";
import { FirmaOzeti } from "@/components/firma/FirmaOzeti";
import { Building2, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Firma Profilim — Destek Takip",
  description: "Şirket bilgilerinizi girerek size uygun destek programlarını filtreleyin.",
};

export default function FirmaSayfasi() {
  return (
    <>
      {/* ── Page header ── */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 rounded-full bg-slate-100/80 blur-2xl" />

        <div className="container relative py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                  <Building2 size={13} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  Firma Profili
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Şirket Bilgileri
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Bilgilerinizi girin — sistem uygun destekleri otomatik filtreler
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <Shield size={12} />
                Tarayıcınızda saklanır
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <Zap size={10} className="text-amber-500" />
                Kayıt gerektirmez
              </div>
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
