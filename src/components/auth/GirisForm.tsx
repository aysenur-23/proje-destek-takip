"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Mail, Lock, AlertCircle, Chrome, Eye, EyeOff } from "lucide-react";

export function GirisForm() {
  const router = useRouter();
  const { girisYap, googleIleGiris } = useAuth();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreGorur, setSifreGorur] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (yukleniyor) return;
    setHata(null);
    setYukleniyor(true);
    try {
      await girisYap(email, sifre);
      router.push("/destekler");
    } catch {
      setHata("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
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
      router.push("/destekler");
    } catch {
      setHata("Google ile giriş yapılırken bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo + başlık */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25">
          <LayoutDashboard size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tekrar hoş geldiniz</h1>
        <p className="mt-1.5 text-sm text-slate-500">Hesabınıza giriş yapın</p>
      </div>

      {/* Google butonu */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={yukleniyor}
        className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow disabled:opacity-60"
      >
        <Chrome size={17} className="text-blue-500" />
        Google ile Giriş Yap
      </button>

      {/* Ayraç */}
      <div className="relative mb-4 flex items-center">
        <div className="flex-1 border-t border-slate-200" />
        <span className="mx-3 text-xs font-medium text-slate-400">veya e-posta ile</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {hata && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 animate-slide-up">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">E-posta</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              className="input pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Şifre</label>
            <Link
              href="/sifremi-unuttum"
              className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
            >
              Şifremi unuttum
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type={sifreGorur ? "text" : "password"}
              className="input pl-9 pr-9"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setSifreGorur(!sifreGorur)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={sifreGorur ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {sifreGorur ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={yukleniyor || !email || !sifre}
          className="btn-md btn-primary w-full"
        >
          {yukleniyor ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Ücretsiz kayıt olun
        </Link>
      </p>
    </div>
  );
}
