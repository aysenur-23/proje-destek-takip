"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Mail, Lock, User, AlertCircle, Chrome, CheckCircle2 } from "lucide-react";

export function KayitForm() {
  const router = useRouter();
  const { kayitOl, googleIleGiris } = useAuth();
  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  function sifreGuc(s: string) {
    if (s.length === 0) return null;
    if (s.length < 6) return "zayif";
    if (s.length < 10 && !/[A-Z]/.test(s)) return "orta";
    return "guclu";
  }

  const guc = sifreGuc(sifre);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (yukleniyor) return;
    setHata(null);
    if (sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setYukleniyor(true);
    try {
      await kayitOl(ad, email, sifre);
      router.push("/firma");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) {
        setHata("Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.");
      } else {
        setHata("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setYukleniyor(false);
    }
  }

  async function handleGoogle() {
    if (yukleniyor) return;
    setHata(null);
    setYukleniyor(true);
    try {
      await googleIleGiris();
      router.push("/firma");
    } catch {
      setHata("Google ile kayıt olurken bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25">
          <LayoutDashboard size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Ücretsiz Başlayın</h1>
        <p className="mt-1 text-sm text-slate-500">Hesap oluşturun, filtrelemeye başlayın</p>
      </div>

      {/* Avantajlar */}
      <div className="mb-5 space-y-1.5">
        {[
          "40+ destek programı anlık filtreleme",
          "Kural tabanlı uygunluk analizi",
          "Premium'a geçerek AI analizine erişin",
        ].map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            {f}
          </div>
        ))}
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={yukleniyor}
        className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
      >
        <Chrome size={17} className="text-blue-500" />
        Google ile Kayıt Ol
      </button>

      <div className="relative mb-4 flex items-center">
        <div className="flex-1 border-t border-slate-200" />
        <span className="mx-3 text-xs text-slate-400">veya e-posta ile</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {hata && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Ad Soyad</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              className="input pl-9"
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder="Ahmet Yılmaz"
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">E-posta</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="email"
              className="input pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Şifre</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="password"
              className="input pl-9"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="En az 6 karakter"
              required
              autoComplete="new-password"
            />
          </div>
          {guc && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex gap-1">
                {(["zayif", "orta", "guclu"] as const).map((s) => (
                  <div
                    key={s}
                    className={`h-1 w-8 rounded-full transition-colors ${
                      guc === "zayif"
                        ? s === "zayif"
                          ? "bg-red-400"
                          : "bg-slate-200"
                        : guc === "orta"
                          ? s !== "guclu"
                            ? "bg-amber-400"
                            : "bg-slate-200"
                          : "bg-emerald-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                {guc === "zayif" ? "Zayıf" : guc === "orta" ? "Orta" : "Güçlü"}
              </span>
            </div>
          )}
        </div>

        <button type="submit" disabled={yukleniyor} className="btn-md btn-primary w-full">
          {yukleniyor ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Hesap Oluştur"
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Kayıt olarak{" "}
          <Link href="/gizlilik" className="underline">
            Gizlilik Politikası
          </Link>
          'nı kabul etmiş olursunuz.
        </p>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-blue-600 hover:text-blue-700">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}
