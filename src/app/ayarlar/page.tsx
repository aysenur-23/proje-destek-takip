"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Bell,
  Crown,
  Shield,
  LogOut,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BildirimTercihleri {
  emailEtkin: boolean;
  sonTarihGunleri: number;
  haftaOzeti: boolean;
  yeniProgram: boolean;
}

const VARSAYILAN_TERCIHLER: BildirimTercihleri = {
  emailEtkin: true,
  sonTarihGunleri: 14,
  haftaOzeti: true,
  yeniProgram: true,
};

type Bildirim = { turu: "basari" | "hata" | "bilgi"; mesaj: string };

export default function AyarlarSayfasi() {
  const router = useRouter();
  const { kullanici, firebaseUser, cikisYap } = useAuth();

  const [tercihler, setTercihler] = useState<BildirimTercihleri>(VARSAYILAN_TERCIHLER);
  const [tercihlerYukleniyor, setTercihlerYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);

  const [sifreSifirlamaGonderildi, setSifreSifirlamaGonderildi] = useState(false);
  const [hesapSilOnay, setHesapSilOnay] = useState(false);

  // Mevcut bildirimleri yükle
  useEffect(() => {
    if (!firebaseUser) {
      setTercihlerYukleniyor(false);
      return;
    }

    let aktif = true;
    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        if (!db) { setTercihlerYukleniyor(false); return; }

        const snap = await getDoc(
          doc(db, "kullanicilar", firebaseUser.uid, "tercihler", "bildirim")
        );
        if (aktif && snap.exists()) {
          setTercihler({ ...VARSAYILAN_TERCIHLER, ...(snap.data() as BildirimTercihleri) });
        }
      } finally {
        if (aktif) setTercihlerYukleniyor(false);
      }
    })();

    return () => { aktif = false; };
  }, [firebaseUser]);

  async function tercihleriKaydet() {
    if (!firebaseUser) return;
    setKaydediliyor(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      if (!db) throw new Error("Firestore bağlantısı yok");

      await setDoc(
        doc(db, "kullanicilar", firebaseUser.uid, "tercihler", "bildirim"),
        { ...tercihler, guncellenmeTarihi: serverTimestamp() },
        { merge: true }
      );
      goster("basari", "Bildirim tercihleri kaydedildi.");
    } catch {
      goster("hata", "Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sifreSifirlamaGonder() {
    if (!firebaseUser?.email) return;
    try {
      const { auth } = await import("@/lib/firebase");
      const { sendPasswordResetEmail } = await import("firebase/auth");
      if (!auth) throw new Error();
      await sendPasswordResetEmail(auth, firebaseUser.email);
      setSifreSifirlamaGonderildi(true);
      goster("basari", "Şifre sıfırlama e-postası gönderildi.");
    } catch {
      goster("hata", "E-posta gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  async function hesapSil() {
    if (!firebaseUser) return;
    try {
      await firebaseUser.delete();
      router.push("/");
    } catch {
      goster("hata", "Hesap silinemedi. Önce tekrar giriş yapmanız gerekebilir.");
    }
  }

  async function cikisYapVeYonlendir() {
    await cikisYap();
    router.push("/");
  }

  function goster(turu: Bildirim["turu"], mesaj: string) {
    setBildirim({ turu, mesaj });
    setTimeout(() => setBildirim(null), 4000);
  }

  // Giriş yapılmamışsa yönlendir
  if (!firebaseUser && !tercihlerYukleniyor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-4">
            <Shield size={24} className="text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Giriş Gerekli</h1>
          <p className="text-slate-500 text-sm mb-6">
            Hesap ayarlarına erişmek için giriş yapmanız gerekiyor.
          </p>
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const planEtiketi = kullanici?.plan === "premium" ? "Premium" : "Ücretsiz";
  const planRenk =
    kullanici?.plan === "premium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Başlık */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-8 max-w-2xl">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hesap Ayarları</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bildirimlerinizi, planınızı ve hesap güvenliğinizi yönetin.
          </p>
        </div>
      </div>

      {/* Bildirim banner */}
      {bildirim && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            bildirim.turu === "basari"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : bildirim.turu === "hata"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {bildirim.turu === "basari" ? (
            <CheckCircle2 size={15} className="shrink-0" />
          ) : (
            <AlertTriangle size={15} className="shrink-0" />
          )}
          {bildirim.mesaj}
        </div>
      )}

      <div className="container max-w-2xl py-8 space-y-6">
        {/* ─── Profil ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <User size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800">Profil Bilgileri</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold select-none">
                {(kullanici?.ad ?? firebaseUser?.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {kullanici?.ad ?? "Kullanıcı"}
                </p>
                <p className="text-sm text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} />
                  {firebaseUser?.email ?? kullanici?.email}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${planRenk}`}
              >
                {planEtiketi}
              </span>
            </div>
            {kullanici?.premiumBitisTarihi && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2.5 text-sm text-amber-700">
                <Calendar size={14} />
                <span>
                  Premium{" "}
                  {new Date(kullanici.premiumBitisTarihi).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  tarihine kadar aktif
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ─── Bildirim Tercihleri ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <Bell size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800">E-posta Bildirimleri</h2>
          </div>
          <div className="p-6 space-y-5">
            {tercihlerYukleniyor ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                Yükleniyor…
              </div>
            ) : (
              <>
                {/* Ana açma/kapama */}
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      E-posta bildirimlerini etkinleştir
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Son tarih hatırlatıcıları ve güncellemeler
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={tercihler.emailEtkin}
                    onClick={() =>
                      setTercihler((p) => ({ ...p, emailEtkin: !p.emailEtkin }))
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      tercihler.emailEtkin ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        tercihler.emailEtkin ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>

                {tercihler.emailEtkin && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    {/* Son tarih eşiği */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">
                        Son tarih hatırlatıcısı
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Son başvuru tarihinden kaç gün önce e-posta gönderilsin?
                      </p>
                      <select
                        value={tercihler.sonTarihGunleri}
                        onChange={(e) =>
                          setTercihler((p) => ({
                            ...p,
                            sonTarihGunleri: Number(e.target.value),
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[7, 14, 21, 30].map((g) => (
                          <option key={g} value={g}>
                            {g} gün önce
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Haftalık özet */}
                    <label className="flex items-center justify-between gap-4 cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Haftalık özet
                        </p>
                        <p className="text-xs text-slate-500">
                          Her Pazartesi uygun programların özeti
                        </p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={tercihler.haftaOzeti}
                        onClick={() =>
                          setTercihler((p) => ({ ...p, haftaOzeti: !p.haftaOzeti }))
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          tercihler.haftaOzeti ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            tercihler.haftaOzeti ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>

                    {/* Yeni program */}
                    <label className="flex items-center justify-between gap-4 cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Yeni program bildirimi
                        </p>
                        <p className="text-xs text-slate-500">
                          Firma profilinize uygun yeni program açıldığında
                        </p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={tercihler.yeniProgram}
                        onClick={() =>
                          setTercihler((p) => ({ ...p, yeniProgram: !p.yeniProgram }))
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          tercihler.yeniProgram ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            tercihler.yeniProgram ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={tercihleriKaydet}
                    disabled={kaydediliyor}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {kaydediliyor ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Kaydediliyor…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        Kaydet
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ─── Plan ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <Crown size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800">Abonelik Planı</h2>
          </div>
          <div className="p-6">
            {kullanici?.plan === "premium" ? (
              <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <Crown size={20} className="text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900">Premium Plan Aktif</p>
                  {kullanici.premiumBitisTarihi && (
                    <p className="text-xs text-amber-700 mt-0.5">
                      Bitiş:{" "}
                      {new Date(kullanici.premiumBitisTarihi).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Ücretsiz Plan</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI analiz, Proje Asistanı ve öncelikli güncellemeler için Premium&apos;a geçin.
                  </p>
                </div>
                <Link
                  href="/planlar"
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Crown size={13} />
                  Premium&apos;a Geç
                  <ChevronRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── Güvenlik ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <Shield size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800">Güvenlik</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {/* Şifre sıfırla */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <KeyRound size={15} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Şifre Değiştir</p>
                  <p className="text-xs text-slate-500">E-posta ile sıfırlama bağlantısı gönderilir</p>
                </div>
              </div>
              <button
                onClick={sifreSifirlamaGonder}
                disabled={sifreSifirlamaGonderildi}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {sifreSifirlamaGonderildi ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    Gönderildi
                  </>
                ) : (
                  "E-posta Gönder"
                )}
              </button>
            </div>

            {/* Çıkış yap */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <LogOut size={15} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Çıkış Yap</p>
                  <p className="text-xs text-slate-500">Bu cihazdan oturumu kapat</p>
                </div>
              </div>
              <button
                onClick={cikisYapVeYonlendir}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={12} />
                Çıkış
              </button>
            </div>
          </div>
        </section>

        {/* ─── Tehlikeli Bölge ─── */}
        <section className="rounded-2xl border border-red-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-100">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm font-bold text-red-700">Tehlikeli Bölge</h2>
          </div>
          <div className="p-6">
            {!hesapSilOnay ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Hesabı Sil</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                  </p>
                </div>
                <button
                  onClick={() => setHesapSilOnay(true)}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} />
                  Hesabı Sil
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 p-4">
                  <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    <strong>Emin misiniz?</strong> Tüm başvuru takipleriniz, firma profiliniz ve
                    AI analizleriniz kalıcı olarak silinecek. Bu işlem geri alınamaz.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setHesapSilOnay(false)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={hesapSil}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    <Trash2 size={12} />
                    Evet, Hesabı Kalıcı Olarak Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
