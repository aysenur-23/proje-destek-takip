import { KayitForm } from "@/components/auth/KayitForm";
import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft, Zap, Shield, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Kayıt Ol — Destek Takip",
};

const ozellikler = [
  {
    ikon: Zap,
    baslik: "Anlık Filtreleme",
    aciklama: "40+ program arasından saniyeler içinde uygun olanları bulun",
  },
  {
    ikon: Brain,
    baslik: "AI Analiz",
    aciklama: "Sınırda kalan destekler için yapay zeka yorumu alın",
  },
  {
    ikon: Shield,
    baslik: "Gizlilik",
    aciklama: "Firma bilgileriniz yalnızca tarayıcınızda saklanır",
  },
];

export default function KayitSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sol panel — marka */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 relative overflow-hidden">
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

          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 mb-6">
            <Zap size={11} className="text-blue-400" />
            Ücretsiz · Kayıt gerekmez
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
            Firmanıza uygun hibeleri<br />2 dakikada keşfedin
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Hesap oluşturmadan da kullanabilirsiniz — ancak profilinizi kaydederek uygunluk analizinden tam verim alırsınız.
          </p>

          <div className="space-y-4">
            {ozellikler.map((o) => {
              const Ikon = o.ikon;
              return (
                <div key={o.baslik} className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 shrink-0">
                    <Ikon size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{o.baslik}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{o.aciklama}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Destek Takip
        </p>
      </div>

      {/* Sağ panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-sm mb-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={14} />
            Ana sayfaya dön
          </Link>
        </div>
        <KayitForm />
      </div>
    </div>
  );
}
