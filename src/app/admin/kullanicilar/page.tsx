"use client";

import { useEffect, useState, useCallback } from "react";
import { db, firebaseReady } from "@/lib/firebase";
import {
  Users,
  Search,
  Crown,
  UserCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

interface Kullanici {
  uid: string;
  ad: string;
  email: string;
  plan: "ucretsiz" | "premium";
  olusturmaTarihi: string;
  sonGiris?: string;
  firmaAdi?: string;
}

const SAYFA_BOYUTU = 20;

export default function AdminKullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState("");
  const [planFiltre, setPlanFiltre] = useState<"TUMU" | "ucretsiz" | "premium">("TUMU");
  const [sayfa, setSayfa] = useState(1);
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: "basarili" | "hata" } | null>(null);
  const [yukleniyor_plan, setYukleniyor_plan] = useState<string | null>(null);
  const [acikUid, setAcikUid] = useState<string | null>(null);

  const bildirimGoster = useCallback((mesaj: string, tur: "basarili" | "hata") => {
    setBildirim({ mesaj, tur });
    setTimeout(() => setBildirim(null), 3500);
  }, []);

  const kullanicilariYukle = useCallback(async () => {
    setYukleniyor(true);
    if (!firebaseReady || !db) {
      setYukleniyor(false);
      bildirimGoster("Firebase bağlı değil — yerel mod", "hata");
      return;
    }

    try {
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const snap = await getDocs(
        query(collection(db, "kullanicilar"), orderBy("olusturmaTarihi", "desc"))
      );

      const liste: Kullanici[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        liste.push({
          uid: doc.id,
          ad: d.ad ?? "—",
          email: d.email ?? "—",
          plan: d.plan ?? "ucretsiz",
          olusturmaTarihi: d.olusturmaTarihi?.toDate?.()?.toLocaleDateString("tr-TR") ?? "—",
          sonGiris: d.sonGiris?.toDate?.()?.toLocaleDateString("tr-TR"),
          firmaAdi: d.firmaAdi,
        });
      });

      setKullanicilar(liste);
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
    kullanicilariYukle();
  }, [kullanicilariYukle]);

  const planGuncelle = async (uid: string, yeniPlan: "ucretsiz" | "premium") => {
    if (!firebaseReady || !db) {
      bildirimGoster("Firebase bağlı değil", "hata");
      return;
    }

    setYukleniyor_plan(uid);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "kullanicilar", uid), {
        plan: yeniPlan,
        planGuncelleme: new Date().toISOString(),
      });

      setKullanicilar((prev) =>
        prev.map((k) => (k.uid === uid ? { ...k, plan: yeniPlan } : k))
      );
      bildirimGoster(
        `Plan güncellendi → ${yeniPlan === "premium" ? "Premium" : "Ücretsiz"}`,
        "basarili"
      );
    } catch (e) {
      bildirimGoster(
        `Güncelleme hatası: ${e instanceof Error ? e.message : "bilinmiyor"}`,
        "hata"
      );
    } finally {
      setYukleniyor_plan(null);
    }
  };

  // Filtreleme + sayfalama
  const filtreliListe = kullanicilar.filter((k) => {
    if (planFiltre !== "TUMU" && k.plan !== planFiltre) return false;
    if (arama) {
      const q = arama.toLowerCase();
      if (
        !k.ad.toLowerCase().includes(q) &&
        !k.email.toLowerCase().includes(q) &&
        !(k.firmaAdi ?? "").toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const toplamSayfa = Math.ceil(filtreliListe.length / SAYFA_BOYUTU);
  const sayfaListe = filtreliListe.slice((sayfa - 1) * SAYFA_BOYUTU, sayfa * SAYFA_BOYUTU);

  const premiumSayisi = kullanicilar.filter((k) => k.plan === "premium").length;

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Kullanıcılar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {kullanicilar.length} toplam · {premiumSayisi} premium
          </p>
        </div>
        <button
          onClick={kullanicilariYukle}
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

      {/* Filtreler */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Ad, e-posta veya firma ara…"
            value={arama}
            onChange={(e) => {
              setArama(e.target.value);
              setSayfa(1);
            }}
            className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {(["TUMU", "ucretsiz", "premium"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setPlanFiltre(f); setSayfa(1); }}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              planFiltre === f
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {f === "TUMU" ? "Tümü" : f === "premium" ? "Premium" : "Ücretsiz"}
          </button>
        ))}

        <span className="ml-auto text-xs text-slate-400">{filtreliListe.length} kullanıcı</span>
      </div>

      {/* Tablo */}
      <div className="card overflow-hidden">
        {yukleniyor ? (
          <div className="space-y-0 divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-slate-100 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : sayfaListe.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            {kullanicilar.length === 0 ? "Henüz kullanıcı yok" : "Eşleşen kullanıcı bulunamadı"}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {sayfaListe.map((k) => (
              <div key={k.uid}>
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      k.plan === "premium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {k.ad.charAt(0).toUpperCase()}
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{k.ad}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {k.email}
                      {k.firmaAdi && <span className="ml-2 text-slate-300">· {k.firmaAdi}</span>}
                    </p>
                  </div>

                  {/* Plan badge */}
                  <div className="shrink-0">
                    {k.plan === "premium" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                        <Crown size={10} />
                        Premium
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Ücretsiz</span>
                    )}
                  </div>

                  {/* Tarih */}
                  <p className="shrink-0 text-xs text-slate-300 hidden sm:block">{k.olusturmaTarihi}</p>

                  {/* Detay toggle */}
                  <button
                    onClick={() => setAcikUid(acikUid === k.uid ? null : k.uid)}
                    aria-label="Detay"
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    {acikUid === k.uid ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {/* Genişletilmiş detay + plan toggle */}
                {acikUid === k.uid && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 space-y-1 text-xs text-slate-500">
                      <p><span className="font-medium">UID:</span> <code className="text-slate-400">{k.uid}</code></p>
                      <p><span className="font-medium">Kayıt:</span> {k.olusturmaTarihi}</p>
                      {k.sonGiris && <p><span className="font-medium">Son giriş:</span> {k.sonGiris}</p>}
                      {k.firmaAdi && <p><span className="font-medium">Firma:</span> {k.firmaAdi}</p>}
                    </div>

                    <div className="flex gap-2">
                      {k.plan !== "premium" ? (
                        <button
                          onClick={() => planGuncelle(k.uid, "premium")}
                          disabled={yukleniyor_plan === k.uid}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
                        >
                          {yukleniyor_plan === k.uid ? (
                            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                          ) : (
                            <Crown size={11} />
                          )}
                          Premium Yap
                        </button>
                      ) : (
                        <button
                          onClick={() => planGuncelle(k.uid, "ucretsiz")}
                          disabled={yukleniyor_plan === k.uid}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-50 transition-colors"
                        >
                          {yukleniyor_plan === k.uid ? (
                            <div className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                          ) : (
                            <UserCheck size={11} />
                          )}
                          Ücretsiz'e Düşür
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {toplamSayfa > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setSayfa((p) => Math.max(1, p - 1))}
            disabled={sayfa === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Önceki
          </button>
          <span className="text-sm text-slate-500">
            {sayfa} / {toplamSayfa}
          </span>
          <button
            onClick={() => setSayfa((p) => Math.min(toplamSayfa, p + 1))}
            disabled={sayfa === toplamSayfa}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
