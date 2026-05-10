"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, firebaseReady } from "@/lib/firebase";
import { tumDestekler } from "@/data/destekler";
import {
  Users,
  Building2,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Activity,
  Crown,
  AlertCircle,
} from "lucide-react";

interface Istatistik {
  toplamKullanici: number;
  premiumKullanici: number;
  firmaProfilSayisi: number;
  aiKullanimSayisi: number;
  aktifProgram: number;
  overrideSayisi: number;
  sonKayitlar: { ad: string; email: string; plan: string; tarih: string }[];
  yukleniyor: boolean;
  hata: string | null;
}

export default function AdminDashboard() {
  const [stat, setStat] = useState<Istatistik>({
    toplamKullanici: 0,
    premiumKullanici: 0,
    firmaProfilSayisi: 0,
    aiKullanimSayisi: 0,
    aktifProgram: tumDestekler.filter((d) => d.aktif).length,
    overrideSayisi: 0,
    sonKayitlar: [],
    yukleniyor: true,
    hata: null,
  });

  useEffect(() => {
    const yukle = async () => {
      if (!firebaseReady || !db) {
        setStat((s) => ({ ...s, yukleniyor: false, hata: "Firebase bağlı değil — yerel mod" }));
        return;
      }
      try {
        const { collection, getDocs, query, orderBy, limit, getCountFromServer } =
          await import("firebase/firestore");

        // Kullanıcı sayıları
        const kullaniciCol = collection(db, "kullanicilar");
        const [toplamSnap, sonKayitSnap, overrideSnap] = await Promise.all([
          getCountFromServer(kullaniciCol),
          getDocs(query(kullaniciCol, orderBy("olusturmaTarihi", "desc"), limit(5))),
          getDocs(collection(db, "destekOverrides")),
        ]);

        const toplamKullanici = toplamSnap.data().count;
        const overrideSayisi = overrideSnap.size;

        // Son kayıtlar + premium sayısı
        let premiumKullanici = 0;
        const sonKayitlar: Istatistik["sonKayitlar"] = [];
        sonKayitSnap.forEach((doc) => {
          const d = doc.data();
          if (d.plan === "premium") premiumKullanici++;
          sonKayitlar.push({
            ad: d.ad ?? "—",
            email: d.email ?? "—",
            plan: d.plan ?? "ucretsiz",
            tarih: d.olusturmaTarihi?.toDate?.()?.toLocaleDateString("tr-TR") ?? "—",
          });
        });

        // Firma profili sayısı — collectionGroup ile
        let firmaProfilSayisi = 0;
        try {
          const { collectionGroup } = await import("firebase/firestore");
          const firmaSnap = await getCountFromServer(
            query(collectionGroup(db, "profil"))
          );
          firmaProfilSayisi = firmaSnap.data().count;
        } catch {
          // collectionGroup index yoksa sessizce geç
        }

        // AI kullanım — ileride log koleksiyonundan çekilecek
        const aiKullanimSayisi = 0;

        setStat({
          toplamKullanici,
          premiumKullanici,
          firmaProfilSayisi,
          aiKullanimSayisi,
          aktifProgram: tumDestekler.filter((d) => d.aktif).length,
          overrideSayisi,
          sonKayitlar,
          yukleniyor: false,
          hata: null,
        });
      } catch (e) {
        setStat((s) => ({
          ...s,
          yukleniyor: false,
          hata: `Firestore okuma hatası: ${e instanceof Error ? e.message : "bilinmiyor"}`,
        }));
      }
    };

    yukle();
  }, []);

  const kartlar = [
    {
      etiket: "Toplam Kullanıcı",
      deger: stat.yukleniyor ? "…" : stat.toplamKullanici.toLocaleString("tr-TR"),
      alt: `${stat.premiumKullanici} premium`,
      ikon: Users,
      renk: "blue",
      href: "/admin/kullanicilar",
    },
    {
      etiket: "Firma Profili",
      deger: stat.yukleniyor ? "…" : stat.firmaProfilSayisi.toLocaleString("tr-TR"),
      alt: "doldurulmuş profil",
      ikon: Building2,
      renk: "teal",
      href: "/admin/firmalar",
    },
    {
      etiket: "Aktif Program",
      deger: stat.yukleniyor ? "…" : stat.aktifProgram.toLocaleString("tr-TR"),
      alt: `${tumDestekler.length} toplam · ${stat.overrideSayisi} override`,
      ikon: BookOpen,
      renk: "violet",
      href: "/admin/destekler",
    },
    {
      etiket: "Premium Üye",
      deger: stat.yukleniyor ? "…" : stat.premiumKullanici.toLocaleString("tr-TR"),
      alt: stat.toplamKullanici > 0
        ? `%${Math.round((stat.premiumKullanici / stat.toplamKullanici) * 100)} oran`
        : "—",
      ikon: Crown,
      renk: "amber",
      href: "/admin/kullanicilar",
    },
  ] as const;

  const renkHarita: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Genel Bakış</h1>
        <p className="text-sm text-slate-500 mt-0.5">Site geneli istatistikler ve hızlı erişim</p>
      </div>

      {/* Hata / uyarı */}
      {stat.hata && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle size={15} className="shrink-0" />
          {stat.hata}
        </div>
      )}

      {/* Stat kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kartlar.map((k) => (
          <Link
            key={k.etiket}
            href={k.href}
            className="card p-4 flex items-start gap-3 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${renkHarita[k.renk]}`}>
              <k.ikon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-slate-900 leading-none">{k.deger}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{k.etiket}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{k.alt}</p>
            </div>
            <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 mt-1" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Son kayıtlar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Activity size={15} className="text-blue-500" />
              Son Kayıtlar
            </h2>
            <Link href="/admin/kullanicilar" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Tümü <ArrowRight size={11} />
            </Link>
          </div>

          {stat.yukleniyor ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 rounded bg-slate-100 animate-pulse" />
                    <div className="h-2.5 w-1/3 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : stat.sonKayitlar.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Henüz kayıtlı kullanıcı yok</p>
          ) : (
            <div className="space-y-2">
              {stat.sonKayitlar.map((k, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {k.ad.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{k.ad}</p>
                    <p className="text-xs text-slate-400 truncate">{k.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {k.plan === "premium" ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <Crown size={8} />
                        Premium
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Ücretsiz</span>
                    )}
                    <p className="text-[10px] text-slate-300 mt-0.5">{k.tarih}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hızlı işlemler */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-violet-500" />
            Hızlı İşlemler
          </h2>
          <div className="space-y-2">
            {[
              {
                href: "/admin/kullanicilar",
                baslik: "Kullanıcı Planlarını Yönet",
                aciklama: "Ücretsiz → Premium yükseltme, kullanıcı ara",
                ikon: Users,
                renk: "blue",
              },
              {
                href: "/admin/firmalar",
                baslik: "Firma Profillerini Gör",
                aciklama: "Sektör & bölge dağılımı, firma detayları",
                ikon: Building2,
                renk: "teal",
              },
              {
                href: "/admin/destekler",
                baslik: "Destek Programlarını Düzenle",
                aciklama: "Aktif/pasif, tarih güncelle, yeni program ekle",
                ikon: BookOpen,
                renk: "violet",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${renkHarita[item.renk]} mt-0.5`}>
                  <item.ikon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                    {item.baslik}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.aciklama}</p>
                </div>
                <ArrowRight size={13} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
              </Link>
            ))}
          </div>

          {/* Site durumu */}
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-emerald-700">Sistem Aktif</span>
              <span className="text-emerald-600 ml-1.5">·</span>
              <span className="text-emerald-600 ml-1.5">{stat.aktifProgram} program · {tumDestekler.length} toplam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
