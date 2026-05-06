"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type {
  DestekProgrami,
  FirmaProfili,
  FiltreSonucu,
  DestekKategori,
  FiltreSecenekleri,
} from "@/types";
import { tumDestekleriFiltrele } from "@/lib/filtrele";
import { KATEGORI_ADI, KATEGORI_RENK, TUR_ADI, paraCevir } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
  Info,
  type LucideIcon,
} from "lucide-react";
import { AIFiltreleWidget } from "./AIFiltreleWidget";
import Link from "next/link";

const TUM_KATEGORILER = Object.keys(KATEGORI_ADI) as DestekKategori[];

type SiralamaTuru = "varsayilan" | "skor-azalan" | "skor-artan" | "butce-azalan";

function localdenFirma(): FirmaProfili | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null;
  }
}

type DestekOverride = {
  aktif?: boolean;
  basvuruBaslangic?: string;
  basvuruBitis?: string;
  sonGuncelleme?: string;
};

async function overrideleriYukle(): Promise<Record<string, DestekOverride>> {
  // Önce Firestore dene
  try {
    const { db, firebaseReady } = await import("@/lib/firebase");
    if (firebaseReady && db) {
      const { collection, getDocs } = await import("firebase/firestore");
      const snap = await getDocs(collection(db, "destekOverrides"));
      const sonuc: Record<string, DestekOverride> = {};
      snap.forEach((doc) => { sonuc[doc.id] = doc.data() as DestekOverride; });
      return sonuc;
    }
  } catch (err) {
    console.warn("Firestore override yükleme başarısız, localStorage'a düşülüyor:", err);
  }
  // Fallback: localStorage
  try {
    const local = localStorage.getItem("destekOverrides");
    return local ? JSON.parse(local) : {};
  } catch {
    return {};
  }
}

function overrideUygula(destekler: DestekProgrami[], overrides: Record<string, DestekOverride>): DestekProgrami[] {
  return destekler.map((d) => {
    const ov = overrides[d.slug];
    if (!ov) return d;
    return {
      ...d,
      aktif: ov.aktif ?? d.aktif,
      basvuruBaslangic: ov.basvuruBaslangic ?? d.basvuruBaslangic,
      basvuruBitis: ov.basvuruBitis ?? d.basvuruBitis,
      sonGuncelleme: ov.sonGuncelleme ?? d.sonGuncelleme,
    };
  });
}

interface DesteklerProps {
  destekler: DestekProgrami[];
  baslangicKategoriler?: string[];
  baslangicArama?: string;
  baslangicSadecUygun?: boolean;
}

