"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { AIFiltreleWidget } from "./AIFiltreleWidget";
import Link from "next/link";

const TUM_KATEGORILER = Object.keys(KATEGORI_ADI) as DestekKategori[];

function localdenFirma(): FirmaProfili | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null;
  }
}

export function DesteklerSayfasiClient({ destekler }: { destekler: DestekProgrami[] }) {
  const [firma, setFirma] = useState<FirmaProfili | null>(null);
  const [filtreler, setFiltreler] = useState<FiltreSecenekleri>({
    kategoriler: [],
    sadecAktif: true,
    sadecUygun: false,
    aramaMetni: "",
  });
  const [aiAcik, setAiAcik] = useState(false);

  useEffect(() => {
    setFirma(localdenFirma());
  }, []);

  const sonuclar = useMemo<FiltreSonucu[]>(() => {
    if (!firma) {
      return destekler
        .filter((d) => d.aktif)
        .map((d) => ({
          destek: d,
          uygunlukSkoru: 0,
          uygunMu: false,
          eksikKriterler: [],
          bonus: [],
        }));
    }
    return tumDestekleriFiltrele(firma, destekler);
  }, [firma, destekler]);

  const filtrelenmisSonuclar = useMemo(() => {
    return sonuclar.filter((s) => {
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
  }, [sonuclar, filtreler]);

  const uygunSayisi = sonuclar.filter((s) => s.uygunMu).length;
  const aiGereklSayisi = sonuclar.filter((s) => s.aiYorumGerekli).length;

  function kategoriToggle(kat: DestekKategori) {
    setFiltreler((f) => ({
      ...f,
      kategoriler: f.kategoriler.includes(kat)
        ? f.kategoriler.filter((k) => k !== kat)
        : [...f.kategoriler, kat],
    }));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Sol panel: Filtreler ── */}
      <aside className="w-full lg:w-60 shrink-0">
        <div className="card p-4 sticky top-20">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-800">Filtreler</h2>
          </div>

          {/* Firma durumu */}
          {firma ? (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs text-emerald-700">
              <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                <CheckCircle2 size={12} />
                {firma.ad}
              </div>
              {uygunSayisi > 0 && (
                <span className="text-emerald-600">{uygunSayisi} uygun destek</span>
              )}
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700">
              <p className="font-medium mb-1">Profil girilmedi</p>
              <Link href="/firma" className="underline underline-offset-2 font-medium">
                Profil oluştur →
              </Link>
            </div>
          )}

          {/* Arama */}
          <div className="relative mb-3">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              className="input pl-8 text-xs py-2"
              placeholder="Program veya kurum ara..."
              value={filtreler.aramaMetni}
              onChange={(e) => setFiltreler((f) => ({ ...f, aramaMetni: e.target.value }))}
            />
          </div>

          {/* Sadece uygun */}
          {firma && (
            <label className="mb-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
                checked={filtreler.sadecUygun}
                onChange={(e) => setFiltreler((f) => ({ ...f, sadecUygun: e.target.checked }))}
              />
              <span className="text-xs text-slate-700">Sadece uygun olanlar</span>
            </label>
          )}

          {/* Kategori filtresi */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Kurum
            </p>
            <div className="space-y-0.5">
              {TUM_KATEGORILER.map((kat) => {
                const aktif = filtreler.kategoriler.includes(kat);
                const sayi = sonuclar.filter((s) => s.destek.kategori === kat).length;
                if (sayi === 0) return null;
                return (
                  <button
                    key={kat}
                    onClick={() => kategoriToggle(kat)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                      aktif
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    <span>{KATEGORI_ADI[kat]}</span>
                    <span className={aktif ? "opacity-75" : "opacity-50"}>{sayi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI filtreleme */}
          {firma && aiGereklSayisi > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <button
                onClick={() => setAiAcik(!aiAcik)}
                className="flex w-full items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
              >
                <Sparkles size={12} />
                <span>AI Analiz ({aiGereklSayisi} sınırda)</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Ana içerik ── */}
      <div className="flex-1 min-w-0">
        {aiAcik && firma && (
          <AIFiltreleWidget
            firma={firma}
            sinirdaDestekler={sonuclar.filter((s) => s.aiYorumGerekli).map((s) => s.destek)}
            onKapat={() => setAiAcik(false)}
          />
        )}

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtrelenmisSonuclar.length}</span>{" "}
            program listeleniyor
          </span>
          {!firma && (
            <Link href="/firma" className="btn-sm btn-primary text-xs gap-1.5">
              <Building2 size={13} />
              Uygunluk Analizi Yap
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {filtrelenmisSonuclar.map((sonuc) => (
            <DestekKarti key={sonuc.destek.slug} sonuc={sonuc} firmaVarMi={!!firma} />
          ))}
          {filtrelenmisSonuclar.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
              <Search size={36} className="mb-3 text-slate-300" />
              <p className="font-medium text-slate-500">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-slate-400">Filtre veya arama kriterlerinizi değiştirin</p>
            </div>
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

  const durumConfig = !firmaVarMi
    ? { border: "border-slate-200", bg: "", ikon: null, renk: "" }
    : uygunMu
      ? { border: "border-emerald-200", bg: "bg-emerald-50/40", ikon: CheckCircle2, renk: "text-emerald-500" }
      : sinirda
        ? { border: "border-amber-200", bg: "bg-amber-50/40", ikon: AlertCircle, renk: "text-amber-500" }
        : { border: "border-slate-200", bg: "", ikon: XCircle, renk: "text-slate-300" };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border transition-all duration-200",
        durumConfig.border,
        durumConfig.bg,
        "hover:shadow-sm",
      )}
    >
      <div
        className="flex cursor-pointer items-start gap-3 p-4"
        onClick={() => setAcik(!acik)}
      >
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                KATEGORI_RENK[destek.kategori],
              )}
            >
              {destek.kurum}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
              {TUR_ADI[destek.tur]}
            </span>
            {destek.hibeOrani && (
              <span className="text-[11px] font-bold text-blue-600">
                %{destek.hibeOrani} hibe
              </span>
            )}
            {destek.butceUstSinir && (
              <span className="text-[11px] text-slate-400">
                maks {paraCevir(destek.butceUstSinir)}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold leading-snug text-slate-900">
            {destek.ad}
          </h3>

          {!acik && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{destek.aciklama}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 mt-0.5">
          {durumConfig.ikon && (
            <durumConfig.ikon size={18} className={durumConfig.renk} />
          )}
          {acik ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </div>

      {acik && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="mb-4 text-sm text-slate-600 leading-relaxed">{destek.aciklama}</p>

          {firmaVarMi && (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-500">Uygunluk skoru</span>
                  <span
                    className={cn(
                      "font-semibold",
                      uygunMu ? "text-emerald-600" : sinirda ? "text-amber-600" : "text-slate-400",
                    )}
                  >
                    {uygunMu ? "Uygun" : sinirda ? "Sınırda" : "Uygun Değil"}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      uygunMu ? "bg-emerald-500" : sinirda ? "bg-amber-400" : "bg-slate-300",
                    )}
                    style={{ width: `${Math.max(uygunlukSkoru, 5)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {firmaVarMi && eksikKriterler.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold text-red-600">
                Uygunsuzluk nedenleri:
              </p>
              <ul className="space-y-1">
                {eksikKriterler.map((k) => (
                  <li key={k} className="flex items-start gap-1.5 text-xs text-red-600">
                    <XCircle size={11} className="mt-0.5 shrink-0" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {firmaVarMi && bonus.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold text-emerald-600">Avantajlarınız:</p>
              <ul className="space-y-1">
                {bonus.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-emerald-600">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {destek.kriterler.notlar && (
            <div className="mb-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              <strong>Not: </strong>
              {destek.kriterler.notlar}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <a
              href={destek.mevzuatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs text-blue-600 transition-colors hover:border-blue-400"
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-400"
              >
                <ExternalLink size={11} />
                Başvuru Rehberi
              </a>
            )}
            <a
              href={`/destekler/${destek.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-400"
            >
              Detay
              <ArrowRight size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
