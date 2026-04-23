"use client";

import { useState, useEffect, useMemo } from "react";
import type { DestekProgrami, FirmaProfili, FiltreSonucu, DestekKategori, FiltreSecenekleri } from "@/types";
import { tumDestekleriFiltrele } from "@/lib/filtrele";
import { KATEGORI_ADI, KATEGORI_RENK, TUR_ADI, paraCevir } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ExternalLink, Sparkles } from "lucide-react";
import { AIFiltreleWidget } from "./AIFiltreleWidget";

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
        .map((d) => ({ destek: d, uygunlukSkoru: 0, uygunMu: false, eksikKriterler: [], bonus: [] }));
    }
    return tumDestekleriFiltrele(firma, destekler);
  }, [firma, destekler]);

  const filtrelenmisSonuclar = useMemo(() => {
    return sonuclar.filter((s) => {
      if (filtreler.sadecUygun && !s.uygunMu) return false;
      if (filtreler.kategoriler.length > 0 && !filtreler.kategoriler.includes(s.destek.kategori)) return false;
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
      {/* Sol panel: Filtreler */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={15} className="text-slate-400" />
            <h2 className="font-semibold text-slate-800 text-sm">Filtreler</h2>
          </div>

          {/* Firma durumu */}
          {firma ? (
            <div className="mb-4 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              <strong>{firma.ad}</strong> profili yüklendi.
              {uygunSayisi > 0 && (
                <span className="block mt-0.5">{uygunSayisi} uygun destek bulundu.</span>
              )}
            </div>
          ) : (
            <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              Firma profili yok. Uygunluk hesaplaması için{" "}
              <a href="/firma" className="underline font-medium">profil oluşturun</a>.
            </div>
          )}

          {/* Arama */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              className="input pl-8 text-xs"
              placeholder="Destek ara..."
              value={filtreler.aramaMetni}
              onChange={(e) => setFiltreler((f) => ({ ...f, aramaMetni: e.target.value }))}
            />
          </div>

          {/* Sadece uygun */}
          {firma && (
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                checked={filtreler.sadecUygun}
                onChange={(e) => setFiltreler((f) => ({ ...f, sadecUygun: e.target.checked }))}
              />
              <span className="text-sm text-slate-700">Sadece uygun olanlar</span>
            </label>
          )}

          {/* Kategori filtresi */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Kurum</p>
            <div className="space-y-1">
              {TUM_KATEGORILER.map((kat) => {
                const aktif = filtreler.kategoriler.includes(kat);
                const sayi = sonuclar.filter((s) => s.destek.kategori === kat).length;
                if (sayi === 0) return null;
                return (
                  <button
                    key={kat}
                    onClick={() => kategoriToggle(kat)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                      aktif
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    <span>{KATEGORI_ADI[kat]}</span>
                    <span className="opacity-60">{sayi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI filtreleme */}
          {firma && aiGereklSayisi > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setAiAcik(!aiAcik)}
                className="w-full flex items-center gap-2 px-2.5 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs text-purple-700 transition-colors"
              >
                <Sparkles size={13} />
                <span>AI Ek Analiz ({aiGereklSayisi} sınırda)</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Ana içerik */}
      <div className="flex-1 min-w-0">
        {aiAcik && firma && (
          <AIFiltreleWidget
            firma={firma}
            sinirdaDestekler={sonuclar.filter((s) => s.aiYorumGerekli).map((s) => s.destek)}
            onKapat={() => setAiAcik(false)}
          />
        )}

        <div className="text-sm text-slate-500 mb-4">
          {filtrelenmisSonuclar.length} sonuç gösteriliyor
        </div>

        <div className="space-y-3">
          {filtrelenmisSonuclar.map((sonuc) => (
            <DestekKarti key={sonuc.destek.slug} sonuc={sonuc} firmaVarMi={!!firma} />
          ))}
          {filtrelenmisSonuclar.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Search size={40} className="mx-auto mb-3 opacity-40" />
              <p>Arama kriterlerinize uygun destek bulunamadı.</p>
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

  const durumRenk = !firmaVarMi
    ? "border-slate-200"
    : uygunMu
    ? "border-green-300 bg-green-50/30"
    : uygunlukSkoru >= 35
    ? "border-amber-300 bg-amber-50/30"
    : "border-slate-200";

  const DurumIkon = !firmaVarMi
    ? null
    : uygunMu
    ? CheckCircle
    : uygunlukSkoru >= 35
    ? AlertCircle
    : XCircle;

  const durumIkonRenk = uygunMu ? "text-green-500" : uygunlukSkoru >= 35 ? "text-amber-500" : "text-slate-300";

  return (
    <div className={cn("bg-white border rounded-xl transition-all", durumRenk)}>
      <div
        className="p-4 cursor-pointer"
        onClick={() => setAcik(!acik)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", KATEGORI_RENK[destek.kategori])}>
                {destek.kurum}
              </span>
              <span className="text-xs text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
                {TUR_ADI[destek.tur]}
              </span>
              {destek.hibeOrani && (
                <span className="text-xs font-semibold text-blue-600">%{destek.hibeOrani} hibe</span>
              )}
              {destek.butceUstSinir && (
                <span className="text-xs text-slate-500">max {paraCevir(destek.butceUstSinir)}</span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug">{destek.ad}</h3>
            {!acik && (
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">{destek.aciklama}</p>
            )}
          </div>
          {DurumIkon && (
            <DurumIkon size={20} className={cn("shrink-0 mt-0.5", durumIkonRenk)} />
          )}
        </div>
      </div>

      {acik && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          <p className="text-slate-600 text-sm mb-3">{destek.aciklama}</p>

          {firmaVarMi && eksikKriterler.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-red-600 mb-1.5">Uygun olmama nedenleri:</p>
              <ul className="space-y-1">
                {eksikKriterler.map((k) => (
                  <li key={k} className="flex items-start gap-1.5 text-xs text-red-600">
                    <XCircle size={12} className="mt-0.5 shrink-0" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {firmaVarMi && bonus.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-green-600 mb-1.5">Avantajlarınız:</p>
              <ul className="space-y-1">
                {bonus.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-green-600">
                    <CheckCircle size={12} className="mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {destek.kriterler.notlar && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 mb-3">
              <strong>Not:</strong> {destek.kriterler.notlar}
            </p>
          )}

          <div className="flex gap-2">
            <a
              href={destek.mevzuatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors"
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
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                <ExternalLink size={11} />
                Başvuru Rehberi
              </a>
            )}
            <a
              href={`/destekler/${destek.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors ml-auto"
            >
              Detaylar →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
