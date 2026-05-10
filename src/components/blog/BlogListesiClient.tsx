"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Clock, Tag, ArrowRight, Rss } from "lucide-react";
import type { BlogYazisi } from "@/data/blog";
import { cn } from "@/lib/utils";

const KATEGORI_RENK: Record<string, string> = {
  "TÜBİTAK": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "KOSGEB": "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "Sanayi Bakanlığı": "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  "AB Fonları": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
};

const KATEGORI_BANT: Record<string, string> = {
  "TÜBİTAK": "bg-blue-500",
  "KOSGEB": "bg-emerald-500",
  "Sanayi Bakanlığı": "bg-violet-500",
  "AB Fonları": "bg-amber-500",
};

interface Props {
  yazilar: BlogYazisi[];
}

export function BlogListesiClient({ yazilar }: Props) {
  const [secilenKategori, setSecilenKategori] = useState<string | null>(null);

  const kategoriler = useMemo(
    () => Array.from(new Set(yazilar.map((y) => y.kategori))),
    [yazilar]
  );

  const filtrelenmisYazilar = useMemo(
    () =>
      secilenKategori
        ? yazilar.filter((y) => y.kategori === secilenKategori)
        : yazilar,
    [yazilar, secilenKategori]
  );

  return (
    <>
      {/* Kategori filtre */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSecilenKategori(null)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold border transition-all",
            secilenKategori === null
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
        >
          Tümü ({yazilar.length})
        </button>

        {kategoriler.map((k) => {
          const sayac = yazilar.filter((y) => y.kategori === k).length;
          const aktif = secilenKategori === k;
          return (
            <button
              key={k}
              onClick={() => setSecilenKategori(aktif ? null : k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                aktif
                  ? KATEGORI_RENK[k] ?? "bg-slate-100 text-slate-700 border-slate-300"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
                aktif && "ring-2 ring-offset-1 ring-blue-300"
              )}
            >
              {k} ({sayac})
            </button>
          );
        })}

        {/* RSS link */}
        <a
          href="/blog/feed.xml"
          className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 hover:text-orange-600 hover:border-orange-200 transition-all"
          aria-label="RSS Feed"
        >
          <Rss size={11} />
          RSS
        </a>
      </div>

      {/* Boş durum */}
      {filtrelenmisYazilar.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">Bu kategoride henüz yazı yok.</p>
          <button
            onClick={() => setSecilenKategori(null)}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            Tümünü göster
          </button>
        </div>
      )}

      {/* Yazı kartları */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {filtrelenmisYazilar.map((yazi) => (
          <article
            key={yazi.slug}
            className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            {/* Renk bandı */}
            <div className={cn("h-1 w-full", KATEGORI_BANT[yazi.kategori] ?? "bg-slate-400")} />

            <div className="flex flex-col flex-1 p-5">
              {/* Kategori + okuma süresi */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold cursor-pointer transition-all",
                    KATEGORI_RENK[yazi.kategori] ?? "bg-slate-100 text-slate-600 border-slate-200"
                  )}
                  onClick={() =>
                    setSecilenKategori(
                      secilenKategori === yazi.kategori ? null : yazi.kategori
                    )
                  }
                >
                  {yazi.kategori}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock size={11} />
                  {yazi.okumaSuresi} dk
                </span>
              </div>

              {/* Başlık */}
              <h2 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {yazi.baslik}
              </h2>

              {/* Özet */}
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-4">
                {yazi.ozet}
              </p>

              {/* Etiketler */}
              <div className="flex flex-wrap gap-1 mb-4">
                {yazi.etiketler.slice(0, 3).map((e) => (
                  <span
                    key={e}
                    className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5"
                  >
                    <Tag size={8} />
                    {e}
                  </span>
                ))}
                {yazi.etiketler.length > 3 && (
                  <span className="text-[10px] text-slate-400 px-1">
                    +{yazi.etiketler.length - 3}
                  </span>
                )}
              </div>

              {/* Alt bilgi + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <time
                  dateTime={yazi.yayinTarihi}
                  className="text-[11px] text-slate-400"
                >
                  {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <Link
                  href={`/blog/${yazi.slug}`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Oku
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
