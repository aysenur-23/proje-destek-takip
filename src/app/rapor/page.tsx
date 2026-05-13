"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle2, AlertCircle, Info, Download } from "lucide-react";
import { tumDestekler } from "@/data/destekler";
import { tumDestekleriFiltrele } from "@/lib/filtrele";
import type { FirmaProfili, DestekKategori } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const KATEGORI_TURKCE: Record<DestekKategori, string> = {
  TUBITAK: "TÜBİTAK",
  KOSGEB: "KOSGEB",
  TKDK: "TKDK",
  AB: "AB Fonları",
  SGK: "SGK",
  TEKNOKENT: "Teknokent",
  KALKINMA: "Kalkınma Ajansı",
  TICARET: "Ticaret Bakanlığı",
  SANAYI: "Sanayi Bakanlığı",
  TARIM: "Tarım Bakanlığı",
  DIGER: "Diğer",
};

const TUR_TURKCE: Record<string, string> = {
  HIBE: "Hibe",
  KARMA: "Hibe + Kredi",
  KREDI: "Faizsiz Kredi",
  VERGI_MUAFIYETI: "Vergi Muafiyeti",
  PRIM_DESTEGI: "Prim Desteği",
};

function localdenYukle(): FirmaProfili | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? (JSON.parse(ham) as FirmaProfili) : null;
  } catch {
    return null;
  }
}

