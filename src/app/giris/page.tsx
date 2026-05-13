import { GirisForm } from "@/components/auth/GirisForm";
import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Giriş Yap — Destek Takip",
};

export default function GirisSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sol panel — marka */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 relative overflow-hidden select-none">
        {/* Dekor */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Destek Takip</span>
          </Link>

          <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
            Türkiye&apos;nin tüm hibe<br />programları tek yerde
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            TÜBİTAK, KOSGEB, TKDK, AB Fonları ve daha fazlası. Firmanıza özel filtreleme ile dakikalar içinde uygun destekleri keşfedin.
          </p>

          <ul className="space-y-3">
            {[
              "40+ destek programı anlık filtreleme",
              "Kural tabanlı uygunluk skoru",
              "AI destekli proje yazım asistanı",
              "Temel kullanım tamamen ücretsiz",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Destek Takip
        </p>
      </div>

      {/* Sağ panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 bg-slate-50/80">
        <div className="w-full max-w-sm mb-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={14} />
            Ana sayfaya dön
          </Link>
        </div>
        <GirisForm />
      </div>
    </div>
  );
}
