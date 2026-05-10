"use client";

import { useEffect, useState, useCallback } from "react";
import { db, firebaseReady } from "@/lib/firebase";
import { tumDestekler } from "@/data/destekler";
import type { DestekProgrami } from "@/types";
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  RotateCcw,
  Save,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";

type DestekOverride = {
  aktif?: boolean;
  basvuruBaslangic?: string;
  basvuruBitis?: string;
  sonGuncelleme?: string;
};

type SatirDurumu = "normal" | "duzenleniyor" | "kaydediliyor";

interface SatirState {
  override: DestekOverride;
  durum: SatirDurumu;
  acik: boolean;
}

const KATEGORI_ETIKETLER: Record<string, string> = {
  TUBITAK: "TÜBİTAK",
  KOSGEB: "KOSGEB",
  TKDK: "TKDK",
  AB: "AB",
  SGK: "SGK",
  TEKNOKENT: "Teknokent",
  KALKINMA: "Kalkınma",
  TICARET: "Ticaret",
  SANAYI: "Sanayi",
  TARIM: "Tarım",
  DIGER: "Diğer",
};

export default function AdminDesteklerPage() {
  const [satirlar, setSatirlar] = useState<Record<string, SatirState>>({});
  const [arama, setArama] = useState("");
  const [kategoriFiltre, setKategoriFiltre] = useState("TUMU");
  const [aktifFiltre, setAktifFiltre] = useState<"TUMU" | "AKTIF" | "PASIF">("TUMU");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: "basarili" | "hata" } | null>(null);

  const bildirimGoster = useCallback((mesaj: string, tur: "basarili" | "hata") => {
    setBildirim({ mesaj, tur });
    setTimeout(() => setBildirim(null), 3000);
  }, []);

  // Mevcut override'ları Firestore'dan yükle
  useEffect(() => {
    const yukle = async () => {
      const baslangic: Record<string, SatirState> = {};
      tumDestekler.forEach((d) => {
        baslangic[d.slug] = {
          override: {},
          durum: "normal",
          acik: false,
        };
      });

      if (firebaseReady && db) {
        try {
          const { collection, getDocs } = await import("firebase/firestore");
          const snap = await getDocs(collection(db, "destekOverrides"));
          snap.forEach((doc) => {
            if (baslangic[doc.id]) {
              baslangic[doc.id].override = doc.data() as DestekOverride;
            }
          });
        } catch {
          // Sessizce geç
        }
      }

      setSatirlar(baslangic);
      setYukleniyor(false);
    };
    yukle();
  }, []);

  const efektifDeger = (destek: DestekProgrami, alan: keyof DestekOverride) => {
    const ov = satirlar[destek.slug]?.override;
    const destekUnknown = destek as unknown as Record<string, unknown>;
    if (!ov) return destekUnknown[alan];
    if (alan in ov) return ov[alan as keyof DestekOverride];
    return destekUnknown[alan];
  };

  const toggleAktif = async (slug: string) => {
    const destek = tumDestekler.find((d) => d.slug === slug);
    if (!destek) return;
    const mevcutAktif = (efektifDeger(destek, "aktif") ?? destek.aktif) as boolean;
    const yeniAktif = !mevcutAktif;

    setSatirlar((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        override: { ...prev[slug].override, aktif: yeniAktif },
        durum: "kaydediliyor",
      },
    }));

    if (firebaseReady && db) {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(
          doc(db, "destekOverrides", slug),
          { aktif: yeniAktif, sonGuncelleme: new Date().toISOString().split("T")[0] },
          { merge: true }
        );
        bildirimGoster(`"${destek.ad.slice(0, 40)}…" güncellendi`, "basarili");
      } catch {
        bildirimGoster("Kayıt hatası — Firebase bağlı değil", "hata");
      }
    } else {
      bildirimGoster("Yerel mod — Firebase bağlı değil", "hata");
    }

    setSatirlar((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], durum: "normal" },
    }));
  };

  const tarihleriKaydet = async (slug: string) => {
    const destek = tumDestekler.find((d) => d.slug === slug);
    if (!destek) return;
    const ov = satirlar[slug].override;

    setSatirlar((prev) => ({ ...prev, [slug]: { ...prev[slug], durum: "kaydediliyor" } }));

    if (firebaseReady && db) {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(
          doc(db, "destekOverrides", slug),
          { ...ov, sonGuncelleme: new Date().toISOString().split("T")[0] },
          { merge: true }
        );
        bildirimGoster("Tarihler kaydedildi", "basarili");
      } catch {
        bildirimGoster("Kayıt hatası", "hata");
      }
    } else {
      bildirimGoster("Yerel mod — Firebase bağlı değil", "hata");
    }

    setSatirlar((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], durum: "normal", acik: false },
    }));
  };

  const overrideSifirla = async (slug: string) => {
    if (!confirm("Bu program için tüm özelleştirmeler silinecek. Emin misiniz?")) return;

    setSatirlar((prev) => ({ ...prev, [slug]: { ...prev[slug], durum: "kaydediliyor" } }));

    if (firebaseReady && db) {
      try {
        const { doc, deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "destekOverrides", slug));
        bildirimGoster("Override sıfırlandı", "basarili");
      } catch {
        bildirimGoster("Silme hatası", "hata");
      }
    }

    setSatirlar((prev) => ({
      ...prev,
      [slug]: { override: {}, durum: "normal", acik: false },
    }));
  };

  const tarihGuncelle = (slug: string, alan: "basvuruBaslangic" | "basvuruBitis", deger: string) => {
    setSatirlar((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        override: { ...prev[slug].override, [alan]: deger || undefined },
      },
    }));
  };

  // Filtreleme
  const filtreliDestekler = tumDestekler.filter((d) => {
    if (arama) {
      const q = arama.toLowerCase();
      if (!d.ad.toLowerCase().includes(q) && !d.kurum.toLowerCase().includes(q) && !d.slug.includes(q)) return false;
    }
    if (kategoriFiltre !== "TUMU" && d.kategori !== kategoriFiltre) return false;
    if (aktifFiltre !== "TUMU") {
      const aktifMi = (efektifDeger(d, "aktif") ?? d.aktif) as boolean;
      if (aktifFiltre === "AKTIF" && !aktifMi) return false;
      if (aktifFiltre === "PASIF" && aktifMi) return false;
    }
    return true;
  });

  const kategoriler = ["TUMU", ...Object.keys(KATEGORI_ETIKETLER)];
  const overrideliSayisi = Object.values(satirlar).filter((s) => Object.keys(s.override).length > 0).length;

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-violet-500" />
            Destek Programları
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tumDestekler.length} program · {overrideliSayisi} özelleştirilmiş
          </p>
        </div>
      </div>

      {/* Bildirim */}
      {bildirim && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            bildirim.tur === "basarili"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {bildirim.tur === "basarili" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {bildirim.mesaj}
        </div>
      )}

      {/* Filtreler */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Program ara…"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-400" />
          <select
            value={kategoriFiltre}
            onChange={(e) => setKategoriFiltre(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            {kategoriler.map((k) => (
              <option key={k} value={k}>
                {k === "TUMU" ? "Tüm Kategoriler" : KATEGORI_ETIKETLER[k]}
              </option>
            ))}
          </select>

          {(["TUMU", "AKTIF", "PASIF"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setAktifFiltre(f)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                aktifFiltre === f
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {f === "TUMU" ? "Tümü" : f === "AKTIF" ? "Aktif" : "Pasif"}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-slate-400">{filtreliDestekler.length} sonuç</span>
      </div>

      {/* Tablo */}
      <div className="card overflow-hidden">
        {yukleniyor ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : filtreliDestekler.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">Eşleşen program bulunamadı</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtreliDestekler.map((destek) => {
              const satir = satirlar[destek.slug] ?? { override: {}, durum: "normal", acik: false };
              const aktifMi = (efektifDeger(destek, "aktif") ?? destek.aktif) as boolean;
              const overrideVar = Object.keys(satir.override).length > 0;
              const baslangic = (satir.override.basvuruBaslangic ?? destek.basvuruBaslangic?.toString()?.split("T")[0]) ?? "";
              const bitis = (satir.override.basvuruBitis ?? destek.basvuruBitis?.toString()?.split("T")[0]) ?? "";

              return (
                <div key={destek.slug}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Aktif toggle */}
                    <button
                      onClick={() => toggleAktif(destek.slug)}
                      disabled={satir.durum === "kaydediliyor"}
                      aria-pressed={aktifMi}
                      aria-label={aktifMi ? "Pasife al" : "Aktife al"}
                      className="shrink-0"
                    >
                      {satir.durum === "kaydediliyor" ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                      ) : aktifMi ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <XCircle size={20} className="text-slate-300" />
                      )}
                    </button>

                    {/* Program adı */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-slate-800 truncate">{destek.ad}</p>
                        {overrideVar && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            override
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {destek.kurum} · {KATEGORI_ETIKETLER[destek.kategori] ?? destek.kategori}
                        {(baslangic || bitis) && (
                          <span className="ml-2">
                            {baslangic && `${baslangic}`}
                            {baslangic && bitis && " → "}
                            {bitis && `${bitis}`}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Hibe oranı */}
                    <span className="shrink-0 text-xs font-semibold text-violet-700 bg-violet-50 rounded-full px-2 py-0.5">
                      %{destek.hibeOrani}
                    </span>

                    {/* Düzenle / sıfırla */}
                    <div className="flex items-center gap-1 shrink-0">
                      {overrideVar && (
                        <button
                          onClick={() => overrideSifirla(destek.slug)}
                          title="Override sıfırla"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setSatirlar((prev) => ({
                            ...prev,
                            [destek.slug]: { ...prev[destek.slug], acik: !prev[destek.slug]?.acik },
                          }))
                        }
                        aria-label="Tarihleri düzenle"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        {satir.acik ? <ChevronUp size={13} /> : <Edit3 size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Tarih düzenleme satırı */}
                  {satir.acik && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 flex flex-wrap gap-3 items-end">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Başvuru Başlangıç</label>
                        <input
                          type="date"
                          value={baslangic}
                          onChange={(e) => tarihGuncelle(destek.slug, "basvuruBaslangic", e.target.value)}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Başvuru Bitiş</label>
                        <input
                          type="date"
                          value={bitis}
                          onChange={(e) => tarihGuncelle(destek.slug, "basvuruBitis", e.target.value)}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                      </div>
                      <button
                        onClick={() => tarihleriKaydet(destek.slug)}
                        disabled={satir.durum === "kaydediliyor"}
                        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                      >
                        <Save size={12} />
                        Kaydet
                      </button>
                      <button
                        onClick={() =>
                          setSatirlar((prev) => ({
                            ...prev,
                            [destek.slug]: { ...prev[destek.slug], acik: false },
                          }))
                        }
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-white transition-colors"
                      >
                        <ChevronUp size={12} />
                        Kapat
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
