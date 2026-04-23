"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FirmaProfili, SirketTuru } from "@/types";
import { SIRKET_TURU_ADI } from "@/lib/utils";

const ADIMLAR = ["Temel Bilgiler", "Sektör & Ölçek", "Özellikler", "Konum"] as const;

const BOSLUK_FIRMA: FirmaProfili = {
  ad: "",
  kurulusYili: new Date().getFullYear() - 3,
  sirketTuru: "LTD",
  sektorKodu: "",
  sektorAdi: "",
  calısanSayisi: 1,
  yillikCiro: 0,
  ihracatYapiyorMu: false,
  argeYapiyorMu: false,
  teknokentteMi: false,
  osbdeMi: false,
  il: "",
  kadinGirisimci: false,
  gencGirisimci: false,
  engellıCalisanVarMi: false,
  alinanDestekler: [],
};

function localdenYukle(): FirmaProfili {
  if (typeof window === "undefined") return BOSLUK_FIRMA;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? (JSON.parse(ham) as FirmaProfili) : BOSLUK_FIRMA;
  } catch {
    return BOSLUK_FIRMA;
  }
}

export function FirmaForm() {
  const router = useRouter();
  const [adim, setAdim] = useState(0);
  const [firma, setFirma] = useState<FirmaProfili>(localdenYukle);

  function guncelle(alan: keyof FirmaProfili, deger: unknown) {
    setFirma((onceki) => ({ ...onceki, [alan]: deger }));
  }

  function kaydet() {
    localStorage.setItem("firmaProfili", JSON.stringify(firma));
    router.push("/destekler");
  }

  const ileri = () => setAdim((a) => Math.min(a + 1, ADIMLAR.length - 1));
  const geri = () => setAdim((a) => Math.max(a - 1, 0));

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      {/* Adım göstergesi */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {ADIMLAR.map((ad, i) => (
            <div
              key={ad}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= adim ? "bg-slate-900" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 mb-1">
          Adım {adim + 1} / {ADIMLAR.length}
        </p>
        <h2 className="text-lg font-semibold text-slate-900 mb-6">{ADIMLAR[adim]}</h2>
      </div>

      <div className="px-6 pb-6">
        {adim === 0 && (
          <div className="space-y-4">
            <FormAlan etiket="Firma Adı" zorunlu>
              <input
                type="text"
                className="input"
                value={firma.ad}
                onChange={(e) => guncelle("ad", e.target.value)}
                placeholder="Örn: Teknoloji A.Ş."
              />
            </FormAlan>
            <FormAlan etiket="Şirket Türü" zorunlu>
              <select
                className="input"
                value={firma.sirketTuru}
                onChange={(e) => guncelle("sirketTuru", e.target.value as SirketTuru)}
              >
                {Object.entries(SIRKET_TURU_ADI).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </FormAlan>
            <FormAlan etiket="Kuruluş Yılı" zorunlu>
              <input
                type="number"
                className="input"
                value={firma.kurulusYili}
                min={1950}
                max={new Date().getFullYear()}
                onChange={(e) => guncelle("kurulusYili", parseInt(e.target.value))}
              />
            </FormAlan>
            <FormAlan etiket="Vergi No (opsiyonel)">
              <input
                type="text"
                className="input"
                value={firma.vergiNo ?? ""}
                onChange={(e) => guncelle("vergiNo", e.target.value)}
                placeholder="10 haneli vergi numarası"
              />
            </FormAlan>
          </div>
        )}

        {adim === 1 && (
          <div className="space-y-4">
            <FormAlan etiket="Ana Faaliyet Sektörü (NACE Kodu)" zorunlu>
              <input
                type="text"
                className="input"
                value={firma.sektorKodu}
                onChange={(e) => guncelle("sektorKodu", e.target.value)}
                placeholder="Örn: 62.01 (bilgisayar programlama)"
              />
              <p className="text-xs text-slate-400 mt-1">
                NACE kodu bilmiyorsanız sektör adını girebilirsiniz.
              </p>
            </FormAlan>
            <FormAlan etiket="Sektör Açıklaması" zorunlu>
              <input
                type="text"
                className="input"
                value={firma.sektorAdi}
                onChange={(e) => guncelle("sektorAdi", e.target.value)}
                placeholder="Örn: Yazılım geliştirme ve danışmanlık"
              />
            </FormAlan>
            <FormAlan etiket="Çalışan Sayısı" zorunlu>
              <input
                type="number"
                className="input"
                value={firma.calısanSayisi}
                min={1}
                onChange={(e) => guncelle("calısanSayisi", parseInt(e.target.value))}
              />
            </FormAlan>
            <FormAlan etiket="Yıllık Ciro (TL)" zorunlu>
              <input
                type="number"
                className="input"
                value={firma.yillikCiro}
                min={0}
                step={100000}
                onChange={(e) => guncelle("yillikCiro", parseFloat(e.target.value))}
                placeholder="0"
              />
            </FormAlan>
          </div>
        )}

        {adim === 2 && (
          <div className="space-y-3">
            {[
              { alan: "argeYapiyorMu", etiket: "Ar-Ge faaliyeti yürütüyoruz", aciklama: "TÜBİTAK/Sanayi Bakanlığı onaylı Ar-Ge merkezi veya aktif Ar-Ge projeleri" },
              { alan: "teknokentteMi", etiket: "Teknokent/TGB kiracısıyız", aciklama: "Teknoloji Geliştirme Bölgesi üyeliği" },
              { alan: "osbdeMi", etiket: "OSB'de faaliyet gösteriyoruz", aciklama: "Organize Sanayi Bölgesi" },
              { alan: "ihracatYapiyorMu", etiket: "İhracat yapıyoruz", aciklama: "Düzenli yurt dışı satış" },
              { alan: "kadinGirisimci", etiket: "Kadın girişimci / ortak", aciklama: "Yönetim veya ortaklık yapısında kadın girişimci" },
              { alan: "gencGirisimci", etiket: "Genç girişimci (≤35 yaş)", aciklama: "Kurucu veya yöneticilerin 35 yaş ve altı olması" },
              { alan: "engellıCalisanVarMi", etiket: "Engelli çalışanımız var", aciklama: "Kayıtlı engelli personel istihdamı" },
            ].map((item) => (
              <label
                key={item.alan}
                className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900"
                  checked={firma[item.alan as keyof FirmaProfili] as boolean}
                  onChange={(e) => guncelle(item.alan as keyof FirmaProfili, e.target.checked)}
                />
                <div>
                  <div className="font-medium text-slate-800 text-sm">{item.etiket}</div>
                  <div className="text-xs text-slate-400">{item.aciklama}</div>
                </div>
              </label>
            ))}
            <FormAlan etiket="Daha önce aldığınız destekler (varsa)" aciklama="Slugları virgülle ayırın veya boş bırakın">
              <input
                type="text"
                className="input"
                value={firma.alinanDestekler.join(", ")}
                onChange={(e) =>
                  guncelle(
                    "alinanDestekler",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  )
                }
                placeholder="Örn: kosgeb-girisimcilik, tubitak-1507"
              />
            </FormAlan>
          </div>
        )}

        {adim === 3 && (
          <div className="space-y-4">
            <FormAlan etiket="İl" zorunlu>
              <input
                type="text"
                className="input"
                value={firma.il}
                onChange={(e) => guncelle("il", e.target.value)}
                placeholder="Örn: İstanbul"
              />
            </FormAlan>
            <FormAlan etiket="İlçe (opsiyonel)">
              <input
                type="text"
                className="input"
                value={firma.ilce ?? ""}
                onChange={(e) => guncelle("ilce", e.target.value)}
                placeholder="Örn: Kadıköy"
              />
            </FormAlan>
            <FormAlan etiket="Ek Notlar (opsiyonel)" aciklama="Firmanız hakkında özel durumlar, yakın planlar vb.">
              <textarea
                className="input min-h-[80px] resize-none"
                value={firma.notlar ?? ""}
                onChange={(e) => guncelle("notlar", e.target.value)}
                placeholder="Örn: 2025'te Ar-Ge merkezi başvurusu planlıyoruz..."
              />
            </FormAlan>
          </div>
        )}

        {/* Navigasyon */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
          {adim > 0 && (
            <button
              onClick={geri}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Geri
            </button>
          )}
          {adim < ADIMLAR.length - 1 ? (
            <button
              onClick={ileri}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Devam
            </button>
          ) : (
            <button
              onClick={kaydet}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Destekleri Göster →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormAlan({
  etiket,
  zorunlu,
  aciklama,
  children,
}: {
  etiket: string;
  zorunlu?: boolean;
  aciklama?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {etiket}
        {zorunlu && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {aciklama && <p className="text-xs text-slate-400 mt-1">{aciklama}</p>}
    </div>
  );
}
