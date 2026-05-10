"use client";

import { useEffect, useState, useCallback } from "react";
import { db, firebaseReady } from "@/lib/firebase";
import {
  Building2,
  Search,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react";

interface FirmaProfili {
  uid: string;
  firmaAdi: string;
  sektor?: string;
  bolge?: string;
  calısanSayisi?: number;
  yillikCiro?: number;
  kurulusYili?: number;
  sirketTuru?: string;
  argeYapiyorMu?: boolean;
  ihracatYapiyorMu?: boolean;
  teknokentteMi?: boolean;
  kadinGirisimci?: boolean;
  gencGirisimci?: boolean;
  kullaniciAdi?: string;
  kullaniciEmail?: string;
}

const SEKTOR_KISALT: Record<string, string> = {
  "01": "Tarım",
  "10": "Gıda",
  "13": "Tekstil",
  "20": "Kimya",
  "25": "Metal",
  "26": "Elektronik",
  "27": "Elektrik",
  "28": "Makine",
  "29": "Otomotiv",
  "41": "İnşaat",
  "46": "Toptan",
  "47": "Perakende",
  "62": "Yazılım/BT",
  "63": "Veri",
  "72": "AR-GE",
  "85": "Eğitim",
  "86": "Sağlık",
};

function sektorKisalt(sektor?: string): string {
  if (!sektor) return "—";
  const kod = sektor.split(" ")[0]?.replace(/[^\d]/g, "").slice(0, 2);
  return SEKTOR_KISALT[kod] ?? sektor.slice(0, 25);
}

function ciroFormat(ciro?: number): string {
  if (!ciro) return "—";
  if (ciro >= 1_000_000_000) return `${(ciro / 1_000_000_000).toFixed(1)}B ₺`;
  if (ciro >= 1_000_000) return `${(ciro / 1_000_000).toFixed(1)}M ₺`;
  return `${(ciro / 1_000).toFixed(0)}K ₺`;
}

export default function AdminFirmalarPage() {
  const [firmalar, setFirmalar] = useState<FirmaProfili[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState("");
  const [acikUid, setAcikUid] = useState<string | null>(null);
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: "basarili" | "hata" } | null>(null);

  const bildirimGoster = useCallback((mesaj: string, tur: "basarili" | "hata") => {
    setBildirim({ mesaj, tur });
    setTimeout(() => setBildirim(null), 3500);
  }, []);

  const firmalariYukle = useCallback(async () => {
    setYukleniyor(true);
    if (!firebaseReady || !db) {
      setYukleniyor(false);
      bildirimGoster("Firebase bağlı değil — yerel mod", "hata");
      return;
    }

    try {
      const { collectionGroup, getDocs, collection, getDoc, doc } = await import("firebase/firestore");

      // collectionGroup ile tüm firma profillerini çek
      let snap;
      try {
        snap = await getDocs(collectionGroup(db, "profil"));
      } catch {
        // collectionGroup composite index yoksa tek tek çek
        const kullaniciSnap = await getDocs(collection(db, "kullanicilar"));
        const liste: FirmaProfili[] = [];
        for (const kullanici of kullaniciSnap.docs) {
          try {
            const firmaDoc = await getDoc(doc(db, "kullanicilar", kullanici.id, "profil", "firma"));
            if (firmaDoc.exists()) {
              const kd = kullanici.data();
              liste.push({
                uid: kullanici.id,
                kullaniciAdi: kd.ad,
                kullaniciEmail: kd.email,
                ...firmaDoc.data(),
              } as FirmaProfili);
            }
          } catch {
            // bu kullanıcı için profil okunamadı, devam et
          }
        }
        setFirmalar(liste);
        setYukleniyor(false);
        return;
      }

      const liste: FirmaProfili[] = [];
      snap.forEach((firmaDoc) => {
        const uid = firmaDoc.ref.parent.parent?.id ?? "—";
        liste.push({
          uid,
          ...firmaDoc.data(),
        } as FirmaProfili);
      });

      setFirmalar(liste);
    } catch (e) {
      bildirimGoster(
        `Yükleme hatası: ${e instanceof Error ? e.message : "bilinmiyor"}`,
        "hata"
      );
    } finally {
      setYukleniyor(false);
    }
  }, [bildirimGoster]);

  useEffect(() => {
    firmalariYukle();
  }, [firmalariYukle]);

  // Özet istatistikler
  const sektorDagilim = firmalar.reduce<Record<string, number>>((acc, f) => {
    const s = sektorKisalt(f.sektor);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const bolgeDagilim = firmalar.reduce<Record<string, number>>((acc, f) => {
    const b = f.bolge?.split("/")[0]?.trim() ?? "Belirtilmemiş";
    acc[b] = (acc[b] ?? 0) + 1;
    return acc;
  }, {});

  const topSektorler = Object.entries(sektorDagilim)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topBolgeler = Object.entries(bolgeDagilim)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filtreliListe = firmalar.filter((f) => {
    if (!arama) return true;
    const q = arama.toLowerCase();
    return (
      f.firmaAdi?.toLowerCase().includes(q) ||
      f.bolge?.toLowerCase().includes(q) ||
      f.sektor?.toLowerCase().includes(q) ||
      f.kullaniciEmail?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 size={20} className="text-teal-500" />
            Firma Profilleri
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {firmalar.length} doldurulmuş profil
          </p>
        </div>
        <button
          onClick={firmalariYukle}
          disabled={yukleniyor}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={13} className={yukleniyor ? "animate-spin" : ""} />
          Yenile
        </button>
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
          <AlertCircle size={14} />
          {bildirim.mesaj}
        </div>
      )}

      {/* Dağılım kartları */}
      {firmalar.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {/* Sektör dağılımı */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-teal-500" />
              Sektör Dağılımı
            </h2>
            <div className="space-y-2">
              {topSektorler.map(([sektor, sayi]) => (
                <div key={sektor} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-slate-600 truncate">{sektor}</span>
                      <span className="text-xs font-medium text-slate-500 ml-1">{sayi}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-teal-400"
                        style={{ width: `${(sayi / firmalar.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bölge dağılımı */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <MapPin size={13} className="text-teal-500" />
              Bölge Dağılımı
            </h2>
            <div className="space-y-2">
              {topBolgeler.map(([bolge, sayi]) => (
                <div key={bolge} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-slate-600 truncate">{bolge}</span>
                      <span className="text-xs font-medium text-slate-500 ml-1">{sayi}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-blue-400"
                        style={{ width: `${(sayi / firmalar.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genel özet */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Users size={13} className="text-teal-500" />
              Profil Özeti
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              {[
                {
                  etiket: "Ar-Ge yapan",
                  sayi: firmalar.filter((f) => f.argeYapiyorMu).length,
                },
                {
                  etiket: "İhracat yapan",
                  sayi: firmalar.filter((f) => f.ihracatYapiyorMu).length,
                },
                {
                  etiket: "Teknokentte",
                  sayi: firmalar.filter((f) => f.teknokentteMi).length,
                },
                {
                  etiket: "Kadın girişimci",
                  sayi: firmalar.filter((f) => f.kadinGirisimci).length,
                },
                {
                  etiket: "Genç girişimci",
                  sayi: firmalar.filter((f) => f.gencGirisimci).length,
                },
              ].map(({ etiket, sayi }) => (
                <div key={etiket} className="flex justify-between items-center">
                  <span>{etiket}</span>
                  <span className="font-semibold text-slate-800">{sayi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Arama */}
      <div className="card p-4 mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Firma adı, e-posta, bölge veya sektör ara…"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <span className="text-xs text-slate-400">{filtreliListe.length} firma</span>
      </div>

      {/* Firma listesi */}
      <div className="card overflow-hidden">
        {yukleniyor ? (
          <div className="space-y-0 divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-slate-100 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtreliListe.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">
              {firmalar.length === 0
                ? "Henüz doldurulmuş firma profili yok"
                : "Eşleşen firma bulunamadı"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtreliListe.map((firma) => (
              <div key={firma.uid}>
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setAcikUid(acikUid === firma.uid ? null : firma.uid)}
                >
                  {/* Logo placeholder */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 text-sm font-bold">
                    {(firma.firmaAdi ?? "?").charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {firma.firmaAdi ?? "İsimsiz Firma"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {sektorKisalt(firma.sektor)}
                      {firma.bolge && <span className="ml-2">· {firma.bolge}</span>}
                      {firma.kullaniciEmail && (
                        <span className="ml-2 text-slate-300">· {firma.kullaniciEmail}</span>
                      )}
                    </p>
                  </div>

                  {/* Çalışan sayısı */}
                  {firma.calısanSayisi && (
                    <span className="shrink-0 text-xs text-slate-400 hidden sm:block">
                      {firma.calısanSayisi} çalışan
                    </span>
                  )}

                  {/* Etiketler */}
                  <div className="hidden md:flex items-center gap-1 shrink-0">
                    {firma.argeYapiyorMu && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600">Ar-Ge</span>
                    )}
                    {firma.ihracatYapiyorMu && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">İhracat</span>
                    )}
                    {firma.teknokentteMi && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">TGB</span>
                    )}
                  </div>

                  <button
                    aria-label={acikUid === firma.uid ? "Kapat" : "Detay"}
                    className="shrink-0 text-slate-300 hover:text-slate-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcikUid(acikUid === firma.uid ? null : firma.uid);
                    }}
                  >
                    {acikUid === firma.uid ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Detay satırı */}
                {acikUid === firma.uid && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-700 mb-2">Firma Bilgileri</p>
                      <p><span className="text-slate-400">Şirket türü:</span> {firma.sirketTuru ?? "—"}</p>
                      <p><span className="text-slate-400">Kuruluş yılı:</span> {firma.kurulusYili ?? "—"}</p>
                      <p><span className="text-slate-400">Çalışan:</span> {firma.calısanSayisi ?? "—"}</p>
                      <p><span className="text-slate-400">Yıllık ciro:</span> {ciroFormat(firma.yillikCiro)}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-700 mb-2">Faaliyet</p>
                      <p><span className="text-slate-400">Sektör:</span> {firma.sektor ?? "—"}</p>
                      <p><span className="text-slate-400">Bölge:</span> {firma.bolge ?? "—"}</p>
                      <p><span className="text-slate-400">Ar-Ge:</span> {firma.argeYapiyorMu ? "Evet" : "Hayır"}</p>
                      <p><span className="text-slate-400">İhracat:</span> {firma.ihracatYapiyorMu ? "Evet" : "Hayır"}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-700 mb-2">Hesap</p>
                      <p><span className="text-slate-400">Ad:</span> {firma.kullaniciAdi ?? "—"}</p>
                      <p><span className="text-slate-400">E-posta:</span> {firma.kullaniciEmail ?? "—"}</p>
                      <p><span className="text-slate-400">UID:</span> <code className="text-[10px] text-slate-400">{firma.uid}</code></p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
