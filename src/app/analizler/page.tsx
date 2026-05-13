"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, History, Sparkles, ChevronRight, Clock, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AnalizKaydi {
  id: string;
  hedefDestekSlug: string;
  destekAdi: string;
  raporOzeti: string;
  olusturulmaZamani: string;
  sonuc?: {
    genelPuan?: number;
    genelYorum?: string;
    oncelikliDuzeltmeler?: string[];
  };
}

export default function AnalizlerSayfasi() {
  const { firebaseUser, yukleniyor } = useAuth();
  const router = useRouter();
  const [analizler, setAnalizler] = useState<AnalizKaydi[]>([]);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (yukleniyor) return;
    if (!firebaseUser) {
      router.replace("/giris?geri=/analizler");
      return;
    }

    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");
        if (!db) throw new Error("Firebase bağlantısı yok");

        const q = query(
          collection(db, "kullanicilar", firebaseUser.uid, "analizler"),
          orderBy("olusturulmaZamani", "desc"),
          limit(20),
        );
        const snap = await getDocs(q);
        const kayitlar: AnalizKaydi[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AnalizKaydi, "id">),
        }));
        setAnalizler(kayitlar);
      } catch (err) {
        console.error("Analizler yüklenemedi:", err);
        setHata("Analiz geçmişi yüklenirken bir hata oluştu.");
      } finally {
        setVeriYukleniyor(false);
      }
    })();
  }, [firebaseUser, yukleniyor, router]);

  if (yukleniyor || (!firebaseUser && !hata)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container max-w-3xl py-10">
          <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-64 rounded-lg bg-slate-100 animate-pulse mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 mb-3 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Başlık */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container max-w-3xl py-6">
          <Link
            href="/proje-asistani"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Proje Asistanı&apos;na Dön
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <History size={18} className="text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Analiz Geçmişi</h1>
              <p className="text-sm text-slate-500">
                {veriYukleniyor ? "Yükleniyor…" : `${analizler.length} analiz`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-6">
        {hata && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={15} />
            {hata}
          </div>
        )}

        {!veriYukleniyor && analizler.length === 0 && !hata && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <h2 className="mb-1 text-base font-semibold text-slate-700">Henüz analiz yok</h2>
            <p className="mb-6 text-sm text-slate-500 max-w-xs">
              Proje Asistanı&apos;nı kullanarak ilk AI analizinizi yapın. Tüm analizleriniz burada saklanır.
            </p>
            <Link
              href="/proje-asistani"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              <Sparkles size={14} />
              İlk Analizi Yap
            </Link>
          </div>
        )}

        {veriYukleniyor ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {analizler.map((analiz) => {
              const tarih = new Date(analiz.olusturulmaZamani);
              const puan = analiz.sonuc?.genelPuan;
              const puanRengi =
                puan == null ? "text-slate-400" :
                puan >= 70 ? "text-emerald-600" :
                puan >= 50 ? "text-amber-600" :
                "text-red-500";

              return (
                <Link
                  key={analiz.id}
                  href={`/proje-asistani?destek=${analiz.hedefDestekSlug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                        <FileText size={14} className="text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{analiz.destekAdi}</p>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                          {analiz.raporOzeti || "Rapor özeti yok"}
                        </p>
                        {analiz.sonuc?.genelYorum && (
                          <p className="mt-1 text-[11px] text-violet-700 italic line-clamp-1">
                            &ldquo;{analiz.sonuc.genelYorum}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {puan != null && (
                        <span className={cn("text-lg font-black", puanRengi)}>%{puan}</span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock size={9} />
                        {tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
