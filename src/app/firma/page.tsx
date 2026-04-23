import { FirmaForm } from "@/components/firma/FirmaForm";

export const metadata = {
  title: "Firma Profilim — Destek Takip",
  description: "Şirket bilgilerinizi girerek size uygun destek programlarını filtreleyin.",
};

export default function FirmaSayfasi() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Firma Profili</h1>
        <p className="text-slate-500">
          Şirket bilgilerinizi girin — sistem uygun destekleri otomatik olarak filtreler.
          Bilgiler yalnızca tarayıcınızda saklanır.
        </p>
      </div>
      <FirmaForm />
    </div>
  );
}
