"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { FirmaProfili, SirketTuru } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { SIRKET_TURU_ADI } from "@/lib/utils";
import {
  Building2,
  BarChart2,
  Settings2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Info,
  Users,
  TrendingUp,
  Sparkles,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { tumDestekleriFiltrele } from "@/lib/filtrele";
import { tumDestekler } from "@/data/destekler";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TR_ILLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
  "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
  "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli",
  "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin",
  "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt",
  "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
  "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman",
  "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce",
];

const ORTAK_DESTEKLER = [
  { slug: "tubitak-1507", ad: "TÜBİTAK 1507 KOBİ Ar-Ge" },
  { slug: "tubitak-1511", ad: "TÜBİTAK 1511 Öncelikli Ar-Ge" },
  { slug: "tubitak-1512-bigg", ad: "TÜBİTAK 1512 BİGG" },
  { slug: "kosgeb-girisimcilik", ad: "KOSGEB Girişimcilik" },
  { slug: "kosgeb-arge-inovasyon", ad: "KOSGEB Ar-Ge & İnovasyon" },
  { slug: "kosgeb-dijital-donusum", ad: "KOSGEB Dijital Dönüşüm" },
  { slug: "kosgeb-ihracat", ad: "KOSGEB İhracat" },
  { slug: "kosgeb-isletme-gelistirme", ad: "KOSGEB İşletme Geliştirme" },
  { slug: "tkdk-ipard3-tedbir41", ad: "TKDK IPARD III Tedbir 4.1" },
  { slug: "tkdk-ipard3-tedbir42", ad: "TKDK IPARD III Tedbir 4.2" },
  { slug: "sanayi-arge-merkezi", ad: "Ar-Ge Merkezi (5746)" },
  { slug: "ticaret-turquality", ad: "TURQUALITY" },
  { slug: "ticaret-e-ihracat", ad: "E-İhracat Desteği" },
];

