"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Search,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  ArrowRight,
  FileText,
  User,
  Crown,
  AlertCircle,
  Brain,
  Bell,
  BellOff,
  Download,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tumDestekler } from "@/data/destekler";
import { blogYazilari as blogYazilariListesi } from "@/data/blog";
import { tumDestekleriFiltrele } from "@/lib/filtrele";
import type { FirmaProfili, DestekKategori } from "@/types";
import { db, firebaseReady } from "@/lib/firebase";

type BasvuruDurumu = "basvurulmadi" | "planlandı" | "basvuruldu" | "degerlendirmede" | "kabul" | "red";

interface KayitliDestek {
  slug: string;
  kaydedilmeTarihi: string;
  durum?: BasvuruDurumu;
}

interface AnalizKaydi {
  id: string;
  hedefDestekSlug: string;
  hedefDestekAdi: string;
  raporOzeti: string;
  genelPuan: number;
  olusturmaTarihi: { seconds: number } | string;
}

interface BildirimTercihleri {
  emailBildirim: boolean;
  sonTarihHatirlat: boolean;
  yeniProgramBildir: boolean;
}

const DURUM_CONFIG: Record<BasvuruDurumu, { label: string; icon: React.ReactNode; cls: string }> = {
  basvurulmadi: { label: "Takip Edilmiyor", icon: <Clock size={12} />, cls: "text-slate-500 bg-slate-50 border-slate-200" },
  planlandı: { label: "Planlandı", icon: <Clock size={12} />, cls: "text-amber-600 bg-amber-50 border-amber-200" },
  basvuruldu: { label: "Başvuruldu", icon: <Clock size={12} />, cls: "text-blue-600 bg-blue-50 border-blue-200" },
  degerlendirmede: { label: "Değerlendirmede", icon: <AlertCircle size={12} />, cls: "text-amber-600 bg-amber-50 border-amber-200" },
  kabul: { label: "Kabul", icon: <CheckCircle2 size={12} />, cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  red: { label: "Reddedildi", icon: <XCircle size={12} />, cls: "text-red-600 bg-red-50 border-red-200" },
};

const KATEGORI_RENK: Record<DestekKategori, string> = {
  TUBITAK: "bg-violet-100 text-violet-700",
  KOSGEB: "bg-blue-100 text-blue-700",
  TKDK: "bg-green-100 text-green-700",
  AB: "bg-sky-100 text-sky-700",
  SGK: "bg-orange-100 text-orange-700",
  TEKNOKENT: "bg-purple-100 text-purple-700",
  KALKINMA: "bg-teal-100 text-teal-700",
  TICARET: "bg-indigo-100 text-indigo-700",
  SANAYI: "bg-rose-100 text-rose-700",
  TARIM: "bg-lime-100 text-lime-700",
  DIGER: "bg-slate-100 text-slate-600",
};

export default function DashboardSayfasi() {
  const { kullanici, firebaseUser, yukleniyor } = useAuth();
  const router = useRouter();

  const [firma, setFirma] = useState<FirmaProfili | null>(null);
  const [kayitliDestekler, setKayitliDestekler] = useState<KayitliDestek[]>([]);
  const [analizler, setAnalizler] = useState<AnalizKaydi[]>([]);
  const [bildirimler, setBildirimler] = useState<BildirimTercihleri>({
    emailBildirim: false,
    sonTarihHatirlat: true,
    yeniProgramBildir: false,
  });
  const [bildirimKaydediliyor, setBildirimKaydediliyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!yukleniyor && !firebaseUser) {
      router.replace("/giris?donus=/dashboard");
    }
  }, [yukleniyor, firebaseUser, router]);

  // Firma + kayıtlı destekler yükle
  useEffect(() => {
    if (!firebaseUser || !firebaseReady || !db) {
      // Firebase yoksa localStorage'a bak
      const local = typeof window !== "undefined" ? localStorage.getItem("firmaProfili") : null;
      if (local) {
        try { setFirma(JSON.parse(local)); } catch { /* ignore */ }
      }
      // BasvuruTakipButonu'nun localStorage kayıtlarını oku (basvuru_* anahtarları)
      if (typeof window !== "undefined") {
        const takipListesi: KayitliDestek[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("basvuru_")) {
            const slug = key.replace("basvuru_", "");
            const durum = localStorage.getItem(key) as BasvuruDurumu | null;
            if (durum && durum !== "basvurulmadi") {
              takipListesi.push({ slug, kaydedilmeTarihi: new Date().toISOString(), durum });
            }
          }
        }
        if (takipListesi.length > 0) setKayitliDestekler(takipListesi);
      }
      setVeriYukleniyor(false);
      return;
    }

    let mounted = true;
    const yukle = async () => {
      try {
        const { doc, getDoc, collection, getDocs, orderBy, query, limit } = await import("firebase/firestore");

        // Firma profili
        const firmaSnap = await getDoc(doc(db!, "kullanicilar", firebaseUser.uid, "profil", "firma"));
        if (mounted && firmaSnap.exists()) {
          setFirma(firmaSnap.data() as FirmaProfili);
        } else if (mounted) {
          const local = typeof window !== "undefined" ? localStorage.getItem("firmaProfili") : null;
          if (local) {
            try { setFirma(JSON.parse(local)); } catch { /* ignore */ }
          }
        }

        // BasvuruTakipButonu kayıtları (basvurular subcollection)
        try {
          const basvuruSnap = await getDocs(
            collection(db!, "kullanicilar", firebaseUser.uid, "basvurular")
          );
          if (mounted && !basvuruSnap.empty) {
            const liste: KayitliDestek[] = [];
            basvuruSnap.forEach((d) => {
              const data = d.data();
              if (data.durum && data.durum !== "basvurulmadi") {
                liste.push({
                  slug: d.id,
                  kaydedilmeTarihi: data.guncellenmeTarihi?.toDate?.()?.toISOString() ?? new Date().toISOString(),
                  durum: data.durum as BasvuruDurumu,
                });
              }
            });
            liste.sort((a, b) => b.kaydedilmeTarihi.localeCompare(a.kaydedilmeTarihi));
            if (mounted) setKayitliDestekler(liste);
          }
        } catch { /* basvurular koleksiyonu henüz yoksa sessizce geç */ }

        // Kayıtlı destekler (eski koleksiyon — geriye dönük uyumluluk)
        const destekSnap = await getDocs(
          collection(db!, "kullanicilar", firebaseUser.uid, "kayitliDestekler")
        );
        if (mounted) {
          const liste: KayitliDestek[] = [];
          destekSnap.forEach((d) => liste.push(d.data() as KayitliDestek));
          liste.sort((a, b) => b.kaydedilmeTarihi.localeCompare(a.kaydedilmeTarihi));
          if (liste.length > 0) setKayitliDestekler((prev) => {
            const mevcutSluglar = new Set(prev.map((k) => k.slug));
            const yeni = liste.filter((l) => !mevcutSluglar.has(l.slug));
            return [...prev, ...yeni];
          });
        }

        // AI Analiz geçmişi (son 5)
        try {
          const analizSnap = await getDocs(
            query(
              collection(db!, "kullanicilar", firebaseUser.uid, "analizler"),
              orderBy("olusturmaTarihi", "desc"),
              limit(5),
            ),
          );
          if (mounted) {
            const liste: AnalizKaydi[] = [];
            analizSnap.forEach((d) => liste.push({ id: d.id, ...d.data() } as AnalizKaydi));
            setAnalizler(liste);
          }
        } catch { /* analizler koleksiyonu henüz yoksa sessizce geç */ }

        // Bildirim tercihleri
        try {
          const bildirimSnap = await getDoc(
            doc(db!, "kullanicilar", firebaseUser.uid, "tercihler", "bildirim")
          );
          if (mounted && bildirimSnap.exists()) {
            setBildirimler(bildirimSnap.data() as BildirimTercihleri);
          }
        } catch { /* tercihler henüz yoksa varsayılan kullan */ }

      } catch {
        // Sessizce geç
      } finally {
        if (mounted) setVeriYukleniyor(false);
      }
    };

    yukle();
    return () => { mounted = false; };
  }, [firebaseUser]);

  async function bildirimKaydet(yeni: BildirimTercihleri) {
    setBildirimler(yeni);
    if (!firebaseUser || !db) return;
    setBildirimKaydediliyor(true);
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "kullanicilar", firebaseUser.uid, "tercihler", "bildirim"), yeni);
    } catch { /* sessizce geç */ }
    finally { setBildirimKaydediliyor(false); }
  }

  // Uygun destek sayısı (firma varsa)
  const uygunDestekler = firma
    ? tumDestekleriFiltrele(firma, tumDestekler.filter((d) => d.aktif)).filter((s) => s.uygunMu)
    : [];

  const topDestekler = uygunDestekler
    .sort((a, b) => b.uygunlukSkoru - a.uygunlukSkoru)
    .slice(0, 5);

  // Yaklaşan son tarihler (uygun destekler arasından 45 gün içinde kapananlar)
  const bugun = new Date();
  const yaklaşanSonTarihler = uygunDestekler
    .filter(({ destek }) => {
      if (!destek.basvuruBitis) return false;
      const bitis = new Date(destek.basvuruBitis);
      const kalanMs = bitis.getTime() - bugun.getTime();
      return kalanMs > 0 && kalanMs <= 45 * 24 * 60 * 60 * 1000;
    })
    .map(({ destek }) => ({
      destek,
      kalanGun: Math.ceil((new Date(destek.basvuruBitis!).getTime() - bugun.getTime()) / (24 * 60 * 60 * 1000)),
    }))
    .sort((a, b) => a.kalanGun - b.kalanGun)
    .slice(0, 4);

  // Blog önerileri (firma sektörü/özelliğine göre)
  const blogOneriler = (() => {
    if (!firma) return blogYazilariListesi.slice(0, 3);
    if (firma.argeYapiyorMu || firma.teknokentteMi) {
      return blogYazilariListesi.slice(0, 3); // Ar-Ge odaklı
    }
    return blogYazilariListesi.slice(0, 3);
  })();

  if (yukleniyor || veriYukleniyor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) return null;

  const adSoyad = kullanici?.ad ?? firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Kullanıcı";
  const premium = kullanici?.plan === "premium";

  return (
    <>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <LayoutDashboard size={15} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Kontrol Paneli
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Merhaba, {adSoyad.split(" ")[0]} 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {firma
                  ? `${firma.ad} · ${uygunDestekler.length} uygun program bulundu`
                  : "Firma profilinizi oluşturarak uygun destekleri keşfedin"}
              </p>
            </div>
            {premium ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 shrink-0 self-start sm:self-auto">
                <Crown size={13} />
                Premium Üye
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 shrink-0 self-start sm:self-auto">
                <User size={12} />
                Ücretsiz Plan
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-6xl space-y-8">
        {/* Stat kartları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatKart
            ikon={<Search size={16} />}
            deger={uygunDestekler.length.toString()}
            etiket="Uygun Program"
            renk="blue"
            href="/destekler?uygun=1"
          />
          <StatKart
            ikon={<Star size={16} />}
            deger={kayitliDestekler.length.toString()}
            etiket="Başvuru Takibi"
            renk="violet"
          />
          <StatKart
            ikon={<Brain size={16} />}
            deger={analizler.length.toString()}
            etiket="AI Analizi"
            renk="emerald"
          />
          <StatKart
            ikon={<TrendingUp size={16} />}
            deger={firma ? `%${Math.round(uygunDestekler[0]?.uygunlukSkoru ?? 0)}` : "—"}
            etiket="En Yüksek Uyum"
            renk="amber"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Sol kolon */}
          <div className="space-y-6">
            {/* Firma profili kartı */}
            {firma ? (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    Firma Profili
                  </h2>
                  <Link
                    href="/firma"
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Düzenle <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <ProfilSatir etiket="Firma Adı" deger={firma.ad} />
                  <ProfilSatir etiket="Şirket Türü" deger={firma.sirketTuru} />
                  <ProfilSatir etiket="Çalışan" deger={firma.calısanSayisi.toLocaleString("tr-TR")} />
                  <ProfilSatir etiket="Ciro" deger={`₺${(firma.yillikCiro / 1_000_000).toFixed(1)}M`} />
                  <ProfilSatir etiket="Sektör" deger={firma.sektorKodu} />
                  <ProfilSatir etiket="İl" deger={firma.il} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {firma.argeYapiyorMu && <Rozet renk="violet">Ar-Ge</Rozet>}
                  {firma.teknokentteMi && <Rozet renk="blue">Teknokent</Rozet>}
                  {firma.ihracatYapiyorMu && <Rozet renk="sky">İhracat</Rozet>}
                  {firma.osbdeMi && <Rozet renk="teal">OSB</Rozet>}
                  {firma.kadinGirisimci && <Rozet renk="pink">Kadın Girişimci</Rozet>}
                  {firma.gencGirisimci && <Rozet renk="orange">Genç Girişimci</Rozet>}
                </div>
              </div>
            ) : (
              <div className="card p-6 flex flex-col items-center text-center gap-4 border-dashed border-2 border-slate-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Building2 size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Firma Profili Oluşturun</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Şirket bilgilerinizi girerek size özel destekleri keşfedin
                  </p>
                </div>
                <Link
                  href="/firma"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Profil Oluştur <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* En iyi eşleşmeler */}
            {topDestekler.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-600" />
                    En İyi Eşleşmeler
                  </h2>
                  <Link
                    href="/destekler?uygun=1"
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Tümünü Gör <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="space-y-2">
                  {topDestekler.map(({ destek, uygunlukSkoru }) => (
                    <Link
                      key={destek.slug}
                      href={`/destekler/${destek.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="shrink-0">
                        <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${KATEGORI_RENK[destek.kategori]}`}>
                          {destek.kategori}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                          {destek.ad}
                        </p>
                        <p className="text-xs text-slate-500">{destek.kurum}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <SkorCubugu skor={uygunlukSkoru} />
                        <span className="text-xs font-semibold text-slate-700 w-8 text-right">
                          %{Math.round(uygunlukSkoru)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Kayıtlı destekler */}
            {kayitliDestekler.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <Star size={16} className="text-amber-500" />
                  Başvuru Takibi
                </h2>
                <div className="space-y-2">
                  {kayitliDestekler.map((kd) => {
                    const destek = tumDestekler.find((d) => d.slug === kd.slug);
                    if (!destek) return null;
                    const durumCfg = kd.durum ? DURUM_CONFIG[kd.durum] : null;
                    return (
                      <div key={kd.slug} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{destek.ad}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(kd.kaydedilmeTarihi).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        {durumCfg && (
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${durumCfg.cls}`}>
                            {durumCfg.icon}
                            {durumCfg.label}
                          </span>
                        )}
                        <Link href={`/destekler/${kd.slug}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Analiz Geçmişi */}
            {analizler.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Brain size={16} className="text-violet-600" />
                    AI Analiz Geçmişi
                  </h2>
                  <Link
                    href="/proje-asistani"
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Yeni Analiz <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="space-y-2">
                  {analizler.map((analiz) => {
                    const tarih = typeof analiz.olusturmaTarihi === "string"
                      ? new Date(analiz.olusturmaTarihi)
                      : new Date((analiz.olusturmaTarihi as { seconds: number }).seconds * 1000);
                    const puan = analiz.genelPuan;
                    const puanRenk = puan >= 75 ? "text-emerald-600 bg-emerald-50" : puan >= 50 ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50";
                    return (
                      <Link
                        key={analiz.id}
                        href={`/proje-asistani?destek=${analiz.hedefDestekSlug}`}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${puanRenk}`}>
                          {puan}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-violet-700 transition-colors">
                            {analiz.hedefDestekAdi}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{analiz.raporOzeti}…</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <ExternalLink size={13} className="shrink-0 text-slate-300 group-hover:text-violet-500 mt-1 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Firma yoksa AI analiz CTA */}
            {analizler.length === 0 && firma && (
              <div className="card p-5 border-dashed border-2 border-violet-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Brain size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">AI Proje Analizi Deneyin</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Proje raporunuzu yükleyin, yapay zeka bölüm bazlı öneriler sunsun.
                    </p>
                    <Link
                      href="/proje-asistani"
                      className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                    >
                      <Sparkles size={11} /> Asistanı Aç
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sağ kolon */}
          <div className="space-y-4">
            {/* Hızlı erişim */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-widest text-slate-400">
                Hızlı Erişim
              </h2>
              <div className="space-y-1">
                {[
                  { href: "/firma", ikon: <Building2 size={15} />, etiket: "Firma Profili", aciklama: "Bilgilerini güncelle" },
                  { href: "/destekler", ikon: <Search size={15} />, etiket: "Destekleri Keşfet", aciklama: "Tüm programları gör" },
                  { href: "/proje-asistani", ikon: <Sparkles size={15} />, etiket: "Proje Asistanı", aciklama: "AI ile başvuru geliştir" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {item.ikon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.etiket}</p>
                      <p className="text-xs text-slate-500">{item.aciklama}</p>
                    </div>
                    <ChevronRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* PDF Rapor İndir */}
            {firma && uygunDestekler.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download size={14} className="text-blue-600" />
                  <h2 className="text-sm font-semibold text-slate-800">Uygunluk Raporu</h2>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {uygunDestekler.length} uygun programın listesini PDF olarak indirin veya yazdırın.
                </p>
                <Link
                  href="/rapor"
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <Download size={12} />
                  Raporu Görüntüle
                </Link>
              </div>
            )}

            {/* Yaklaşan Son Tarihler */}
            {yaklaşanSonTarihler.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                  <Clock size={15} className="text-red-500" />
                  Yaklaşan Son Tarihler
                </h2>
                <div className="space-y-2">
                  {yaklaşanSonTarihler.map(({ destek, kalanGun }) => (
                    <Link
                      key={destek.slug}
                      href={`/destekler/${destek.slug}`}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-2.5 hover:border-red-200 hover:bg-red-50/40 transition-all group"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                        kalanGun <= 7 ? "bg-red-100 text-red-700" :
                        kalanGun <= 14 ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {kalanGun}g
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-red-700 transition-colors">
                          {destek.ad}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(destek.basvuruBitis!).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Önerileri */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-400 mb-3 text-xs uppercase tracking-widest flex items-center gap-1.5">
                <FileText size={11} />
                Blog Rehberleri
              </h2>
              <div className="space-y-2">
                {blogOneriler.map((yazi) => (
                  <Link
                    key={yazi.slug}
                    href={`/blog/${yazi.slug}`}
                    className="flex items-start gap-2 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                  >
                    <ArrowRight size={12} className="shrink-0 mt-0.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <p className="text-xs text-slate-600 line-clamp-2 group-hover:text-blue-700 transition-colors leading-relaxed">
                      {yazi.baslik}
                    </p>
                  </Link>
                ))}
                <Link
                  href="/blog"
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-1"
                >
                  Tüm rehberler <ChevronRight size={11} />
                </Link>
              </div>
            </div>

            {/* Bildirim tercihleri */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-400 mb-3 text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Bell size={11} />
                Bildirimler
                {bildirimKaydediliyor && (
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border border-slate-300 border-t-blue-500 ml-auto" />
                )}
              </h2>
              <div className="space-y-2.5">
                {[
                  { alan: "emailBildirim" as keyof BildirimTercihleri, etiket: "E-posta bildirimleri", aciklama: "Tüm bildirimler" },
                  { alan: "sonTarihHatirlat" as keyof BildirimTercihleri, etiket: "Son tarih hatırlatma", aciklama: "7, 3 ve 1 gün önce" },
                  { alan: "yeniProgramBildir" as keyof BildirimTercihleri, etiket: "Yeni program uyarısı", aciklama: "Size uygun açıldığında" },
                ].map((item) => {
                  const aktif = bildirimler[item.alan] as boolean;
                  return (
                    <label
                      key={item.alan}
                      className="flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div>
                        <p className="text-xs font-medium text-slate-700">{item.etiket}</p>
                        <p className="text-[10px] text-slate-400">{item.aciklama}</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={aktif}
                        onClick={() => bildirimKaydet({ ...bildirimler, [item.alan]: !aktif })}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          aktif ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                            aktif ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </label>
                  );
                })}
              </div>
              {!bildirimler.emailBildirim && (
                <p className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
                  <BellOff size={10} />
                  E-posta bildirimleri kapalı
                </p>
              )}
            </div>

            {/* Hesap bilgileri */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-400 mb-3 text-xs uppercase tracking-widest">
                Hesabım
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">E-posta</span>
                  <span className="font-medium text-slate-800 truncate max-w-[160px]" title={firebaseUser.email ?? ""}>
                    {firebaseUser.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan</span>
                  <span className={`font-semibold ${premium ? "text-amber-600" : "text-slate-600"}`}>
                    {premium ? "Premium" : "Ücretsiz"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Üyelik</span>
                  <span className="text-slate-600">
                    {kullanici?.olusturmaTarihi
                      ? new Date(kullanici.olusturmaTarihi).toLocaleDateString("tr-TR")
                      : "—"}
                  </span>
                </div>
              </div>
              {!premium && (
                <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-3">
                  <p className="text-xs font-semibold text-violet-800 mb-1 flex items-center gap-1">
                    <FileText size={11} />
                    Premium Avantajları
                  </p>
                  <ul className="text-xs text-violet-700 space-y-1">
                    <li>· Sınırsız AI proje analizi</li>
                    <li>· Öncelikli destek bildirimleri</li>
                    <li>· Başvuru dosyası şablonları</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Yardımcı bileşenler ──────────────────────────────────────────────────────

function StatKart({
  ikon,
  deger,
  etiket,
  renk,
  href,
}: {
  ikon: React.ReactNode;
  deger: string;
  etiket: string;
  renk: "blue" | "violet" | "emerald" | "amber";
  href?: string;
}) {
  const renkCls = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  }[renk];

  const icerik = (
    <div className="card p-4 flex items-start gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${renkCls}`}>
        {ikon}
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 leading-none mb-0.5">{deger}</p>
        <p className="text-xs text-slate-500">{etiket}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:scale-[1.02] transition-transform">
        {icerik}
      </Link>
    );
  }
  return icerik;
}

function ProfilSatir({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{etiket}</span>
      <span className="text-sm font-medium text-slate-800 truncate">{deger}</span>
    </div>
  );
}

function Rozet({ renk, children }: { renk: string; children: React.ReactNode }) {
  const renkCls: Record<string, string> = {
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    sky: "bg-sky-100 text-sky-700",
    teal: "bg-teal-100 text-teal-700",
    pink: "bg-pink-100 text-pink-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${renkCls[renk] ?? "bg-slate-100 text-slate-600"}`}>
      {children}
    </span>
  );
}

function SkorCubugu({ skor }: { skor: number }) {
  const renk = skor >= 75 ? "bg-emerald-500" : skor >= 50 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
      <div className={`h-full rounded-full ${renk}`} style={{ width: `${skor}%` }} />
    </div>
  );
}
