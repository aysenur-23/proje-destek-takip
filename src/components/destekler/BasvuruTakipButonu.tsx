"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type BasvuruDurumu = "basvurulmadi" | "planlandı" | "basvuruldu" | "kabul" | "red";

const DURUM_ETIKET: Record<BasvuruDurumu, string> = {
  basvurulmadi: "Takibe Al",
  planlandı: "Planlandı",
  basvuruldu: "Başvuruldu",
  kabul: "Kabul Edildi ✓",
  red: "Reddedildi",
};

const DURUM_STIL: Record<BasvuruDurumu, string> = {
  basvurulmadi: "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600",
  planlandı: "border-amber-200 bg-amber-50 text-amber-700",
  basvuruldu: "border-blue-200 bg-blue-50 text-blue-700",
  kabul: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-600",
};

const SIRADAKI_DURUM: BasvuruDurumu[] = ["planlandı", "basvuruldu", "kabul", "red", "basvurulmadi"];

interface Props {
  destekSlug: string;
  destekAdi: string;
}

export function BasvuruTakipButonu({ destekSlug, destekAdi }: Props) {
  const { firebaseUser } = useAuth();
  const [durum, setDurum] = useState<BasvuruDurumu>("basvurulmadi");
  const [acik, setAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const storageKey = `basvuru_${destekSlug}`;

  // Yükle
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setDurum(stored as BasvuruDurumu);
  }, [storageKey]);

  // Firestore'dan yükle (giriş yapıldıysa)
  useEffect(() => {
    if (!firebaseUser) return;
    const yukle = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        if (!db) return;
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "kullanicilar", firebaseUser.uid, "basvurular", destekSlug));
        if (snap.exists()) {
          const d = snap.data().durum as BasvuruDurumu;
          setDurum(d);
          localStorage.setItem(storageKey, d);
        }
      } catch { /* sessiz hata */ }
    };
    yukle();
  }, [firebaseUser, destekSlug, storageKey]);

  async function durumDegistir(yeniDurum: BasvuruDurumu) {
    setDurum(yeniDurum);
    setAcik(false);
    localStorage.setItem(storageKey, yeniDurum);
    setKaydediliyor(true);

    if (firebaseUser) {
      try {
        const { db } = await import("@/lib/firebase");
        if (db) {
          const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
          if (yeniDurum === "basvurulmadi") {
            const { deleteDoc } = await import("firebase/firestore");
            await deleteDoc(doc(db, "kullanicilar", firebaseUser.uid, "basvurular", destekSlug));
          } else {
            await setDoc(doc(db, "kullanicilar", firebaseUser.uid, "basvurular", destekSlug), {
              destekSlug,
              destekAdi,
              durum: yeniDurum,
              guncellenmeTarihi: serverTimestamp(),
            });
          }
        }
      } catch { /* sessiz hata — localStorage yeterli */ }
    }
    setKaydediliyor(false);
  }

  return (
    <div className="relative inline-block">
      {/* Ana buton */}
      <div className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer select-none",
        DURUM_STIL[durum],
        kaydediliyor && "opacity-60 pointer-events-none",
      )}>
        <button
          onClick={() => {
            if (durum === "basvurulmadi") {
              setAcik((v) => !v);
            } else {
              setAcik((v) => !v);
            }
          }}
          className="flex items-center gap-2"
          aria-expanded={acik}
          aria-haspopup="listbox"
        >
          {durum === "basvurulmadi" ? (
            <Clock size={14} className="shrink-0" />
          ) : (
            <CheckCircle2 size={14} className="shrink-0" />
          )}
          {DURUM_ETIKET[durum]}
          <ChevronDown size={12} className={cn("transition-transform", acik && "rotate-180")} />
        </button>
      </div>

      {/* Dropdown */}
      {acik && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAcik(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 overflow-hidden animate-fade-in">
            {SIRADAKI_DURUM.map((d) => (
              <button
                key={d}
                onClick={() => durumDegistir(d)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-slate-50",
                  d === durum && "bg-blue-50 text-blue-700 font-semibold",
                )}
              >
                <span className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  d === "basvurulmadi" && "bg-slate-300",
                  d === "planlandı" && "bg-amber-400",
                  d === "basvuruldu" && "bg-blue-500",
                  d === "kabul" && "bg-emerald-500",
                  d === "red" && "bg-red-400",
                )} />
                {DURUM_ETIKET[d]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
