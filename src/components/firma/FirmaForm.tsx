"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FirmaProfili, SirketTuru } from "@/types";
import { SIRKET_TURU_ADI } from "@/lib/utils";
import { Building2, BarChart2, Settings2, MapPin, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ADIMLAR = [
  { etiket: "Temel Bilgiler", ikon: Building2 },
  { etiket: "Sektör & Ölçek", ikon: BarChart2 },
  { etiket: "Özellikler", ikon: Settings2 },
  { etiket: "Konum", ikon: MapPin },
] as const;

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
  const sonAdim = adim === ADIMLAR.length - 1;

  return (
    <div className="card overflow-hidden">
      {/* ── Adım göstergesi ── */}
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {ADIMLAR.map((a, i) => {
            const Ikon = a.ikon;
            const tamamlandi = i < adim;
            const aktif = i === adim;
            return (
              <div key={a.etiket} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                      tamamlandi
                        ? "border-blue-600 bg-blue-600 text-white"
                        : aktif
                          ? "border-blue-600 bg-white text-blue-600"
                          : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {tamamlandi ? <Check size={15} strokeWidth={2.5} /> : <Ikon size={15} />}
                  </div>
                  <span
                    className={cn(
                      "hidden sm:block text-[11px] font-medium whitespace-nowrap",
                      aktif ? "text-blue-600" : tamamlandi ? "text-slate-600" : "text-slate-400",
                    )}
                  >
                    {a.etiket}
                  </span>
                </div>
                {i < ADIMLAR.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 mx-2 h-0.5 rounded transition-all duration-500",
                      i < adim ? "bg-blue-600" : "bg-slate-200",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Form içeriği ── */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {ADIMLAR[adim].etiket}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {adim === 0 && "Firmanızın temel kimlik bilgileri"}
            {adim === 1 && "Faaliyet alanı ve büyüklük kriterleri"}
            {adim === 2 && "Uygunluk skorunu etkileyen özellikler"}
            {adim === 3 && "Coğrafi konum ve ek notlar"}
          </p>
        </div>

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
            <div className="grid grid-cols-2 gap-4">
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
              <FormAlan etiket="Vergi No" aciklama="opsiyonel">
                <input
                  type="text"
                  className="input"
                  value={firma.vergiNo ?? ""}
                  onChange={(e) => guncelle("vergiNo", e.target.value)}
                  placeholder="10 haneli"
                />
              </FormAlan>
            </div>
          </div>
        )}

        {adim === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormAlan etiket="NACE Kodu" aciklama="Bilmiyorsanız boş bırakın">
                <input
                  type="text"
                  className="input"
                  value={firma.sektorKodu}
                  onChange={(e) => guncelle("sektorKodu", e.target.value)}
                  placeholder="62.01"
                />
              </FormAlan>
              <FormAlan etiket="Sektör Açıklaması" zorunlu>
                <input
                  type="text"
                  className="input"
                  value={firma.sektorAdi}
                  onChange={(e) => guncelle("sektorAdi", e.target.value)}
                  placeholder="Yazılım geliştirme"
                />
              </FormAlan>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
              KOBİ sınırları: mikro ≤10 kişi / ≤3M TL · küçük ≤50 / ≤25M · orta ≤250 / ≤125M
            </div>
          </div>
        )}

        {adim === 2 && (
          <div className="space-y-2">
            {[
              {
                alan: "argeYapiyorMu",
                etiket: "Ar-Ge faaliyeti yürütüyoruz",
                aciklama: "TÜBİTAK/Sanayi Bakanlığı onaylı merkez veya aktif Ar-Ge projeleri",
              },
              {
                alan: "teknokentteMi",
                etiket: "Teknokent / TGB kiracısıyız",
                aciklama: "Teknoloji Geliştirme Bölgesi üyeliği",
              },
              {
                alan: "osbdeMi",
                etiket: "OSB'de faaliyet gösteriyoruz",
                aciklama: "Organize Sanayi Bölgesi",
              },
              {
                alan: "ihracatYapiyorMu",
                etiket: "İhracat yapıyoruz",
                aciklama: "Düzenli yurt dışı satış",
              },
              {
                alan: "kadinGirisimci",
                etiket: "Kadın girişimci / ortak",
                aciklama: "Yönetim veya ortaklık yapısında kadın girişimci",
              },
              {
                alan: "gencGirisimci",
                etiket: "Genç girişimci (≤35 yaş)",
                aciklama: "Kurucu veya yöneticilerin 35 yaş ve altı olması",
              },
              {
                alan: "engellıCalisanVarMi",
                etiket: "Engelli çalışanımız var",
                aciklama: "Kayıtlı engelli personel istihdamı",
              },
            ].map((item) => (
              <label
                key={item.alan}
                className="flex items-start gap-3 p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    checked={firma[item.alan as keyof FirmaProfili] as boolean}
                    onChange={(e) => guncelle(item.alan as keyof FirmaProfili, e.target.checked)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{item.etiket}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.aciklama}</div>
                </div>
              </label>
            ))}
            <FormAlan etiket="Daha önce aldığınız destekler" aciklama="Program sluglarını virgülle ayırın (opsiyonel)">
              <input
                type="text"
                className="input"
                value={firma.alinanDestekler.join(", ")}
                onChange={(e) =>
                  guncelle(
                    "alinanDestekler",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="Örn: kosgeb-girisimcilik, tubitak-1507"
              />
            </FormAlan>
          </div>
        )}

        {adim === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormAlan etiket="İl" zorunlu>
                <input
                  type="text"
                  className="input"
                  value={firma.il}
                  onChange={(e) => guncelle("il", e.target.value)}
                  placeholder="İstanbul"
                />
              </FormAlan>
              <FormAlan etiket="İlçe" aciklama="opsiyonel">
                <input
                  type="text"
                  className="input"
                  value={firma.ilce ?? ""}
                  onChange={(e) => guncelle("ilce", e.target.value)}
                  placeholder="Kadıköy"
                />
              </FormAlan>
            </div>
            <FormAlan etiket="Ek Notlar" aciklama="Yakın planlar, özel durumlar — AI analizi için kullanılır (opsiyonel)">
              <textarea
                className="input min-h-[90px] resize-none"
                value={firma.notlar ?? ""}
                onChange={(e) => guncelle("notlar", e.target.value)}
                placeholder="Örn: 2025'te Ar-Ge merkezi başvurusu planlıyoruz..."
              />
            </FormAlan>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">ℹ</span>
              Bilgileriniz yalnızca tarayıcınızda saklanır, sunucuya iletilmez.
            </div>
          </div>
        )}

        {/* ── Navigasyon ── */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
          {adim > 0 ? (
            <button onClick={geri} className="btn-md btn-secondary gap-2">
              <ArrowLeft size={16} />
              Geri
            </button>
          ) : (
            <div />
          )}
          {!sonAdim ? (
            <button onClick={ileri} className="btn-md btn-primary ml-auto gap-2">
              Devam
              <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={kaydet} className="btn-md btn-primary ml-auto gap-2">
              Destekleri Göster
              <ArrowRight size={16} />
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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {etiket}
        {zorunlu && <span className="ml-1 text-red-500">*</span>}
        {aciklama && !zorunlu && (
          <span className="ml-1.5 text-xs font-normal text-slate-400">({aciklama})</span>
        )}
      </label>
      {children}
      {aciklama && zorunlu && <p className="mt-1 text-xs text-slate-400">{aciklama}</p>}
    </div>
  );
}
