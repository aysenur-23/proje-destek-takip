import { FirmaForm } from "@/components/firma/FirmaForm";
import { FirmaOzeti } from "@/components/firma/FirmaOzeti";

export const metadata = {
  title: "Firma Profilim — Destek Takip",
  description: "Şirket bilgilerinizi girerek size uygun destek programlarını filtreleyin.",
};

export default function FirmaSayfasi() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Sol: Form */}
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Firma Profili</h1>
            <p className="text-slate-500">
              Şirket bilgilerinizi girin — sistem uygun destekleri otomatik olarak filtreler.
              Bilgiler yalnızca tarayıcınızda saklanır.
            </p>
          </div>
          <FirmaForm />
        </div>

        {/* Sağ: Özet (mevcut profil varsa) */}
        <div className="space-y-4">
          <FirmaOzeti />

          <div className="card p-4 text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">Neden bu bilgiler isteniyor?</p>
            <ul className="space-y-1.5 leading-relaxed">
              <li>• <strong>Şirket türü</strong>: bazı programlar sadece A.Ş. veya Ltd. kabul eder</li>
              <li>• <strong>Çalışan/ciro</strong>: KOBİ sınırları uygunluğu belirler</li>
              <li>• <strong>Sektör</strong>: tarım/sanayi programları sektöre özeldir</li>
              <li>• <strong>Bölge</strong>: kalkınma ajansları il bazlı çalışır</li>
              <li>• <strong>Ar-Ge/Teknokent</strong>: TÜBİTAK ve vergi avantajları için kritik</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
