import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import { blogYazilari } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — Hibe & Teşvik Rehberleri",
  description:
    "TÜBİTAK, KOSGEB, AB fonları ve Ar-Ge teşvikleri hakkında güncel rehberler, başvuru ipuçları ve uzman analizleri.",
  openGraph: {
    title: "Blog — Destek Takip",
    description: "Hibe ve teşvik programlarına dair güncel rehberler ve uzman analizleri.",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
  },
};

const KATEGORI_RENK: Record<string, string> = {
  "TÜBİTAK": "bg-blue-50 text-blue-700 border-blue-100",
  "KOSGEB": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Sanayi Bakanlığı": "bg-violet-50 text-violet-700 border-violet-100",
  "AB Fonları": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function BlogSayfasi() {
  const kategoriler = Array.from(new Set(blogYazilari.map((y) => y.kategori)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Rehberler & Analizler
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Hibe ve Teşvik Rehberleri
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              TÜBİTAK, KOSGEB, AB fonları ve Ar-Ge teşvikleri hakkında uzman
              içerikler. Başvuru süreçleri, dikkat edilmesi gerekenler ve sık
              yapılan hatalar.
            </p>
          </div>
        </div>
      </section>

      {/* Kategori filtre */}
      <div className="container pt-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Tümü ({blogYazilari.length})
          </span>
          {kategoriler.map((k) => (
            <span
              key={k}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${KATEGORI_RENK[k] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {k}
            </span>
          ))}
        </div>

        {/* Yazı listesi */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
          {blogYazilari
            .slice()
            .sort((a, b) => b.yayinTarihi.localeCompare(a.yayinTarihi))
            .map((yazi) => (
              <article
                key={yazi.slug}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                {/* Renk bandı */}
                <div
                  className={`h-1 w-full ${
                    yazi.kategori === "TÜBİTAK"
                      ? "bg-blue-500"
                      : yazi.kategori === "KOSGEB"
                      ? "bg-emerald-500"
                      : yazi.kategori === "AB Fonları"
                      ? "bg-amber-500"
                      : "bg-violet-500"
                  }`}
                />

                <div className="flex flex-col flex-1 p-5">
                  {/* Kategori + okuma süresi */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        KATEGORI_RENK[yazi.kategori] ?? "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {yazi.kategori}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      {yazi.okumaSuresi} dk okuma
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
                    <time className="text-[11px] text-slate-400">
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
      </div>
    </div>
  );
}