export function DesteklerSayfasiClient({
  destekler,
  baslangicKategoriler = [],
  baslangicArama = "",
  baslangicSadecUygun = false,
}: DesteklerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [firma, setFirma] = useState<FirmaProfili | null>(null);
  const [uygulanmisDestekler, setUygulanmisDestekler] = useState<DestekProgrami[]>(destekler);
  const [filtreler, setFiltreler] = useState<FiltreSecenekleri>({
    kategoriler: baslangicKategoriler as DestekKategori[],
    sadecAktif: true,
    sadecUygun: baslangicSadecUygun,
    aramaMetni: baslangicArama,
  });
  const [aiAcik, setAiAcik] = useState(false);
  const [siralama, setSiralama] = useState<SiralamaTuru>("varsayilan");
  const [mobilFiltreler, setMobilFiltreler] = useState(false);

  // Filtre değişince URL'i güncelle (paylaşılabilir link)
  const urlGuncelle = useCallback(
    (yeniFiltreler: FiltreSecenekleri) => {
      const params = new URLSearchParams();
      if (yeniFiltreler.kategoriler.length > 0)
        params.set("kategori", yeniFiltreler.kategoriler.join(","));
      if (yeniFiltreler.aramaMetni)
        params.set("ara", yeniFiltreler.aramaMetni);
      if (yeniFiltreler.sadecUygun)
        params.set("uygun", "1");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  useEffect(() => {
    setFirma(localdenFirma());
    // Admin override'larını yükle ve uygula
    overrideleriYukle().then((overrides) => {
      if (Object.keys(overrides).length > 0) {
        setUygulanmisDestekler(overrideUygula(destekler, overrides));
      }
    });
  }, [destekler]);

  const sonuclar = useMemo<FiltreSonucu[]>(() => {
    if (!firma) {
      return uygulanmisDestekler
        .filter((d) => d.aktif)
        .map((d) => ({
          destek: d,
          uygunlukSkoru: 0,
          uygunMu: false,
          eksikKriterler: [],
          bonus: [],
        }));
    }
    return tumDestekleriFiltrele(firma, uygulanmisDestekler);
  }, [firma, uygulanmisDestekler]);

  const filtrelenmisSonuclar = useMemo(() => {
    let liste = sonuclar.filter((s) => {
      if (filtreler.sadecUygun && !s.uygunMu) return false;
      if (
        filtreler.kategoriler.length > 0 &&
        !filtreler.kategoriler.includes(s.destek.kategori)
      )
        return false;
      if (filtreler.aramaMetni) {
        const ara = filtreler.aramaMetni.toLowerCase();
        return (
          s.destek.ad.toLowerCase().includes(ara) ||
          s.destek.kurum.toLowerCase().includes(ara) ||
          s.destek.aciklama.toLowerCase().includes(ara) ||
          s.destek.etiketler.some((e) => e.toLowerCase().includes(ara))
        );
      }
      return true;
    });

    if (siralama === "skor-azalan") {
      liste = [...liste].sort((a, b) => b.uygunlukSkoru - a.uygunlukSkoru);
    } else if (siralama === "skor-artan") {
      liste = [...liste].sort((a, b) => a.uygunlukSkoru - b.uygunlukSkoru);
    } else if (siralama === "butce-azalan") {
      liste = [...liste].sort(
        (a, b) => (b.destek.butceUstSinir ?? 0) - (a.destek.butceUstSinir ?? 0),
      );
    } else {
      // Varsayılan: uygun → sınırda → uygun değil
      liste = [...liste].sort((a, b) => {
        const skA = a.uygunMu ? 2 : a.uygunlukSkoru >= 35 ? 1 : 0;
        const skB = b.uygunMu ? 2 : b.uygunlukSkoru >= 35 ? 1 : 0;
        return skB - skA || b.uygunlukSkoru - a.uygunlukSkoru;
      });
    }

    return liste;
  }, [sonuclar, filtreler, siralama]);

  const uygunSayisi = sonuclar.filter((s) => s.uygunMu).length;
  const aiGereklSayisi = sonuclar.filter((s) => s.aiYorumGerekli).length;
  const sinirdaSayisi = sonuclar.filter((s) => !s.uygunMu && s.uygunlukSkoru >= 35).length;

  const filtreAktifMi =
    filtreler.kategoriler.length > 0 ||
    filtreler.sadecUygun ||
    filtreler.aramaMetni.length > 0;

  function filtreleriSifirla() {
    const sifir: FiltreSecenekleri = { kategoriler: [], sadecAktif: true, sadecUygun: false, aramaMetni: "" };
    setFiltreler(sifir);
    setSiralama("varsayilan");
    urlGuncelle(sifir);
  }

  function filtreGuncelle(guncelleme: Partial<FiltreSecenekleri>) {
    setFiltreler((f) => {
      const yeni = { ...f, ...guncelleme };
      urlGuncelle(yeni);
      return yeni;
    });
  }

  function kategoriToggle(kat: DestekKategori) {
    setFiltreler((f) => {
      const yeniKategoriler = f.kategoriler.includes(kat)
        ? f.kategoriler.filter((k) => k !== kat)
        : [...f.kategoriler, kat];
      const yeni = { ...f, kategoriler: yeniKategoriler };
      urlGuncelle(yeni);
      return yeni;
    });
  }

  const filtrePaneli = (
    <div className="space-y-4">
      {/* Firma durumu */}
      {firma ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-3 text-xs text-emerald-700">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="truncate">{firma.ad}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-emerald-600">
              {uygunSayisi > 0 ? `${uygunSayisi} uygun` : "Eşleşme hesaplandı"}
            </span>
            <Link href="/firma" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium">
              Düzenle
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-3 text-xs">
          <p className="font-semibold text-amber-800 mb-1">Profil girilmedi</p>
          <p className="text-amber-600 mb-2 leading-relaxed">
            Uygunluk analizi için firma bilgilerini girin.
          </p>
          <Link
            href="/firma"
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            <Building2 size={11} />
            Profil Oluştur
          </Link>
        </div>
      )}

      {/* Arama */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          className="input pl-8 text-xs py-2 text-slate-800"
          placeholder="Program veya kurum ara..."
          aria-label="Destek programı ara"
          value={filtreler.aramaMetni}
          onChange={(e) => filtreGuncelle({ aramaMetni: e.target.value })}
        />
        {filtreler.aramaMetni && (
          <button
            onClick={() => filtreGuncelle({ aramaMetni: "" })}
            aria-label="Aramayı temizle"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <XCircle size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Sadece uygun */}
      {firma && (
        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
            checked={filtreler.sadecUygun}
            onChange={(e) => filtreGuncelle({ sadecUygun: e.target.checked })}
          />
          <div className="flex-1">
            <span className="text-xs font-medium text-slate-700">Sadece uygun olanlar</span>
            {filtreler.sadecUygun && uygunSayisi > 0 && (
              <span className="ml-1.5 text-[10px] text-blue-600 font-semibold">{uygunSayisi}</span>
            )}
          </div>
        </label>
      )}

      {/* Aktif filtre özeti */}
      {filtreAktifMi && (
        <div className="flex flex-wrap gap-1.5">
          {filtreler.kategoriler.map((kat) => (
            <button
              key={kat}
              onClick={() => kategoriToggle(kat)}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
            >
              {KATEGORI_ADI[kat]}
              <span className="text-blue-400">×</span>
            </button>
          ))}
          {filtreler.sadecUygun && (
            <button
              onClick={() => filtreGuncelle({ sadecUygun: false })}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              Sadece Uygun
              <span className="text-emerald-400">×</span>
            </button>
          )}
        </div>
      )}

      {/* Kategori filtresi */}
      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Kurum Filtresi
        </p>
        <div className="space-y-0.5">
          {TUM_KATEGORILER.map((kat) => {
            const aktif = filtreler.kategoriler.includes(kat);
            const sayi = sonuclar.filter((s) => s.destek.kategori === kat).length;
            const uygunKat = sonuclar.filter((s) => s.destek.kategori === kat && s.uygunMu).length;
            if (sayi === 0) return null;
            return (
              <button
                key={kat}
                onClick={() => kategoriToggle(kat)}
                aria-pressed={aktif}
                aria-label={`${KATEGORI_ADI[kat]} kategorisini ${aktif ? "kaldır" : "filtrele"} (${sayi} program)`}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-all duration-150",
                  aktif
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <span className="flex-1 text-left">{KATEGORI_ADI[kat]}</span>
                {firma && uygunKat > 0 && !aktif && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
                    {uygunKat}
                  </span>
                )}
                <span className={cn("text-[10px] font-medium", aktif ? "text-blue-200" : "text-slate-400")}>
                  {sayi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI filtreleme */}
      {firma && aiGereklSayisi > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <button
            onClick={() => { setAiAcik(!aiAcik); setMobilFiltreler(false); }}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
              aiAcik
                ? "border-violet-300 bg-violet-100 text-violet-800"
                : "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
            )}
          >
            <Sparkles size={13} className="text-violet-500" />
            <span className="flex-1 text-left">AI Analiz</span>
            <span className="rounded-full bg-violet-200 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
              {aiGereklSayisi}
            </span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Mobil filtre toggle ── */}
      <div className="lg:hidden flex items-center gap-2">
        <button
          onClick={() => setMobilFiltreler(!mobilFiltreler)}
          aria-expanded={mobilFiltreler}
          aria-controls="mobil-filtre-paneli"
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
            mobilFiltreler || filtreAktifMi
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-700",
          )}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filtreler
          {filtreAktifMi && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
              {filtreler.kategoriler.length + (filtreler.sadecUygun ? 1 : 0) + (filtreler.aramaMetni ? 1 : 0)}
            </span>
          )}
        </button>
        {filtreAktifMi && (
          <button
            onClick={filtreleriSifirla}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RotateCcw size={11} />
            Sıfırla
          </button>
        )}
      </div>

      {/* Mobil filtre paneli */}
      {mobilFiltreler && (
        <div id="mobil-filtre-paneli" className="lg:hidden card p-4 animate-slide-up" role="region" aria-label="Filtre seçenekleri">
          {filtrePaneli}
        </div>
      )}

      {/* ── Sol panel: Filtreler (desktop) ── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="card p-4 sticky top-20">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800">Filtreler</h2>
            </div>
            {filtreAktifMi && (
              <button
                onClick={filtreleriSifirla}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <RotateCcw size={10} />
                Sıfırla
              </button>
            )}
          </div>
          {filtrePaneli}
        </div>
      </aside>

      {/* ── Ana içerik ── */}
      <div className="flex-1 min-w-0">
        {/* AI widget */}
        {aiAcik && firma && (
          <div className="mb-4 animate-slide-up">
            <AIFiltreleWidget
              firma={firma}
              sinirdaDestekler={sonuclar.filter((s) => s.aiYorumGerekli).map((s) => s.destek)}
              onKapat={() => setAiAcik(false)}
            />
          </div>
        )}

        {/* Özet kartlar */}
        {firma && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => filtreGuncelle({ sadecUygun: !filtreler.sadecUygun })}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-center transition-all group",
                filtreler.sadecUygun
                  ? "border-emerald-300 bg-emerald-100 ring-1 ring-emerald-200"
                  : "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
              )}
            >
              <div className="text-xl font-bold text-emerald-700 tabular-nums">{uygunSayisi}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Uygun</div>
            </button>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center">
              <div className="text-xl font-bold text-amber-600 tabular-nums">{sinirdaSayisi}</div>
              <div className="text-[10px] text-amber-600 font-semibold">Sınırda</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center">
              <div className="text-xl font-bold text-slate-400 tabular-nums">
                {sonuclar.length - uygunSayisi - sinirdaSayisi}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">Uygun Değil</div>
            </div>
          </div>
        )}

        {/* Üst bar: sayım + sıralama */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtrelenmisSonuclar.length}</span>
            {" "}program{filtreAktifMi && <span className="text-blue-600"> · filtreli</span>}
          </span>

          <div className="flex items-center gap-2">
            {!firma && (
              <Link href="/firma" className="btn-sm btn-primary text-xs gap-1.5 hidden sm:inline-flex">
                <Building2 size={12} />
                Uygunluk Analizi Yap
              </Link>
            )}

            {/* Sıralama */}
            <div className="relative">
              <select
                value={siralama}
                onChange={(e) => setSiralama(e.target.value as SiralamaTuru)}
                aria-label="Sıralama seçeneği"
                className="input py-1.5 text-xs pr-8 appearance-none cursor-pointer pl-8"
              >
                <option value="varsayilan">Varsayılan sıra</option>
                <option value="skor-azalan">En yüksek skor</option>
                <option value="skor-artan">En düşük skor</option>
                <option value="butce-azalan">En yüksek bütçe</option>
              </select>
              <ArrowUpDown size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Kart listesi */}
        <div
          className="space-y-2.5"
          role="list"
          aria-label={`${filtrelenmisSonuclar.length} destek programı`}
          aria-live="polite"
          aria-atomic="false"
        >
          {filtrelenmisSonuclar.map((sonuc) => (
            <DestekKarti key={sonuc.destek.slug} sonuc={sonuc} firmaVarMi={!!firma} />
          ))}

          {filtrelenmisSonuclar.length === 0 && (
            <BosListeDurumu
              aramaMetni={filtreler.aramaMetni}
              sadecUygun={filtreler.sadecUygun}
              firmaVarMi={!!firma}
              onSifirla={filtreleriSifirla}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DestekKarti({ sonuc, firmaVarMi }: { sonuc: FiltreSonucu; firmaVarMi: boolean }) {
  const { destek, uygunMu, uygunlukSkoru, eksikKriterler, bonus } = sonuc;
  const [acik, setAcik] = useState(false);

  const sinirda = !uygunMu && uygunlukSkoru >= 35;

  type DurumConfig = {
    leftBar: string;
    headerBg: string;
    border: string;
    pill: { bg: string; text: string; dot: string };
    ikon: LucideIcon | null;
    ikonRenk: string;
  };

  const durumConfig: DurumConfig = !firmaVarMi
    ? {
        leftBar: "bg-slate-200",
        headerBg: "",
        border: "border-slate-200",
        pill: { bg: "", text: "", dot: "" },
        ikon: null,
        ikonRenk: "",
      }
    : uygunMu
      ? {
          leftBar: "bg-emerald-500",
          headerBg: "",
          border: "border-slate-200 hover:border-emerald-200",
          pill: { bg: "bg-emerald-100 text-emerald-700 border-emerald-200", text: "Uygun", dot: "bg-emerald-500" },
          ikon: CheckCircle2,
          ikonRenk: "text-emerald-500",
        }
      : sinirda
        ? {
            leftBar: "bg-amber-400",
            headerBg: "",
            border: "border-slate-200 hover:border-amber-200",
            pill: { bg: "bg-amber-100 text-amber-700 border-amber-200", text: "Sınırda", dot: "bg-amber-400" },
            ikon: AlertCircle,
            ikonRenk: "text-amber-400",
          }
        : {
            leftBar: "bg-slate-200",
            headerBg: "",
            border: "border-slate-200",
            pill: { bg: "bg-slate-100 text-slate-500 border-slate-200", text: "Uygun Değil", dot: "bg-slate-300" },
            ikon: XCircle,
            ikonRenk: "text-slate-300",
          };

  return (
    <div
      role="listitem"
      className={cn(
        "group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        durumConfig.border,
        acik && "shadow-[var(--shadow-sm)]",
      )}
    >
      {/* Sol renk çizgisi */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", durumConfig.leftBar)} aria-hidden="true" />

      {/* Kart başlığı */}
      <div
        className="flex cursor-pointer items-start gap-3 pl-5 pr-4 py-3.5"
        onClick={() => setAcik(!acik)}
        role="button"
        tabIndex={0}
        aria-expanded={acik}
        aria-label={`${destek.ad} — ${acik ? "daralt" : "detayları göster"}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAcik(!acik); } }}
      >
        <div className="flex-1 min-w-0">
          {/* Badge satırı */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                KATEGORI_RENK[destek.kategori],
              )}
            >
              {destek.kurum}
            </span>
            <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 font-medium">
              {TUR_ADI[destek.tur]}
            </span>
            {destek.hibeOrani ? (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-1.5 py-0.5">
                %{destek.hibeOrani} hibe
              </span>
            ) : null}
            {destek.butceUstSinir ? (
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-1.5 py-0.5">
                maks {paraCevir(destek.butceUstSinir)}
              </span>
            ) : null}
            {destek.basvuruBitis && new Date(destek.basvuruBitis) < new Date() && (
              <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-1.5 py-0.5">
                Süresi Doldu
              </span>
            )}
            {!destek.aktif && (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-1.5 py-0.5">
                Pasif
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-blue-900 transition-colors">
            {destek.ad}
          </h3>

          {!acik && (
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{destek.aciklama}</p>
          )}
          {!acik && firmaVarMi && uygunlukSkoru > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    uygunMu ? "bg-emerald-500" : sinirda ? "bg-amber-400" : "bg-slate-300",
                  )}
                  style={{ width: `${Math.max(uygunlukSkoru, 3)}%` }}
                />
              </div>
              <span className="text-[10px] tabular-nums font-semibold text-slate-400">{uygunlukSkoru}%</span>
            </div>
          )}
        </div>

        {/* Sağ taraf: durum + expand */}
        <div className="flex shrink-0 items-center gap-2 mt-0.5">
          {firmaVarMi && durumConfig.pill.bg && (
            <span className={cn("hidden sm:inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold", durumConfig.pill.bg)}>
              <span className={cn("status-dot w-1.5 h-1.5", durumConfig.pill.dot)} />
              {durumConfig.pill.text}
            </span>
          )}
          {firmaVarMi && durumConfig.ikon && (
            <durumConfig.ikon size={16} className={cn("sm:hidden", durumConfig.ikonRenk)} />
          )}
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200",
            acik ? "bg-slate-100 text-slate-600" : "text-slate-300 group-hover:text-slate-500 group-hover:bg-slate-50",
          )}>
            {acik ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </div>
      </div>

      {/* Genişletilmiş içerik */}
      {acik && (
        <div className="border-t border-slate-100 bg-slate-50/40 pl-5 pr-4 pb-4 pt-3.5 animate-fade-in">
          <p className="mb-4 text-sm text-slate-600 leading-relaxed">{destek.aciklama}</p>

          {firmaVarMi && (
            <div className="mb-4">
              <div className="mb-1.5 flex justify-between items-center text-xs">
                <span className="font-medium text-slate-500 flex items-center gap-1">
                  <Info size={11} />
                  Uygunluk skoru
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums font-bold text-slate-700">{uygunlukSkoru}%</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-bold",
                      durumConfig.pill.bg,
                    )}
                  >
                    <span className={cn("status-dot w-1 h-1", durumConfig.pill.dot)} />
                    {durumConfig.pill.text}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    uygunMu ? "bg-emerald-500" : sinirda ? "bg-amber-400" : "bg-slate-300",
                  )}
                  style={{ width: `${Math.max(uygunlukSkoru, 3)}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {firmaVarMi && eksikKriterler.length > 0 && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-500">
                  Eksik Kriterler
                </p>
                <ul className="space-y-1.5">
                  {eksikKriterler.map((k) => (
                    <li key={k} className="flex items-start gap-1.5 text-xs text-red-600">
                      <XCircle size={11} className="mt-0.5 shrink-0 text-red-400" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {firmaVarMi && bonus.length > 0 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Avantajlarınız
                </p>
                <ul className="space-y-1.5">
                  {bonus.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-xs text-emerald-700">
                      <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {destek.kriterler.notlar && (
            <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-3 flex gap-2">
              <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">{destek.kriterler.notlar}</p>
            </div>
          )}

          {destek.sonGuncelleme && (
            <p className="mb-3 text-[10px] text-slate-400">
              Son güncelleme: {new Date(destek.sonGuncelleme).toLocaleDateString("tr-TR")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={destek.mevzuatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              <ExternalLink size={11} />
              Resmi Kaynak
            </a>
            {destek.rehberUrl && (
              <a
                href={destek.rehberUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <ExternalLink size={11} />
                Başvuru Rehberi
              </a>
            )}
            <Link
              href={`/destekler/${destek.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:text-blue-600"
            >
              Detay Sayfası
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function BosListeDurumu({
  aramaMetni,
  sadecUygun,
  firmaVarMi,
  onSifirla,
}: {
  aramaMetni: string;
  sadecUygun: boolean;
  firmaVarMi: boolean;
  onSifirla: () => void;
}) {
  if (!firmaVarMi) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-20 text-center px-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <Building2 size={28} className="text-amber-400" />
        </div>
        <p className="font-semibold text-slate-700 mb-1">Firma profilinizi oluşturun</p>
        <p className="text-sm text-slate-500 mb-5 max-w-xs leading-relaxed">
          Uygunluk analizi ve kişiselleştirilmiş eşleştirme için firma bilgilerinizi girin.
        </p>
        <Link href="/firma" className="btn-sm btn-primary gap-1.5 text-xs">
          <Building2 size={12} />
          Profil Oluştur
        </Link>
      </div>
    );
  }

  if (sadecUygun && !aramaMetni) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center px-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <AlertCircle size={28} className="text-slate-300" />
        </div>
        <p className="font-semibold text-slate-600 mb-1">Şu an tam uygun program yok</p>
        <p className="text-sm text-slate-400 mb-5 max-w-xs leading-relaxed">
          Firma profilinizi güncelleyin veya "sınırda" programları da görmek için filtreyi kaldırın.
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={onSifirla} className="btn-sm btn-secondary gap-1.5 text-xs">
            <RotateCcw size={12} />
            Tüm Programları Göster
          </button>
          <Link href="/firma" className="btn-sm btn-primary gap-1.5 text-xs">
            Profili Güncelle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Search size={28} className="text-slate-300" />
      </div>
      <p className="font-semibold text-slate-600 mb-1">
        {aramaMetni ? `"${aramaMetni}" için sonuç yok` : "Sonuç bulunamadı"}
      </p>
      <p className="text-sm text-slate-400 mb-5 max-w-xs">
        Filtre veya arama kriterlerinizi değiştirin
      </p>
      <button onClick={onSifirla} className="btn-sm btn-secondary gap-1.5 text-xs">
        <RotateCcw size={12} />
        Filtreleri Sıfırla
      </button>
    </div>
  );
}