const ADIMLAR = [
  { etiket: "Temel Bilgiler", ikon: Building2, aciklama: "Firmanızın temel kimlik bilgileri" },
  { etiket: "Sektör & Ölçek", ikon: BarChart2, aciklama: "Faaliyet alanı ve büyüklük kriterleri" },
  { etiket: "Özellikler", ikon: Settings2, aciklama: "Uygunluk skorunu etkileyen özellikler" },
  { etiket: "Konum", ikon: MapPin, aciklama: "Coğrafi konum ve ek notlar" },
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

function kobiSinifi(calisan: number, ciro: number): { sinif: string; renk: string; aciklama: string } {
  const ciroM = ciro / 1_000_000;
  if (calisan <= 10 && ciroM <= 3) {
    return { sinif: "Mikro KOBİ", renk: "emerald", aciklama: "≤10 kişi · ≤3M TL" };
  }
  if (calisan <= 50 && ciroM <= 25) {
    return { sinif: "Küçük KOBİ", renk: "blue", aciklama: "≤50 kişi · ≤25M TL" };
  }
  if (calisan <= 250 && ciroM <= 125) {
    return { sinif: "Orta KOBİ", renk: "violet", aciklama: "≤250 kişi · ≤125M TL" };
  }
  return { sinif: "Büyük İşletme", renk: "slate", aciklama: ">250 kişi veya >125M TL" };
}

function adimTamamMi(adim: number, firma: FirmaProfili): boolean {
  if (adim === 0) return firma.ad.trim().length > 0;
  if (adim === 1) return firma.sektorAdi.trim().length > 0 && firma.calısanSayisi > 0;
  if (adim === 2) return true;
  if (adim === 3) return firma.il.trim().length > 0;
  return false;
}

interface EslesmeSonucu {
  toplamUygun: number;
  kategoriler: { ad: string; sayi: number; renk: string }[];
  toplamButce: number;
}

export function FirmaForm() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [adim, setAdim] = useState(0);
  const [firma, setFirma] = useState<FirmaProfili>(localdenYukle);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [basariGosteriliyor, setBasariGosteriliyor] = useState(false);
  const [eslesme, setEslesme] = useState<EslesmeSonucu | null>(null);

  function guncelle(alan: keyof FirmaProfili, deger: unknown) {
    setFirma((onceki) => ({ ...onceki, [alan]: deger }));
  }

  async function kaydet() {
    setKaydediliyor(true);

    // 1. localStorage — kritik, hata olursa dur
    try {
      localStorage.setItem("firmaProfili", JSON.stringify(firma));
    } catch (err) {
      console.error("localStorage kayıt başarısız:", err);
      toast.error("Yerel kayıt başarısız", { description: "Tarayıcı depolama alanı dolu olabilir." });
      setKaydediliyor(false);
      return;
    }

    // 2. Firestore — ikincil, hata yapabilir ama localStorage zaten kaydedildi
    if (firebaseUser) {
      try {
        const { db } = await import("@/lib/firebase");
        if (db) {
          const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
          await setDoc(doc(db, "kullanicilar", firebaseUser.uid, "profil", "firma"), {
            ...firma,
            guncellenmeTarihi: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn("Firestore kayıt başarısız:", err);
      }
    }

    // 3. Eşleşme hesapla ve başarı ekranı göster
    const sonuclar = tumDestekleriFiltrele(firma, tumDestekler);
    const uygunlar = sonuclar.filter((s) => s.uygunMu);

    const kategoriHaritasi: Record<string, { sayi: number; renk: string }> = {
      TÜBİTAK: { sayi: 0, renk: "blue" },
      KOSGEB: { sayi: 0, renk: "violet" },
      "AB Fonları": { sayi: 0, renk: "indigo" },
      "Ticaret Bakanlığı": { sayi: 0, renk: "emerald" },
      SGK: { sayi: 0, renk: "teal" },
      Teknokent: { sayi: 0, renk: "cyan" },
      TKDK: { sayi: 0, renk: "green" },
      "Sanayi Bakanlığı": { sayi: 0, renk: "orange" },
      "Kalkınma Ajansı": { sayi: 0, renk: "amber" },
      "Tarım Bakanlığı": { sayi: 0, renk: "lime" },
    };

    const kategoriEsleme: Record<string, string> = {
      TUBITAK: "TÜBİTAK",
      KOSGEB: "KOSGEB",
      AB: "AB Fonları",
      TICARET: "Ticaret Bakanlığı",
      SGK: "SGK",
      TEKNOKENT: "Teknokent",
      TKDK: "TKDK",
      SANAYI: "Sanayi Bakanlığı",
      KALKINMA: "Kalkınma Ajansı",
      TARIM: "Tarım Bakanlığı",
    };

    for (const s of uygunlar) {
      const kategoriAdi = kategoriEsleme[s.destek.kategori] ?? s.destek.kategori;
      if (kategoriHaritasi[kategoriAdi]) {
        kategoriHaritasi[kategoriAdi].sayi++;
      }
    }

    const toplamButce = uygunlar.reduce((acc, s) => acc + (s.destek.butceUstSinir ?? 0), 0);

    const kategoriler = Object.entries(kategoriHaritasi)
      .filter(([, v]) => v.sayi > 0)
      .map(([ad, v]) => ({ ad, sayi: v.sayi, renk: v.renk }))
      .sort((a, b) => b.sayi - a.sayi);

    setEslesme({ toplamUygun: uygunlar.length, kategoriler, toplamButce });
    setKaydediliyor(false);
    setBasariGosteriliyor(true);
  }

  const ileri = () => setAdim((a) => Math.min(a + 1, ADIMLAR.length - 1));
  const geri = () => setAdim((a) => Math.max(a - 1, 0));
  const sonAdim = adim === ADIMLAR.length - 1;

  const mevcutAdimTamam = adimTamamMi(adim, firma);

  const kobi = useMemo(
    () => kobiSinifi(firma.calısanSayisi, firma.yillikCiro),
    [firma.calısanSayisi, firma.yillikCiro],
  );

  const kobiRenkHaritasi: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  };
  const kobiRenk = kobiRenkHaritasi[kobi.renk];

  const tamamlananAdimlar = ADIMLAR.map((_, i) => adimTamamMi(i, firma));
  const genelIlerleme = Math.round(
    (tamamlananAdimlar.filter(Boolean).length / ADIMLAR.length) * 100,
  );

  // ── Başarı ekranı ──────────────────────────────────────────────────────────
  if (basariGosteriliyor && eslesme) {
    const butceM = (eslesme.toplamButce / 1_000_000).toFixed(0);
    return (
      <div className="card overflow-hidden animate-fade-in">
        <div className="px-8 py-10 text-center">
          {/* Başarı ikonu */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
            <Trophy size={36} className="text-white" />
          </div>

          {/* Ana mesaj */}
          <div className="mb-1 text-4xl font-black text-slate-900 tabular-nums">
            {eslesme.toplamUygun}
          </div>
          <h2 className="mb-1 text-xl font-bold text-slate-800">
            programa uygunsunuz!
          </h2>
          {eslesme.toplamButce > 0 && (
            <p className="mb-6 text-sm text-slate-500">
              Toplam potansiyel destek bütçesi:{" "}
              <span className="font-bold text-blue-600">₺{butceM} milyon+</span>
            </p>
          )}

          {/* Kategori dağılımı */}
          {eslesme.kategoriler.length > 0 && (
            <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {eslesme.kategoriler.map((k) => (
                <div
                  key={k.ad}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center"
                >
                  <div className="text-lg font-black text-slate-800">{k.sayi}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{k.ad}</div>
                </div>
              ))}
            </div>
          )}

          {/* Aksiyon butonları */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/destekler")}
              className="btn-md btn-primary gap-2 group"
            >
              <Sparkles size={15} aria-hidden="true" />
              Destekleri İncele
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => setBasariGosteriliyor(false)}
              className="btn-md btn-secondary gap-1.5 text-slate-500"
            >
              Profili Düzenle
            </button>
          </div>

          {/* Alt not */}
          <p className="mt-5 text-[11px] text-slate-400">
            Profiliniz tarayıcınıza kaydedildi — tekrar giriş gerekmez.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* ── Adım göstergesi ── */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
        {/* İlerleme yüzdesi */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium" id="profil-ilerleme-etiket">Profil tamamlama</span>
          <span className="font-bold text-blue-600" aria-hidden="true">{genelIlerleme}%</span>
        </div>
        <div
          className="mb-4 h-1 w-full rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={genelIlerleme}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby="profil-ilerleme-etiket"
          aria-valuetext={`%${genelIlerleme} tamamlandı`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
            style={{ width: `${genelIlerleme}%` }}
          />
        </div>

        {/* Adım göstergesi */}
        <nav aria-label="Form adımları">
        <ol className="flex items-center">
          {ADIMLAR.map((a, i) => {
            const Ikon = a.ikon;
            const tamamlandi = i < adim || (i === adim && adimTamamMi(i, firma));
            const aktif = i === adim;
            const gelecek = i > adim;
            return (
              <li key={a.etiket} className="flex items-center flex-1">
                <button
                  onClick={() => i < adim && setAdim(i)}
                  disabled={i >= adim}
                  aria-current={aktif ? "step" : undefined}
                  aria-label={`${a.etiket}${tamamlandi && !aktif ? " (tamamlandı)" : aktif ? " (mevcut adım)" : " (henüz ulaşılmadı)"}`}
                  className={cn("flex flex-col items-center gap-1 group", i < adim && "cursor-pointer")}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                      tamamlandi && !aktif
                        ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
                        : aktif
                          ? "border-blue-600 bg-white text-blue-600 shadow-sm shadow-blue-600/20"
                          : gelecek
                            ? "border-slate-200 bg-white text-slate-300"
                            : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {tamamlandi && !aktif ? (
                      <Check size={13} strokeWidth={2.5} />
                    ) : (
                      <Ikon size={13} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden sm:block text-[10px] font-semibold whitespace-nowrap",
                      aktif ? "text-blue-600" : tamamlandi ? "text-slate-500" : "text-slate-300",
                    )}
                  >
                    {a.etiket}
                  </span>
                </button>
                {i < ADIMLAR.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 mx-1.5 h-0.5 rounded-full transition-all duration-500",
                      i < adim ? "bg-blue-500" : "bg-slate-200",
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
        </nav>
      </div>

      {/* ── Form içeriği ── */}
      <div className="px-6 py-6 animate-fade-in" key={adim} aria-live="polite" aria-atomic="true">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
            {(() => { const Ikon = ADIMLAR[adim].ikon; return <Ikon size={18} className="text-blue-600" />; })()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900" id="adim-baslik">{ADIMLAR[adim].etiket}</h2>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                {adim + 1} / {ADIMLAR.length}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{ADIMLAR[adim].aciklama}</p>
          </div>
        </div>

        {/* ── Adım 0: Temel Bilgiler ── */}
        {adim === 0 && (
          <div className="space-y-4">
            <FormAlan etiket="Firma Adı" zorunlu>
              <input
                type="text"
                className="input"
                value={firma.ad}
                onChange={(e) => guncelle("ad", e.target.value)}
                placeholder="Örn: Teknoloji A.Ş."
                autoFocus
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
                  maxLength={10}
                />
              </FormAlan>
            </div>
          </div>
        )}

        {/* ── Adım 1: Sektör & Ölçek ── */}
        {adim === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormAlan etiket="NACE Kodu" aciklama="Bilmiyorsanız boş bırakın">
                <input
                  type="text"
                  className="input"
                  value={firma.sektorKodu}
                  onChange={(e) => guncelle("sektorKodu", e.target.value)}
                  placeholder="Örn: 62.01"
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
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    className="input pl-9"
                    value={firma.calısanSayisi}
                    min={1}
                    onChange={(e) => guncelle("calısanSayisi", parseInt(e.target.value) || 1)}
                  />
                </div>
              </FormAlan>
              <FormAlan etiket="Yıllık Ciro (TL)" zorunlu>
                <div className="relative">
                  <TrendingUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    className="input pl-9"
                    value={firma.yillikCiro}
                    min={0}
                    step={100000}
                    onChange={(e) => guncelle("yillikCiro", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </FormAlan>
            </div>

            {/* KOBİ sınıf göstergesi */}
            <div className={cn("rounded-xl border p-3", kobiRenk.bg, kobiRenk.border)}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Info size={12} className={kobiRenk.text} />
                  <span className={cn("text-xs font-bold", kobiRenk.text)}>
                    {kobi.sinif}
                  </span>
                </div>
                <span className={cn("text-[10px] font-medium", kobiRenk.text)}>
                  {kobi.aciklama}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2">
                {[
                  { label: "Mikro", max: 10, maxC: 3 },
                  { label: "Küçük", max: 50, maxC: 25 },
                  { label: "Orta", max: 250, maxC: 125 },
                ].map((s) => {
                  const aktif = kobi.sinif.toLowerCase().includes(s.label.toLowerCase());
                  return (
                    <div
                      key={s.label}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-center transition-all",
                        aktif
                          ? `${kobiRenk.bg} ${kobiRenk.border} ring-1 ring-current`
                          : "border-transparent bg-white/50",
                      )}
                    >
                      <div className={cn("text-[10px] font-bold", aktif ? kobiRenk.text : "text-slate-400")}>
                        {s.label}
                      </div>
                      <div className="text-[9px] text-slate-400">≤{s.max} kişi</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Adım 2: Özellikler ── */}
        {adim === 2 && (
          <div className="space-y-2">
            {[
              {
                alan: "argeYapiyorMu",
                etiket: "Ar-Ge faaliyeti yürütüyoruz",
                aciklama: "TÜBİTAK/Sanayi Bakanlığı onaylı merkez veya aktif Ar-Ge projeleri",
                puan: "+15 puan",
              },
              {
                alan: "teknokentteMi",
                etiket: "Teknokent / TGB kiracısıyız",
                aciklama: "Teknoloji Geliştirme Bölgesi üyeliği",
                puan: "+10 puan",
              },
              {
                alan: "osbdeMi",
                etiket: "OSB'de faaliyet gösteriyoruz",
                aciklama: "Organize Sanayi Bölgesi",
                puan: "+10 puan",
              },
              {
                alan: "ihracatYapiyorMu",
                etiket: "İhracat yapıyoruz",
                aciklama: "Düzenli yurt dışı satış",
                puan: "+10 puan",
              },
              {
                alan: "kadinGirisimci",
                etiket: "Kadın girişimci / ortak",
                aciklama: "Yönetim veya ortaklık yapısında kadın girişimci",
                puan: "Öncelik",
              },
              {
                alan: "gencGirisimci",
                etiket: "Genç girişimci (≤35 yaş)",
                aciklama: "Kurucu veya yöneticilerin 35 yaş ve altı olması",
                puan: "Öncelik",
              },
              {
                alan: "engellıCalisanVarMi",
                etiket: "Engelli çalışanımız var",
                aciklama: "Kayıtlı engelli personel istihdamı",
                puan: "SGK desteği",
              },
            ].map((item) => {
              const secili = firma[item.alan as keyof FirmaProfili] as boolean;
              return (
                <label
                  key={item.alan}
                  className={cn(
                    "flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-150",
                    secili
                      ? "border-blue-300 bg-blue-50/70 shadow-sm"
                      : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/30",
                  )}
                >
                  <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                      checked={secili}
                      onChange={(e) => guncelle(item.alan as keyof FirmaProfili, e.target.checked)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-slate-800">{item.etiket}</div>
                      <span className={cn(
                        "shrink-0 text-[9px] font-bold rounded-full px-1.5 py-0.5 border",
                        secili
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-slate-50 text-slate-400 border-slate-100",
                      )}>
                        {item.puan}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.aciklama}</div>
                  </div>
                </label>
              );
            })}

            <FormAlan
              etiket="Daha önce aldığınız destekler"
              aciklama="Tekrar başvuru engelini kontrol eder (opsiyonel)"
            >
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="max-h-44 overflow-y-auto divide-y divide-slate-50">
                  {ORTAK_DESTEKLER.map((d) => {
                    const secili = firma.alinanDestekler.includes(d.slug);
                    return (
                      <label
                        key={d.slug}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm",
                          secili ? "bg-blue-50" : "hover:bg-slate-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 shrink-0"
                          checked={secili}
                          onChange={(e) => {
                            if (e.target.checked) {
                              guncelle("alinanDestekler", [...firma.alinanDestekler, d.slug]);
                            } else {
                              guncelle(
                                "alinanDestekler",
                                firma.alinanDestekler.filter((s) => s !== d.slug),
                              );
                            }
                          }}
                        />
                        <span className={cn("flex-1 text-xs", secili ? "text-blue-700 font-medium" : "text-slate-600")}>
                          {d.ad}
                        </span>
                        {secili && <X size={10} className="text-blue-400 shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              </div>
              {firma.alinanDestekler.length > 0 && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-blue-600">
                  <Check size={11} />
                  {firma.alinanDestekler.length} destek seçildi — tekrar başvuru kısıtları uygulanacak
                </p>
              )}
            </FormAlan>
          </div>
        )}

        {/* ── Adım 3: Konum ── */}
        {adim === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormAlan etiket="İl" zorunlu>
                <select
                  className="input"
                  value={firma.il}
                  onChange={(e) => guncelle("il", e.target.value)}
                >
                  <option value="">— İl seçin —</option>
                  {TR_ILLER.map((il) => (
                    <option key={il} value={il}>{il}</option>
                  ))}
                </select>
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
            <FormAlan
              etiket="Ek Notlar"
              aciklama="Yakın planlar, özel durumlar — AI analizi için kullanılır (opsiyonel)"
            >
              <textarea
                className="input min-h-[100px] resize-none leading-relaxed"
                value={firma.notlar ?? ""}
                onChange={(e) => guncelle("notlar", e.target.value)}
                placeholder="Örn: 2025'te Ar-Ge merkezi başvurusu planlıyoruz, ihracat oranımız %30..."
              />
            </FormAlan>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 flex items-start gap-2.5">
              <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <span>
                Bilgileriniz <strong>yalnızca tarayıcınızda</strong> saklanır, sunucuya iletilmez.
                Dilediğiniz zaman silebilirsiniz.
              </span>
            </div>
          </div>
        )}

        {/* ── Navigasyon ── */}
        <div className="flex gap-3 mt-8 pt-5 border-t border-slate-100">
          {adim > 0 ? (
            <button onClick={geri} className="btn-md btn-secondary gap-2" aria-label="Önceki adıma git">
              <ArrowLeft size={15} aria-hidden="true" />
              Geri
            </button>
          ) : (
            <div />
          )}
          {!sonAdim ? (
            <button
              onClick={ileri}
              disabled={!mevcutAdimTamam}
              aria-disabled={!mevcutAdimTamam}
              aria-label={mevcutAdimTamam ? "Sonraki adıma git" : "Bu adımı tamamlayın"}
              className={cn(
                "btn-md ml-auto gap-2 transition-all",
                mevcutAdimTamam ? "btn-primary" : "bg-slate-100 text-slate-400 cursor-not-allowed",
              )}
            >
              Devam
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={kaydet}
              disabled={!firma.il || kaydediliyor}
              aria-disabled={!firma.il || kaydediliyor}
              aria-busy={kaydediliyor}
              className={cn(
                "btn-md ml-auto gap-2 transition-all",
                firma.il && !kaydediliyor ? "btn-primary" : "bg-slate-100 text-slate-400 cursor-not-allowed",
              )}
            >
              {kaydediliyor ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Kaydediliyor…
                </>
              ) : (
                <>
                  Destekleri Göster
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
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
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span>{etiket}</span>
        {zorunlu && (
          <abbr title="zorunlu" className="text-red-500 no-underline text-xs">*</abbr>
        )}
        {aciklama && !zorunlu && (
          <span className="text-xs font-normal text-slate-400">— {aciklama}</span>
        )}
      </label>
      {children}
      {aciklama && zorunlu && (
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info size={10} aria-hidden="true" />
          {aciklama}
        </p>
      )}
    </div>
  );
}
