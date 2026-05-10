import { tumDestekler } from "@/data/destekler";
import { Search, Sparkles } from "lucide-react";
import { DesteklerWrapper } from "@/components/destekler/DesteklerWrapper";
import Link from "next/link";

export const metadata = {
  title: "Destekler — Destek Takip",
  description: "Firmaya özel hibe, teşvik ve destek programları.",
};

interface Props {
  searchParams: Promise<{ kategori?: string; ara?: string; uygun?: string }>;
}

export default async function DesteklerSayfasi({ searchParams }: Props) {
  const params = await searchParams;
  const aktifDestekler = tumDestekler.filter((d) => d.aktif);

  // URL'den başlangıç filtre değerlerini oku
  const baslangicKategoriler = params.kategori
    ? params.kategori.split(",").filter(Boolean)
    : [];
  const baslangicArama = params.ara ?? "";
  const baslangicSadecUygun = params.uygun === "1";

  return (
    <>
      {/* ── Page header ── */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-32 -top-16 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-slate-100/80 blur-2xl" />

        <div className="container relative py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                  <Search size={13} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  Destek Programları
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Hibe & Teşvik Rehberi
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                <span className="font-semibold text-slate-700">{aktifDestekler.length} aktif program</span>
                {" "}· Firma profiliniz varsa uygunluk otomatik hesaplanır
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                <Sparkles size={12} />
                AI analiz mevcut
              </div>
              <Link href="/firma" className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
                → Profil oluşturarak uygunluk skoru hesaplat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <DesteklerWrapper
          destekler={aktifDestekler}
          baslangicKategoriler={baslangicKategoriler}
          baslangicArama={baslangicArama}
          baslangicSadecUygun={baslangicSadecUygun}
        />
      </div>
    </>
  );
}