export default function RaporSayfasi() {
  const { firebaseUser } = useAuth();
  const [firmaFirestore, setFirmaFirestore] = useState<FirmaProfili | null>(null);
  const firmaLocal = useMemo(localdenYukle, []);

  // Giriş yapılmışsa Firestore'dan firma profilini çek
  useEffect(() => {
    if (!firebaseUser) return;
    let aktif = true;
    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        if (!db) return;
        const snap = await getDoc(
          doc(db, "kullanicilar", firebaseUser.uid, "profil", "firma")
        );
        if (aktif && snap.exists()) {
          setFirmaFirestore(snap.data() as FirmaProfili);
        }
      } catch {
        // Firestore hatası kritik değil — localStorage ile devam et
      }
    })();
    return () => { aktif = false; };
  }, [firebaseUser]);

  // Firestore öncelikli, yoksa localStorage
  const firma = firmaFirestore ?? firmaLocal;

  const sonuclar = useMemo(() => {
    if (!firma) return [];
    return tumDestekleriFiltrele(firma, tumDestekler.filter((d) => d.aktif));
  }, [firma]);

  const uygunlar = sonuclar.filter((s) => s.uygunMu);
  const sinirda = sonuclar.filter((s) => !s.uygunMu && s.uygunlukSkoru >= 35 && s.uygunlukSkoru < 60);

  // Kategori bazlı gruplama
  const kategoriler = Array.from(new Set(uygunlar.map((s) => s.destek.kategori)));

  const bugün = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // CSV export
  const csvIndir = useCallback(() => {
    if (!firma) return;
    const satirlar = [
      ["Program Adı", "Kategori", "Tür", "Uygunluk Skoru (%)", "Max Bütçe (TL)", "Hibe Oranı (%)", "Son Başvuru"],
      ...uygunlar.map(({ destek, uygunlukSkoru }) => [
        destek.ad,
        KATEGORI_TURKCE[destek.kategori] ?? destek.kategori,
        TUR_TURKCE[destek.tur] ?? destek.tur,
        Math.round(uygunlukSkoru).toString(),
        destek.butceUstSinir?.toString() ?? "",
        destek.hibeOrani?.toString() ?? "",
        destek.basvuruBitis
          ? new Date(destek.basvuruBitis).toLocaleDateString("tr-TR")
          : "",
      ]),
    ];
    const csvIcerik =
      "﻿" + // UTF-8 BOM (Excel Türkçe karakter desteği)
      satirlar
        .map((satir) =>
          satir.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(";")
        )
        .join("\n");
    const blob = new Blob([csvIcerik], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `destek-raporu-${firma.ad.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [firma, uygunlar]);

  if (!firma) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle size={40} className="mx-auto mb-4 text-slate-300" />
        <h1 className="text-lg font-semibold text-slate-700 mb-2">Firma profili bulunamadı</h1>
        <p className="text-sm text-slate-500 mb-6">
          Rapor oluşturmak için önce firma profilinizi doldurun.
        </p>
        <Link
          href="/firma"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Profil Oluştur
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Ekran üstü araç çubuğu — yazdırınca gizlenir */}
      <div className="print:hidden border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="container py-3 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Dashboard&apos;a Dön
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={csvIndir}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download size={14} />
              CSV İndir
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Printer size={14} />
              Yazdır / PDF Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Rapor içeriği */}
      <div className="container max-w-4xl py-8 print:py-0 print:max-w-none">
        {/* Rapor başlığı */}
        <div className="mb-8 pb-6 border-b border-slate-200 print:border-slate-400">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">
                Destek Takip — Uygunluk Raporu
              </p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                {firma.ad}
              </h1>
              <p className="text-sm text-slate-500">
                {firma.sektorAdi} · {firma.il} · {firma.sirketTuru} ·{" "}
                {firma.calısanSayisi} çalışan
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">{bugün}</p>
              <p className="text-lg font-black text-blue-600 mt-1">{uygunlar.length}</p>
              <p className="text-xs text-slate-500">uygun program</p>
            </div>
          </div>

          {/* Özellik rozetleri */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {firma.argeYapiyorMu && <Rozet>Ar-Ge</Rozet>}
            {firma.teknokentteMi && <Rozet>Teknokent</Rozet>}
            {firma.ihracatYapiyorMu && <Rozet>İhracat</Rozet>}
            {firma.osbdeMi && <Rozet>OSB</Rozet>}
            {firma.kadinGirisimci && <Rozet>Kadın Girişimci</Rozet>}
            {firma.gencGirisimci && <Rozet>Genç Girişimci</Rozet>}
          </div>
        </div>

        {/* Özet tablo */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4">
          {[
            { label: "Uygun Program", deger: uygunlar.length, renk: "emerald" },
            { label: "Potansiyel Bütçe", deger: `₺${(uygunlar.reduce((a, s) => a + (s.destek.butceUstSinir ?? 0), 0) / 1_000_000).toFixed(0)}M+`, renk: "blue" },
            { label: "Değerlendirin", deger: sinirda.length, renk: "amber" },
            { label: "Uygunluk Skoru", deger: `%${Math.round(uygunlar[0]?.uygunlukSkoru ?? 0)}`, renk: "violet" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-xl font-black text-slate-900">{k.deger}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Uygun programlar — kategori bazlı */}
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Uygun Programlar ({uygunlar.length})
        </h2>

        {kategoriler.map((kategori) => {
          const kategoriProgramlari = uygunlar.filter((s) => s.destek.kategori === kategori);
          if (kategoriProgramlari.length === 0) return null;
          return (
            <div key={kategori} className="mb-6 print:mb-4 print:break-inside-avoid">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-100 pb-1">
                {KATEGORI_TURKCE[kategori]} ({kategoriProgramlari.length})
              </h3>
              <div className="space-y-2">
                {kategoriProgramlari.map(({ destek, uygunlukSkoru, bonus }) => (
                  <div
                    key={destek.slug}
                    className="rounded-xl border border-slate-200 p-3 print:border-slate-300 print:p-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{destek.ad}</p>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-1.5 py-0.5">
                            {TUR_TURKCE[destek.tur] ?? destek.tur}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{destek.aciklama}</p>
                        {bonus.length > 0 && (
                          <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                            ✓ {bonus[0]}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-black text-slate-900">%{Math.round(uygunlukSkoru)}</p>
                        {destek.butceUstSinir && (
                          <p className="text-[10px] text-slate-500">
                            ₺{(destek.butceUstSinir / 1_000_000).toFixed(1)}M
                          </p>
                        )}
                        {(destek.hibeOrani ?? 0) > 0 && (
                          <p className="text-[10px] font-semibold text-blue-600">%{destek.hibeOrani} hibe</p>
                        )}
                      </div>
                    </div>
                    {destek.basvuruBitis && (
                      <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                        <AlertCircle size={9} />
                        Son başvuru: {new Date(destek.basvuruBitis).toLocaleDateString("tr-TR")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Sınırda programlar */}
        {sinirda.length > 0 && (
          <>
            <h2 className="text-base font-bold text-slate-900 mb-4 mt-8 flex items-center gap-2 print:mt-4">
              <Info size={16} className="text-amber-500" />
              Değerlendirmenizi Öneririz ({sinirda.length})
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Bu programlar için bazı kriterler eksik olabilir; mevzuat detayını incelemenizi öneririz.
            </p>
            <div className="space-y-2">
              {sinirda.slice(0, 6).map(({ destek, eksikKriterler }) => (
                <div
                  key={destek.slug}
                  className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 print:border-amber-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{destek.ad}</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        {eksikKriterler.slice(0, 2).join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                      İncele
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Yasal not */}
        <div className="mt-10 pt-6 border-t border-slate-200 print:mt-6 print:pt-4">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Bu rapor Destek Takip platformu tarafından otomatik olarak oluşturulmuştur.
            Uygunluk değerlendirmesi firma profilinize dayanmakta olup kesin hukuki ya da
            mali danışmanlık niteliği taşımaz. Başvuru yapmadan önce ilgili kurumun güncel
            mevzuatını ve rehberini incelemenizi tavsiye ederiz.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            destektakip.com · {bugün}
          </p>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { font-size: 11px; }
          .print\\:break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </>
  );
}

function Rozet({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
      {children}
    </span>
  );
}
